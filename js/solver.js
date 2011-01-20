
 /* Function defining object */
var ComplexFunction = function(pri, prefix, func, infinite) {
    var p = pri, x = prefix, f = func,
        inf = infinite ? infinite : false;
    
    var evaluate = function(args) {
        if(args.length == this.length || this.infinite) {
            return f.apply(this,args);
        } else {
            // Error
            alert("Error:  Incorrect number of args ("+args.length+") given to " + f + " which expects " + this.length + " arguments");
        }
    };
    
    var stringify = function() {
        return f + "["+this.prefix+","+this.priority+"]"
    };
    
    return {
        priority: p,
        prefix: x,
        infinite: inf,
        evaluate: evaluate,
        length: f.length,
        toString: stringify
    };
};

var Constant = function(value) {
    var v = value;
    
    var stringify = function() {
        return this.value;
    };
    
    return {
        value : v,
        toString: stringify
    };
};

/* For defined functions */
var Functions = {};
/* For defined constants */
var Constants = {};

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
            active = [],
            objs = {};
            
        console.log("new QGEquation().");
        
        var logObject = function(obj) {
            if(typeof obj != "undefined" && typeof obj.type == "string")
            {
                var objType = obj.type;
                if(objType == "QGFunction" || objType == "QGVariable"
                    || objType == "QGConstant")
                {
                    var className = obj.type;
                    var jects = objects[className];
                    // No group yet
                    if(typeof jects == "undefined")
                    {
                        jects = {list: [], objs: {}};
                        objects[className] = jects;
                        // Insert object name into list
                        jects.list.push(className);
                        // Add to object
                        jects.objs[obj.name()] = obj;
                    }
                    jects[obj.name()] = obj;
                }
            }
            else
            {
                alert("Error: Trying to log invalid object: " + obj);
            }
        };

        var append = function(item) {
            logObject(item);
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
                    else if(item.type == "QGParamDivider")
                    {
                        // Replace on stack
                        this.active.push(curr);
                        // Add divider
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
                    else if(item.type == "QGParamDivider")
                    {
                        // Replace curr item
                        this.active.push(curr);
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
                    if(item.type == "QGParamDivider")
                    {
                        if(!curr.closed())
                        {
                            // Error
                            alert("Error: Leading divider in parameter list");
                        }
                        else
                        {
                            this.active.push(curr);
                            this.active.push(item);
                        }
                    }
                    else
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
                else if(curr.type == "QGParamDivider")
                {
                    if(item.type == "QGParamDivider")
                    {
                        // Error
                        alert("Error: Consecutive parameter dividers in parameter list");
                    }
                    else
                    {
                        this.active.push(curr);
                        this.active.push(item);
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
                console.log("Call to close " + curr.toString() + " with prev: " + prev + ", parenClosed: " + parenClosed + ". Stack: " + this.active.toString());
                if(curr.type == "QGFunction")
                {
                    // Prefixed functions can be closed
                    if((!curr.closed() || curr.func.infinite) && curr.prefix() && parenClosed && prev.type == "QGBlock")
                    {
                        // Append current arg and replace
                        curr.append(prev);
                        this.active.push(curr);
                        console.log("Current stack: " + this.active.toString());
                        // if((typeof prev == "undefined") || prev.type != "QGBlock")
                        // {
                        //     this.close(curr);
                        // }
                    }
                    else if(!parenClosed && curr.closed())
                    {
                        // Handle parameter lists
                        if((typeof prev != "undefined") && prev.type == "QGParamDivider")
                        {
                            prev.append(curr);
                            // Haven't found parens yet, close
                            this.close(prev, false);
                        }
                        else
                        {
                            // Haven't found parens yet, close
                            this.close(curr, false);
                        }
                    }
                    else if(!parenClosed && !curr.closed() && (typeof prev != "undefined"))
                    {
                        if((typeof prev != "undefined") && prev.type == "QGParamDivider")
                        {
                            // If we have multiple args in parameter list, take last added and give to function
                            if(!curr.prefix() && prev.params.length > 1)
                            {
                                var prevHeader = prev.params.pop();
                                if(prevHeader.type == "QGFunction" && !prevHeader.prefix()
                                    && prevHeader.priority() < curr.priority())
                                {
                                    // Swap args
                                    curr.append(prevHead.pop());
                                    prevHead.push(curr);
                                    prev.append(prevHead);
                                }
                                else
                                {
                                    curr.append(prevHeader);
                                    prev.append(curr);
                                }
                                this.close(prev, false);
                            }
                            else
                            {
                                // Error.  Can't add incomplete functions to the parameter list
                                // A function must be completed by a block
                                alert("Error:  Can't add incomplete functions to the parameter list.");
                            }
                        }
                        else
                        {
                            // Verify binding of functions
                            if((typeof prev != "undefined") && prev.type == "QGFunction"
                                && !curr.prefix() && !curr.closed()
                                && curr.priority() > prev.priority())
                            {
                                // Use first from prev as second for curr
                                curr.append(prev.pop());
                                // And then use curr for first from prev
                                prev.push(curr);
                                console.log("Current stack: " + this.active.toString());
                                // Haven't found parens yet, close
                                this.close(prev, false);
                            }
                            else
                            {
                                curr.append(prev);
                                console.log("Current stack: " + this.active.toString());
                                // Haven't found parens yet, close
                                this.close(curr, false);
                            }
                        }
                    }
                    else
                    {
                        console.log("Warning: Trying to close function " + curr.toString() + " but status: [closed: "+curr.closed()+",prefixed:"+curr.prefix()+",parenFound:"+parenClosed+",prevType:"+(prev?prev.type:prev)+"].  Breaking...");
                        if(parenClosed)
                        {
                            // Replace items on stack since we didn't use them
                            this.active.push(curr);
                            if(typeof prev != "undefined")
                            {
                                this.active.push(prev);
                            }
                            console.log("Current stack: " + this.active.toString());
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
                      console.log("Current stack: " + this.active.toString());
                      // Look ahead to see if this is a function block or normal block
                      if(this.active.length > 0)
                      {
                          if(this.active[this.active.length - 1].type == "QGFunction")
                          {
                              this.close(curr, true);
                          }
                          else
                          {
                              this.active.push(curr);
                              console.log("Current stack: " + this.active.toString());
                          }
                      }
                      else
                      {
                          this.active.push(curr);
                          console.log("Current stack: " + this.active.toString());
                      }
                    }
                    else
                    {
                        // Recurse because this one was already closed
                        this.close(curr, false);
                    }
                }
                else if(curr.type == "QGParamDivider")
                {
                    // If we have a previous argument, add to list
                    if((typeof prev != "undefined") && prev.type != "QGParamDivider")
                    {
                        if(prev.type == "QGFunction" && !prev.closed())
                        {
                            // Error
                            alert("Error:  Can't add incomplete functions to the parameter list.");
                        }
                        else
                        {
                            curr.append(prev);
                            this.close(curr,false);
                            // Re-add curr to list
                            //this.active.push(curr);
                            //console.log("Current stack: " + this.active.toString());
                        }
                    }
                    else if(typeof prev != "undefined")
                    {
                        if(prev.params.length > 0)
                        {
                            // alert("Error: Function parameter divider with no trailing parameter or two consecutive dividers");
                            // Replace curr with prev (just ignore duplicate divider)
                            this.close(prev,false);
                        }
                        else
                        {
                            // Double divider
                            alert("Error: Function parameter divider with no trailing parameter or two consecutive dividers");
                        } 
                    }
                }
                else
                {
                    // Try to recurse since we haven't found item to close yet
                    if((typeof prev != "undefined") && prev.type == "QGParamDivider")
                    {
                        prev.append(curr);
                        this.close(prev,false);
                    }
                    else
                    {
                        this.close(curr,false);
                    }
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
                console.log("Reducing "+this.active.length+" items");
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
                        if(prev.type == "QGFunction" && !curr.prefix() && !prev.prefix()
                            && curr.priority() > prev.priority())
                        {
                            // Use first from prev as second for curr
                            curr.append(prev.pop());
                            // And then use curr for first from prev
                            prev.push(curr);
                            // Re-add prev to stack
                            this.active.push(prev);
                        }
                        else
                        {
                            curr.append(prev);
                        }
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
        
        var getObjectClass = function(className) {
            var objs = undefined;
            if(typeof className == "string")
            {
                objs = this.objects[className];
                if(typeof objs != "undefined")
                {
                    objs = objs.list;
                }
                else
                {
                    objs = [];
                }
            }
            else
            {
                objs = [];
            }
            return objs;
        };
        
        return {
            append: append,
            finalize: reduce,
            solve: solve,
            close: close,
            toString: stringify,
            content: inner,
            active: active,
            objects: objs,
            variables: getObjectClass("QGVariable"),
            type: "QGEquation"
        };
    };
    
    var QGFunction = function(functionString) {
        var func = toFunction(functionString),
            funcName = functionString,
            args = [];
            
        console.log("new QGFunction("+functionString+")");

        var append = function(item) {
            if(item.type == "QGBlock" && (typeof item.content != "undefined")
                && item.content.type == "QGParamDivider")
            {
                var itemList = item.content.params,
                    listLen = itemList.length;
                // Params in reverse order in QGParamDivider
                for(var i = listLen - 1; i > -1; i--)
                {
                    this.args.push(itemList[i]);
                }
            }
            else
            {
                this.args.push(item);
            }
            console.log("Args for "+ this.funcName +": " + this.args.toString());
        };
        
        var pri = function() {
            return this.func.priority;
        };
        
        var pre = function() {
            return this.func.prefix;
        };
        
        var closed = function() {
            var argLen = this.args.length,
                param, content;
            if(argLen == 1 && this.prefix())
            {
                param = this.args[0];
                if(typeof param != "undefined")
                {
                    if(param.type == "QGBlock")
                    {
                        content = param.content;
                        if(typeof content != "undefined" && content.type == "QGParamDivider")
                        {
                            argLen = content.params.length;
                        }
                    }
                    else if(param.type == "QGParamDivider")
                    {
                        argLen = param.params.length;
                    }
                }
            }
            return this.func.length == argLen || this.func.infinite;
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
                if(len == 0 || this.args[0].type != "QGBlock")
                {
                    str += "(";
                }
                for(var i = 0; i < len; i++)
                {
                    str += this.args[i].toString();
                    if(i != len - 1)
                    {
                      str += ",";
                    }
                }
                if(len == 0 || this.args[0].type != "QGBlock")
                {
                    str += ")";
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
        
        var popLeft = function() {
            if(this.args.length > 0)
            {
                var temp = this.args[0];
                this.args[0] = undefined;
                console.log("Args for "+ this.funcName +": " + this.args.toString());
                return temp;
            } else {
                alert("Error: Trying to pop from 0 args");
            }
        };
        
        var pushLeft = function(item) {
            if(this.args.length == 0)
            {
                this.args.push(item);
            } else {
                this.args[0] = item;
            }
            console.log("Args for "+ this.funcName +": " + this.args.toString());
        };
        
        var toLabel = function() {
            return this.funcName;
        };
        
        return {
            append: append,
            priority: pri,
            closed: closed,
            extract: extract,
            solve: solve,
            toString: stringify,
            pop: popLeft,
            push: pushLeft,
            name: toLabel,
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
    
    var QGParamDivider = function() {
        var params = [];
        
        console.log("new QGParamDivider()");
        
        var append = function(param) {
            this.params.push(param);
        };
        
        var stringify = function() {
            var str = ",";
            for(var i = this.params.length - 1; i > -1; i--)
            {
                str += this.params[i].toString();
                if(i != 0)
                {
                    str += ","
                }
            }
            return str;
        };
        
        var solve = function(context) {
            var solvedParams = [],
                param;
            for(var i = this.params.length - 1; i > -1; i--)
            {
                param = this.params[i];
                solvedParams[this.params.length - 1 - i] = param.solve(context);
            }
            return solvedParams;
        };
      
        return {
            params: params,
            append: append,
            solve: solve,
            toString: stringify,
            type: "QGParamDivider"
        };
    };
    
    var QGVariable = function(variableName) {
        var v = variableName;
        
        console.log("new QGVariable("+variableName+")");
      
        var solve = function(context) {
            var val = context[this.name()];
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
            return this.varName;
        };
        
        var toLabel = function() {
            return this.varName;
        };
        
        return {
            solve: solve,
            toString: stringify,
            name: toLabel,
            varName: v,
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
        
        var toLabel = function() {
            return this.value + "";
        };
        
        return {
            solve: solve,
            toString: stringify,
            name: toLabel,
            value: v.value,
            type: "QGConstant"
        };
    };
    
    var toFunction = function(functionName) {
        return Functions[functionName];
    };
    
    /* OUR ONLY GLOBALS ARE DECLARED
     HERE- array of variable names to legend info, array of variable names to values graphial graph*/
     var parsedEquation = undefined;


    /* alphaNumericType returns the alphaNumericType of the single char passed */
    /* alphaNumericType:
        6 : open parentheses
        5 : closed parenthesis
        4 : operator
        3 : function parameter divider
        2 : numeric
        1 : alpha
        0 : unsupported
     */
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
        if (/[,]/.test(singlet)) {
            returnVal = 3;
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
            b, c, builtString = "",
            builtNumber = "",
            innerType;
        // Remove whitespace
        rawEquation = rawEquation.replace(/\s/g,"");
        console.log("Parsing: " + rawEquation);
        
        for(var i = 0; i < rawEquation.length; i++) {
            // Previous character
            b = c;
            // Current character
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
                // Function parameter divider
                case 3:
                    // If we are working on a string
                    if(builtString.length > 0) {
                        // check if it is a constant
                        var constant = Constants[builtString]
                        if(typeof constant != "undefined")
                        {
                            eq.append(new QGConstant(constant));
                        }
                        else
                        {
                            // Otherwise it is a variable
                            eq.append(new QGVariable(builtString));
                        }
                        builtString = "";
                    }
                    // If we are working on a number, assume its a constant
                    else if(builtNumber.length > 0)
                    {
                        console.log("Parsing '"+builtNumber+"' to " + parseFloat(builtNumber));
                        eq.append(new QGConstant(new Constant(parseFloat(builtNumber))));
                        builtNumber = "";
                    }
                    // Append divider
                    eq.append(new QGParamDivider());
                    break;
                // Compressed function reference
                case 4:
                    // If we are working on a string
                    if(builtString.length > 0) {
                        // check if it is a constant
                        var constant = Constants[builtString]
                        if(typeof constant != "undefined")
                        {
                            eq.append(new QGConstant(constant));
                        }
                        else
                        {
                            // Otherwise it is a variable
                            eq.append(new QGVariable(builtString));
                        }
                        builtString = "";
                    }
                    // If we are working on a number, assume its a constant
                    else if(builtNumber.length > 0)
                    {
                        console.log("Parsing '"+builtNumber+"' to " + parseFloat(builtNumber));
                        if(builtNumber == "-")
                        {
                            alert("Error:  Standalone '-' is not a number.  Put some numerals after it.");
                        }
                        else
                        {
                            eq.append(new QGConstant(new Constant(parseFloat(builtNumber))));
                        }
                        builtNumber = "";
                    }
                    // Check for negation
                    var prevType = alphaNumericType(b);
                    if(c == "-" && (prevType == 3 || prevType == 4 || prevType == 6))
                    {
                        // Minus
                        builtNumber += c;
                    }
                    else
                    {
                        console.log("Determined '" + c + "' is a function since prevType(" + b + ") is " + prevType);
                        // Append function
                        eq.append(new QGFunction(c));
                    }
                    break;
                // Closing char
                case 5:
                    // Close any open strings
                    if(builtString.length > 0) {
                        // check if it is a constant
                        var constant = Constants[builtString]
                        if(typeof constant != "undefined")
                        {
                            eq.append(new QGConstant(constant));
                        }
                        else
                        {
                            // Otherwise it is a variable
                            eq.append(new QGVariable(builtString));
                        }
                        builtString = "";
                    }
                    // If we are working on a number, assume its a constant
                    else if(builtNumber.length > 0)
                    {
                        console.log("Parsing '"+builtNumber+"' to " + parseFloat(builtNumber));
                        eq.append(new QGConstant(new Constant(parseFloat(builtNumber))));
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
            // check if it is a constant
            var constant = Constants[builtString]
            if(typeof constant != "undefined")
            {
                eq.append(new QGConstant(constant));
            }
            else
            {
                // Otherwise it is a variable
                eq.append(new QGVariable(builtString));
            }
            builtString = "";
        }
        else if(builtNumber.length > 0)
        {
            console.log("Parsing '"+builtNumber+"' to " + parseFloat(builtNumber));
            eq.append(new QGConstant(new Constant(parseFloat(builtNumber))));
            builtNumber = "";
        }
        // Finalize parsing
        eq.finalize();
        // Save object
        this.equation = eq;
        // Show parsed equation
        //alert(eq.toString() + " = " + eq.solve({x: 10}));
        // Return parsed object
        return eq;
    };
    
    var solve = function(context) {
        if(typeof this.equation != "undefined")
        {
            if(typeof context != "undefined")
            {
                return this.equation.solve(context);
            }
            else
            {
                alert("Error: No context provided to solver");
            }
        }
        else
        {
            alert("Error: Unable to solve because no equation available");
        }
    };
    
    return {
        parse: parseEquation,
        solve: solve,
        equation: parsedEquation
    };
}();
