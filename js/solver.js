
 /* Function defining object */
var ComplexFunction = function(pri, prefix, func) {
    var p = pri, x = prefix, f = func;
    
    var evaluate = function(args) {
        if(args.length == this.length) {
            return f.apply(this,args);
        } else {
            // Error
            alert("Error:  Incorrect number of args ("+args.length+") given to " + f + " which expects " + this.length + " arguments");
        }
    };
    
    return {
        priority: p,
        prefix: x,
        evaluate: evaluate,
        length: f.length
    };
};

/* For stored functions */
var Functions = {};

/*
 * TODO:
 * - Add reduction when appending new functions.  Need to check binding for existing items before adding (might need to collapse)
 * 
*/


var QGSolver = function() {
    /* Inner classes */
    var QGEquation = function() {
        // Member variables
        var inner = undefined,
            active = [];
            
        console.log("new QGEquation().");

        var append = function(item) {
            // If we have no item yet
            if(this.active.length == 0) {
                this.active.push(item);
            }
            else
            {
                // Active item
                var curr = this.active.pop();
                
                if(curr.type == "QGFunction")
                {
                    if(item.type == "QGFunction")
                    {
                        if(item.prefix())
                        {
                            // Re-add old
                            this.active.push(curr);
                            // Add new
                            this.active.push(item);
                        }
                        else
                        {
                            // Order of application depends on priority
                            if(item.priority() > curr.priority())
                            {
                                // Extract previous parameter
                                var oldArg = curr.extract();
                                // Inject to current function
                                item.append(oldArg);
                                // Inject new item into existing function
                                // This happens on closing
                                //curr.append(item);
                                this.active.push(curr);
                                this.active.push(item);
                            }
                            else if(item.priority() <= curr.priority())
                            {
                                // Insert as spot into existing function
                                item.append(curr);
                                this.active.push(item);
                            }
                        }
                    }
                    else if(item.type == "QGBlock")
                    {
                        // Readd function
                        this.active.push(curr);
                        // Dont compress to current function yet
                        this.active.push(item);
                    }
                    else
                    {
                        if(!curr.closed())
                        {
                            curr.append(item);
                            // Replace
                            this.active.push(curr);
                        }
                        else
                        {
                            // Error
                            alert("Error: Trying to append to closed function.");
                        }
                    }
                }
                else if(curr.type == "QGConstant"
                  || curr.type == "QGVariable")
                {
                    if(item.type == "QGFunction" && !item.prefix())
                    {
                        item.append(curr);
                        // Push new item to stack
                        this.active.push(item);
                    }
                    else 
                    {
                        // Error
                        alert("Error: Curr is " + curr.toString() + ", item is " + item.toString());
                    }
                }
                else if(curr.type == "QGBlock")
                {
                    if(!curr.closed())
                    {
                        // Delay append until closing
                        // curr.append(item);
                        this.active.push(curr);
                        this.active.push(item);
                    }
                    else
                    {
                        if(item.type == "QGFunction" && !item.prefix())
                        {
                            // Use block as first item in function
                            item.append(curr);
                            this.active.push(item);
                        }
                        else
                        {
                            // Error
                            alert("Error: Trying to add to closed block");
                        }
                    }
                }
            }
            console.log("Current stack: " + this.active.toString());
        };
        
        // Called when parenthesis are closed
        var close = function(prev, parenClosed) {
            if(typeof parenClosed == "undefined")
            {
                parenClosed = false;
            }
            // Close current item
            if(this.active.length > 0)
            {
                var curr = this.active.pop();
                console.log("Call to close " + curr.toString() + " with prev: " + prev + ", parenClosed: " + parenClosed);
                if(curr.type == "QGFunction")
                {
                    // Prefixed functions can be closed
                    if(!curr.closed() && curr.prefix() && parenClosed && prev.type == "QGBlock")
                    {
                        // Append current arg and replace
                        curr.append(prev);
                        this.active.push(curr);
                        // if((typeof prev == "undefined") || prev.type != "QGBlock")
                        // {
                        //     this.close(curr);
                        // }
                    }
                    else if(!parenClosed && curr.closed())
                    {
                        // Haven't found parens yet, close
                        this.close(curr, false);
                    }
                    else if(!parenClosed && !curr.closed() && (typeof prev != "undefined"))
                    {
                        curr.append(prev);
                        // Haven't found parens yet, close
                        this.close(curr, false);
                    }
                    else
                    {
                        // Attempt to recurse until we can close
                        //this.close(curr);
                        console.log("Warning: Trying to close function " + curr.toString() + " but status: [closed: "+curr.closed()+",prefixed:"+curr.prefix()+",parenFound:"+parenClosed+",prevType:"+(prev?prev.type:prev)+"].  Breaking...");
                        if(parenClosed)
                        {
                            // Replace items on stack since we didn't use them
                            this.active.push(curr);
                            if(typeof prev != "undefined")
                            {
                                this.active.push(prev);
                            }
                        }
                    }
                }
                else if(curr.type == "QGBlock")
                {
                    if(!curr.closed())
                    {
                      // Assign tree head to block
                      curr.append(prev);
                      // Mark block as closed
                      curr.close();
                      // Look ahead to see if this is a function block or normal block
                      if(this.active.length > 0)
                      {
                          if(this.active[this.active.length - 1].type == "QGFunction")
                          {
                              this.close(curr, true);
                          }
                      }
                      else
                      {
                          this.active.push(curr);
                      }
                    }
                    else
                    {
                        // Recurse because this one was already closed
                        this.close(curr, false);
                    }
                }
                else
                {
                    // Try to recurse since we haven't found item to close yet
                    this.close(curr,false);
                }
            }
            else
            {
                // Error, no item to close
                alert("Error: No item to close.  " + this.active);
            }
        };
        
        // Try to close stack
        var reduce = function() {
            var curr, prev = undefined;
            if(this.active.length > 0)
            {
                while(this.active.length > 0)
                {
                    curr = this.active.pop();
                    if(curr.type == "QGConstant"
                        || curr.type == "QGVariable"
                        || ((curr.type == "QGBlock" || curr.type == "QGFunction")
                          && curr.closed()))
                    {
                        this.content = curr;
                    }
                    else if(curr.type == "QGFunction" && !curr.closed() && (typeof prev != "undefined"))
                    {
                        curr.append(prev);
                        // Recheck for closure of this function
                        this.active.push(curr);
                    }
                    else
                    {
                        // Error.  Unclosed items
                        alert("Error: Unclosed item in reduce: " + curr.toString());
                        this.content = undefined;
                    }
                    prev = curr;
                }
            }
            else
            {
                alert("Error: No items to reduce...");
            }
        };
        
        var solve = function(context) {
            if( typeof this.content != "undefined" )
            {
                return this.content.solve(context);
            }
            else
            {
                // Error
                alert("Error: Cannot solve 'undefined' function");
            }
        };
        
        var stringify = function() {
            return this.content.toString();
        };
        
        return {
            append: append,
            finalize: reduce,
            solve: solve,
            close: close,
            toString: stringify,
            content: inner,
            active: active,
            type: "QGEquation"
        };
    };
    
    var QGFunction = function(functionString) {
        var func = toFunction(functionString),
            funcName = functionString,
            args = [];
            
        console.log("new QGFunction("+functionString+")");

        var append = function(item) {
            this.args.push(item);
            console.log("Args for "+ this.funcName +": " + this.args.toString());
        };
        
        var pri = function() {
            return this.func.priority;
        };
        
        var pre = function() {
            return this.func.prefix;
        };
        
        var closed = function() {
            return this.func.length == this.args.length;
        };
        
        // Removes last argument
        var extract = function() {
            if(this.args.length > 0) {
                return this.args.pop();
            }
            else
            {
                alert("Error: Call to extract but no available parameters");
            }
        };
        
        var solve = function(context) {
            // Solve args first
            var solvedArgs = [],
              argsLen = this.args.length;
            for(var i = 0; i < argsLen; i++)
            {
                solvedArgs.push(this.args[i].solve(context));
            }
            // Pass into functions
            return this.func.evaluate(solvedArgs);
        };
        
        var stringify = function() {
            var str = "";
            if(this.prefix())
            {
                str += this.funcName;
                var len = this.args.length;
                for(var i = 0; i < len; i++)
                {
                    str += this.args.toString();
                    if(i != len - 1)
                    {
                      str += ",";
                    }
                }
            }
            else
            {
                if(this.length() == 1)
                {
                    str += this.funcName;
                    str += this.args[0].toString();
                }
                if(this.length() == 2)
                {
                    if(this.args.length > 0)
                    {
                        str += this.args[0].toString();
                    }
                    str += this.funcName;
                    if(this.args.length > 1)
                    {
                        str += this.args[1].toString();
                    }
                }
            }
            return str;
        };
        
        var len = function() {
            return this.func.length;
        };
        
        return {
            append: append,
            priority: pri,
            closed: closed,
            extract: extract,
            solve: solve,
            toString: stringify,
            args: args,
            func: func,
            funcName: funcName,
            length: len,
            prefix: pre,
            type: "QGFunction"
        };
    };
    
    var QGBlock = function() {
        var inner = undefined,
            c = false;
            
        console.log("new QGBlock()");

        var close = function() {
            this.c = true;
        };
        
        var append = function(item) {
            this.content = item;
        };
        
        var stringify = function() {
            if(typeof this.content == "undefined")
            {
                return "()";
            }
            else
            {
                return "(" + this.content.toString() + ")";
            }
        };
        
        var solve = function(context) {
            if(typeof this.content != "undefined")
            {
                return this.content.solve(context);
            }
        };
        
        var closed = function() {
            return this.c;
        }
        
        return {
            append: append,
            close: close,
            solve: solve,
            toString: stringify,
            closed: closed,
            c: c,
            content: inner,
            type: "QGBlock"
        };
    };
    
    var QGVariable = function(variableName) {
        var v = variableName;
        
        console.log("new QGVariable("+variableName+")");
      
        var solve = function(context) {
            var val = context[this.value];
            if(typeof val != "undefined")
            {
                // If context value is a function
                if(typeof val == "function")
                {
                    return val();
                }
                else
                {
                    return val;
                }
            }
            else
            {
                alert("Error: Unable to find variable '"+val+"' in context");
            }
        };
        
        var stringify = function() {
            return this.value;
        };
        
        return {
            solve: solve,
            toString: stringify,
            value: v,
            type: "QGVariable"
        };
    };
    
    var QGConstant = function(value) {
        var v = value;
        
        console.log("new QGConstant("+value+")");
        
        var solve = function(context) {
            return this.value;
        };
        
        var stringify = function() {
            return this.value;
        };
        
        return {
            solve: solve,
            toString: stringify,
            value: v,
            type: "QGConstant"
        };
    };
    
    var toFunction = function(functionName) {
        return Functions[functionName];
    };
    
    /* OUR ONLY GLOBALS ARE DECLARED
     HERE- array of variable names to legend info, array of variable names to values graphial graph*/


    /* alphaNumericType returns the alphaNumericType of the single char passed */
    /* alphaNumericType:
     6=open parentheses
     5=closed parenthesis 4=operator,  2 =numeric, 1=alpha, 0=unsupported
     operator*/
    var alphaNumericType = function(singlet) {
        var returnVal;

        /* The most inclusive test must be done first, to subsecede subsequent tests */
        if (/[^a-zA-Z0-9. _]/.test(singlet)) {
            returnVal = 0;
        }
        if (/[\[\(\{]/.test(singlet)) {
            returnVal = 6;
        }
        if (/[\]\)\}]/.test(singlet)) {
            returnVal = 5;
        }
        if (/[\é\ê\ò\ñ\ð\ï\î\í\ì\ë\÷\ö\õ\ô\ó\û\ÿ\ù\ø\ü\ú\þ\ÿ\,\&\@\#\~\_\:\;\+\-\/\*\^\%\\\!]/.test(singlet)) {
            returnVal = 4;
        }
        if (/[0-9\\.]/.test(singlet)) {
            returnVal = 2;
        }
        if (/[a-zA-Z]/.test(singlet)) {
            returnVal = 1;
        }
        return returnVal;
    }
    var parseEquation = function(rawEquation) {
        var eq = new QGEquation(),
        c, builtString = "",
        builtNumber = "",
        innerType;
        for(var i = 0; i < rawEquation.length; i++) {
            c = rawEquation[i];
            switch(alphaNumericType(c)) {
                // Letter
                case 1:
                    builtString += c;
                    break;
                // Number or decimal place
                case 2:
                    // If we have a string in progress, append num
                    if(builtString.length > 0) {
                        builtString += c;
                    } else {
                        builtNumber += c;
                    }
                    break;
                // Not used
                case 3:
                    break;
                // Compressed function reference
                case 4:
                    // If we are working on a string, assume its a variable
                    if(builtString.length > 0) {
                        eq.append(new QGVariable(builtString));
                        builtString = "";
                    }
                    // If we are working on a number, assume its a constant
                    else if(builtNumber.length > 0)
                    {
                        console.log("Parsing '"+builtNumber+"' to " + parseFloat(builtNumber));
                        eq.append(new QGConstant(parseFloat(builtNumber)));
                        builtNumber = "";
                    }
                    // Append function
                    eq.append(new QGFunction(c));
                    break;
                // Closing char
                case 5:
                    // Close any open strings
                    if(builtString.length > 0) {
                        eq.append(new QGVariable(builtString));
                        builtString = "";
                    }
                    // If we are working on a number, assume its a constant
                    else if(builtNumber.length > 0)
                    {
                        console.log("Parsing '"+builtNumber+"' to " + parseFloat(builtNumber));
                        eq.append(new QGConstant(parseFloat(builtNumber)));
                        builtNumber = "";
                    }
                    eq.close();
                    break;
                // Opening char
                case 6:
                    // If we are working on a string, assume its a function
                    if(builtString.length > 0) {
                        eq.append(new QGFunction(builtString));
                        builtString = "";
                    }
                    // Always new block
                    eq.append(new QGBlock());
                    break;
                // Unknown type
                default:
                    break;
            };
        }
        // Clear any final matches
        if(builtString.length > 0) {
            eq.append(new QGVariable(builtString));
            builtString = "";
        }
        else if(builtNumber.length > 0)
        {
            console.log("Parsing '"+builtNumber+"' to " + parseFloat(builtNumber));
            eq.append(new QGConstant(parseFloat(builtNumber)));
            builtNumber = "";
        }
        // Finalize parsing
        eq.finalize();
        // Show parsed equation
        alert(eq.toString() + " = " + eq.solve({}));
        // Return parsed object
        return eq;
    };
    
    return {
        parse: parseEquation
    };
}();
