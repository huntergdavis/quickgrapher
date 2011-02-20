
 /* Function defining object */
var ComplexFunction = function(pri, prefix, func, infinite) {
    var p = pri, x = prefix, f = func,
        inf = infinite ? infinite : false;
    
    var evaluate = function(args) {
        if(args.length == this.length || this.infinite) {
            return f.apply(this,args);
        } else {
            // Error
            logErrorMessage("Error:  Incorrect number of args ("+args.length+") given to " + f + " which expects " + this.length + " arguments");
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
    
    var stringify = function(context) {
        return this.value;
    };
    
    var htmlify = function(prefix, element, context) {
        return this.value;
    };
    
    return {
        value : v,
        toString: stringify,
        toHTML: htmlify
    };
};

var Context = function(vars) {
    var varList = vars,
        v = {};
        
    var setValue = function(name, value) {
        this.values[name] = value;
    };
    
    var toObject = function() {
        var result = {},
            varLen = this.vars.length,
            v, value;
            
        for(var i = 0; i < varLen; i++)
        {
            v = this.vars[i];
            value = this.values[v];
            if(typeof value != "undefined")
            {
                result[v] = value;
            }
        }
        
        return result;
    };
    
    var stringify = function() {
        var result = "",
            varLen = this.vars.length,
            v, value;
            
        for(var i = 0; i < varLen; i++)
        {
            v = this.vars[i];
            value = this.values[v];
            result += v + "=";
            if(typeof value != "undefined")
            {
                if(typeof value == "object"
                    && typeof value.value != "undefined")
                {
                    result += "f." + value.value;
                }
                else
                {
                    result += value;
                }
            }
            result += ",";
        }
        return result;
    };
        
    return {
        vars: varList,
        set: setValue,
        values: v,
        toObj: toObject,
        toString: stringify
    };
};

var VariableIterator = function(start, step, stepper) {
    var curr = start, inc = step,
        iter = stepper;
    // Default stepper if none specified
    if(typeof iter == "undefined")
    {
        // Linear stepper
        iter = function(curr, step) {
            return curr + step;
        };
    }
    
    // Return current value and step once
    // according to the step value and the steppper
    var iterate = function() {
        var result = this.value;
        this.value = this.stepper(this.value, this.increment);
        return result;
    };
    
    return {
        value: curr,
        stepper: iter,
        increment: inc,
        step: iterate 
    };
};

/* For defined functions */
var Functions = {};
/* For defined constants */
var Constants = {};
/* For defined examples */
var Examples = [];

/*
 * TODO:
 * - Add reduction when appending new functions.  Need to check binding for existing items before adding (might need to collapse)
 * 
*/


var QGSolver = function() {
    // Global flags,
    var debug = false;
    var testGen = false;
    /* Inner classes */
    var QGEquation = function() {
        // Member variables
        var inner = undefined,
            active = [],
            objs = {};
            
        logDebugMessage("new QGEquation().");
        var logObject = function(obj) {
            if(typeof obj != "undefined" && typeof obj.type == "string")
            {
                var objType = obj.type;
                if(objType == "QGFunction" || objType == "QGVariable"
                    || objType == "QGConstant")
                {
                    var className = obj.type;
                    var jects = this.objects[className];
                    // No group yet.  Create
                    if(typeof jects == "undefined")
                    {
                        jects = {list: [], objs: {}};
                        this.objects[className] = jects;
                    }
                    // Check if we have this item already
                    var objs = jects.objs,
                        name = obj.name();
                    if(typeof objs[name] == "undefined")
                    {
                        // Insert object name into list
                        jects.list.push(name);
                        // Add to object
                        objs[name] = obj;
                    }
                }
            }
            else
            {
                logErrorMessage("Error: Trying to log invalid object: " + obj);
            }
        };

        var append = function(item) {
            this.logObject(item);
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
                            if(!curr.prefix() && item.priority() > curr.priority())
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
                            else
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
                            logErrorMessage("Error: Trying to append to closed function.");
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
                        logErrorMessage("Error: Curr is " + curr.toString() + ", item is " + item.toString());
                    }
                }
                else if(curr.type == "QGBlock")
                {
                    if(item.type == "QGParamDivider")
                    {
                        if(!curr.closed())
                        {
                            // Error
                            logErrorMessage("Error: Leading divider in parameter list");
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
                                logErrorMessage("Error: Trying to add to closed block");
                            }
                        }
                    }
                }
                else if(curr.type == "QGParamDivider")
                {
                    if(item.type == "QGParamDivider")
                    {
                        // Error
                        logErrorMessage("Error: Consecutive parameter dividers in parameter list");
                    }
                    else
                    {
                        this.active.push(curr);
                        this.active.push(item);
                    }
                }
            }
        logDebugMessage("Current stack: " + this.active.toString());
         
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
                logDebugMessage("Call to close " + curr.toString() + " with prev: " + prev + ", parenClosed: " + parenClosed + ". Stack: " + this.active.toString());
                
                if(curr.type == "QGFunction")
                {
                    // Prefixed functions can be closed
                    if((!curr.closed() || curr.func.infinite) && curr.prefix() && parenClosed && prev.type == "QGBlock")
                    {
                        // Append current arg and replace
                        curr.append(prev);
                        this.active.push(curr);
                        logDebugMessage("Current stack: " + this.active.toString());
                        
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
                            //prev.append(curr);
                            prev.push(curr);
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
                        if(prev.type == "QGParamDivider")
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
                                    //prev.append(prevHead);
                                    prev.push(prevHead);
                                }
                                else
                                {
                                    curr.append(prevHeader);
                                    //prev.append(curr);
                                    prev.push(curr);
                                }
                                this.close(prev, false);
                            }
                            else
                            {
                                // Error.  Can't add incomplete functions to the parameter list
                                // A function must be completed by a block
                                logErrorMessage("Error:  Can't add incomplete functions to the parameter list.");
                            }
                        }
                        else
                        {
                            // Verify binding of functions
                            if((typeof prev != "undefined") && prev.type == "QGFunction"
                                && !curr.prefix() && !curr.closed() && !prev.prefix()
                                && curr.priority() > prev.priority())
                            {
                                var prevFront = prev.pop(),
                                prevStack = [prev];
                                while((typeof prevFront == "object") && prevFront.type == "QGFunction"
                                    && !prevFront.prefix() && (curr.priority() >= prev.priority()))
                                {
                                    prev = prevFront;
                                    prevFront = prev.pop();
                                    prevStack.push(prev);
                                }
                                // Use first from prev as second for curr
                                curr.append(prevFront);
                                // Go back up stack recomposing
                                while(prevStack.length > 0)
                                {
                                    prev = prevStack.pop();
                                    prev.push(curr);
                                    curr = prev;
                                }
                                // Use first from prev as second for curr
                                // curr.append(prev.pop());
                                // // And then use curr for first from prev
                                // prev.push(curr);
                                logDebugMessage("Current stack: " + this.active.toString());
                                
                                // Haven't found parens yet, close
                                this.close(curr, false);
                            }
                            else
                            {
                                curr.append(prev);
                                logDebugMessage("Current stack: " + this.active.toString());
                                
                                // Haven't found parens yet, close
                                this.close(curr, false);
                            }
                        }
                    }
                    else
                    {
                        logDebugMessage("Warning: Trying to close function " + curr.toString() + " but status: [closed: "+curr.closed()+",prefixed:"+curr.prefix()+",parenFound:"+parenClosed+",prevType:"+(prev?prev.type:prev)+"].  Breaking...");
                        
                        if(parenClosed)
                        {
                            // Replace items on stack since we didn't use them
                            this.active.push(curr);
                            if(typeof prev != "undefined")
                            {
                                this.active.push(prev);
                            }
                            logDebugMessage("Current stack: " + this.active.toString());
                            
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
                      logDebugMessage("Current stack: " + this.active.toString());
                        
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
                              logDebugMessage("Current stack: " + this.active.toString());
                              
                          }
                      }
                      else
                      {
                          this.active.push(curr);
                          logDebugMessage("Current stack: " + this.active.toString());
                          
                      }
                    }
                    else
                    {
                        // We might be a parameter
                        if(typeof prev == "object" && prev.type == "QGParamDivider")
                        {
                            // Push to front of param list
                            prev.push(curr);
                            // Treat list as curr
                            curr = prev;
                        } 
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
                            logErrorMessage("Error:  Can't add incomplete functions to the parameter list.");
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
                            // logErrorMessage("Error: Function parameter divider with no trailing parameter or two consecutive dividers");
                            // Replace curr with prev (just ignore duplicate divider)
                            this.close(prev,false);
                        }
                        else
                        {
                            // Double divider
                            logErrorMessage("Error: Function parameter divider with no trailing parameter or two consecutive dividers");
                        } 
                    }
                }
                else
                {
                    // Try to recurse since we haven't found item to close yet
                    if((typeof prev != "undefined") && prev.type == "QGParamDivider")
                    {
                        prev.push(curr);
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
                logErrorMessage("Error: No item to close.  " + this.active);
            }
        };
        
        // Try to close stack
        var reduce = function() {
            var curr, prev = undefined;
            if(this.active.length > 0)
            {
                logDebugMessage("Reducing "+this.active.length+" items");
                
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
                            var prevFront = prev.pop(),
                                prevStack = [prev];
                            if(typeof prevFront != "undefined")
                            {
                                logDebugMessage("Took " + prevFront.toString() + " from " + prev.toString());
                                
                            }
                            while((typeof prevFront == "object") && prevFront.type == "QGFunction"
                                && !prevFront.prefix() && (curr.priority() >= prevFront.priority()))
                            {
                                prev = prevFront;
                                prevFront = prev.pop();
                                logDebugMessage("Took " + prevFront.toString() + " from " + prev.toString());
                                
                                prevStack.push(prev);
                            }
                            // Use first from prev as second for curr
                            curr.append(prevFront);
                            // Go back up stack recomposing
                            while(prevStack.length > 0)
                            {
                                prev = prevStack.pop();
                                prev.push(curr);
                                curr = prev;
                            }
                            // Re-add curr to stack
                            this.active.push(curr);
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
                        logErrorMessage("Error: Unclosed item in reduce: " + curr.toString());
                        this.content = undefined;
                    }
                    prev = curr;
                }
            }
            else
            {
                logErrorMessage("Error: No items to reduce...");
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
                logErrorMessage("Error: Cannot solve 'undefined' function");
            }
        };
        
        var stringify = function(context) {
            return this.content.toString(context);
        };
        
        var htmlify = function(prefix, element, context) {
            var html = prefix + "( ";
                html += "x" +" )" + " = ";
                html += this.content.toHTML(prefix, element, context);
            return html;
        };
        
        var getVariables = function() {
            return this.getObjectClass("QGVariable");
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
            getObjectClass: getObjectClass,
            logObject: logObject,
            variables: getVariables,
            toHTML: htmlify,
            type: "QGEquation"
        };
    };
    
    var QGFunction = function(functionString, negative) {
        var func = toFunction(functionString),
            funcName = functionString,
            args = [],
            neg = negative ? negative : false;
            
        logDebugMessage("new QGFunction("+functionString+")");
        

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
            logDebugMessage("Args for "+ this.funcName +": " + this.args.toString());
            
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
                logErrorMessage("Error: Call to extract but no available parameters");
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
            var negate = this.negative ? -1 : 1;
            return negate * this.func.evaluate(solvedArgs);
        };
        
        var stringify = function(context) {
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
                    str += this.args[i].toString(context);
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
                    if(typeof this.args[0] != "undefined")
                    {
                        str += this.args[0].toString(context);
                    }
                }
                if(this.length() == 2)
                {
                    if(typeof this.args[0] != "undefined")
                    {
                        str += this.args[0].toString(context);
                    }
                    str += this.funcName;
                    if(typeof this.args[1] != "undefined")
                    {
                        str += this.args[1].toString(context);
                    }
                }
            }
            return (this.negative?"-":"") + str;
        };
        
        var htmlify = function(prefix, element, context) {
            var str = "";
            if(this.prefix())
            {
                str += this.funcName;
                var len = this.args.length;
                if(len == 0 || this.args[0].type != "QGBlock")
                {
                    str += "( ";
                }
                for(var i = 0; i < len; i++)
                {
                    str += this.args[i].toHTML(prefix, element, context);
                    if(i != len - 1)
                    {
                      str += ", ";
                    }
                }
                if(len == 0 || this.args[0].type != "QGBlock")
                {
                    str += " )";
                }
            }
            else
            {
                if(this.length() == 1)
                {
                    str += this.funcName;
                    if(typeof this.args[0] != "undefined")
                    {
                        str += this.args[0].toHTML(prefix, element, context);
                    }
                }
                if(this.length() == 2)
                {
                    if(typeof this.args[0] != "undefined")
                    {
                        str += this.args[0].toHTML(prefix, element, context);
                    }
                    str += this.funcName;
                    if(typeof this.args[1] != "undefined")
                    {
                        str += this.args[1].toHTML(prefix, element, context);
                    }
                }
            }
            return (this.negative?"-":"") + str;
        };
        
        var len = function() {
            return this.func.length;
        };
        
        var popLeft = function() {
            if(this.args.length > 0)
            {
                var temp = this.args[0];
                this.args[0] = undefined;
                logDebugMessage("Args for "+ this.funcName +": " + this.args.toString());
                
                return temp;
            } else {
                logErrorMessage("Error: Trying to pop from 0 args");
            }
        };
        
        var pushLeft = function(item) {
            if(this.args.length == 0)
            {
                this.args.push(item);
            } else {
                this.args[0] = item;
            }
            logDebugMessage("Args for "+ this.funcName +": " + this.args.toString());
            
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
            toHTML: htmlify,
            pop: popLeft,
            push: pushLeft,
            name: toLabel,
            args: args,
            func: func,
            funcName: funcName,
            length: len,
            prefix: pre,
            negative: neg,
            type: "QGFunction"
        };
    };
    
    var QGBlock = function() {
        var inner = undefined,
            c = false;
        logDebugMessage("new QGBlock()");
        

        var close = function() {
            this.c = true;
        };
        
        var append = function(item) {
            this.content = item;
        };
        
        var stringify = function(context) {
            if(typeof this.content == "undefined")
            {
                return "()";
            }
            else
            {
                return "(" + this.content.toString(context) + ")";
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
        
        logDebugMessage("new QGParamDivider()");
        
        var append = function(param) {
            this.params.unshift(param);
        };
        
        var push = function(param) {
            this.params.push(param);
        };
        
        var stringify = function(context) {
            var str = "(";
            for(var i = this.params.length - 1; i > -1; i--)
            {
                str += this.params[i].toString(context);
                if(i != 0)
                {
                    str += ","
                }
            }
            str += ")";
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
            push: push,
            solve: solve,
            toString: stringify,
            type: "QGParamDivider"
        };
    };
    
    var QGVariable = function(variableName, negative) {
        var v = variableName,
            neg = negative ? negative : false;
        
        logDebugMessage("new QGVariable("+variableName+")");
        
      
        var solve = function(context) {
            var val = context[this.varName];
            if(typeof val != "undefined")
            {
                var negate = this.negative ? -1 : 1;
                // If context value is a function (VariableIterator)
                if((typeof val == "object") && (typeof val.value != "undefined"))
                {
                    return negate * val.value;
                }
                else
                {
                    return negate * val;
                }
            }
            else
            {
                logErrorMessage("Error: Unable to find variable '"+val+"' in context");
            }
        };
        
        var stringify = function(context) {
            if(typeof context != "undefined")
            {
                var v = context[this.varName];
                // If we have an entry for this variable and
                // it has a constant replacement. 
                if(typeof v != "undefined" && typeof v != "function")
                {
                    return (this.negative?"-":"") + v;
                }
                else
                {
                    return (this.negative?"-":"") + this.varName;
                }
            }
            else
            {
                return (this.negative?"-":"") + this.varName;
            }
        };
        
        var htmlify = function(prefix, element, context) {
            if(typeof context != "undefined")
            {
                var v = context[this.varName];
                // If we have an entry for this variable and
                // it has a constant replacement. 
                if(typeof v != "undefined" && typeof v != "function")
                {
                    var html = "<" + element + " id='";
                    html += prefix + "_" + this.varName + "_value'>"
                    
                    html += (this.negative?"-":"") + v;
                    
                    html += "</" + element + ">";
                  
                    return html;
                }
                else
                {
                    var html = "<" + element + " id='";
                    html += prefix + "_" + this.varName + "_var'>"
                    
                    html += (this.negative?"-":"") + this.varName;
                    
                    html += "</" + element + ">";
                  
                    return html;
                }
            }
            else
            {
                var html = "<" + element + " id='";
                    html += prefix + "_" + this.varName + "_var'>"
                    
                    html += (this.negative?"-":"") + this.varName;
                    
                    html += "</" + element + ">";
                    
                return html;
            }
        };
        
        var toLabel = function() {
            return this.varName;
        };
        
        return {
            solve: solve,
            toString: stringify,
            toHTML: htmlify,
            name: toLabel,
            varName: v,
            negative: neg,
            type: "QGVariable"
        };
    };
    
    var QGConstant = function(value, negative) {
        var v = value,
            neg = negative ? negative : false;
        
        logDebugMessage("new QGConstant("+(this.negative?"-":"")+value+")");
        
        
        var solve = function(context) {
            return (this.negative?-1:1) * this.value;
        };
        
        var stringify = function(context) {
            return (this.negative?"-":"") + this.value;
        };
        
        var stringify = function(prefix, element, context) {
            return (this.negative?"-":"") + this.value;
        };
        
        var toLabel = function() {
            return this.value + "";
        };
        
        return {
            solve: solve,
            toString: stringify,
            toHTML: htmlify,
            name: toLabel,
            value: v.value,
            negative: neg,
            type: "QGConstant"
        };
    };
    
    var toFunction = function(functionName) {
        return Functions[functionName];
    };
    
    /* OUR ONLY GLOBALS ARE DECLARED
     HERE- array of variable names to legend info, array of variable names to values graphial graph*/
     //var parsedEquation = undefined;


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
        var returnVal = -1;

        if(typeof singlet != "undefined")
        {
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
        logDebugMessage("Parsing: " + rawEquation);
        
        
        for(var i = 0; i < rawEquation.length; i++) {
            // Previous character
            b = c;
            // Current character
            c = rawEquation[i];
            switch(alphaNumericType(c)) {
                // Letter
                case 1:
                    if(builtNumber != "-")
                    {
                        // If we have a number string already, assume implicit multiplication
                        if(builtNumber.length > 0)
                        {
                            // Add constant
                            logDebugMessage("Parsing '"+builtNumber+"' to " + parseFloat(builtNumber));
                            
                            eq.append(new QGConstant(new Constant(parseFloat(builtNumber))));
                            builtNumber = "";
                            // Add mult
                            eq.append(new QGFunction("*"));
                        }
                    }
                    else
                    {
                        // Negating a variable, constant or function
                        builtString = builtNumber;
                        builtNumber = "";
                    }
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
                        var negative = builtString.charAt(0) == "-",
                            constant;
                        if(!negative)
                        {
                            constant = Constants[builtString];
                        }
                        else
                        {
                            constant = Constants[builtString.substring(1,builtString.length)];
                        }
                        
                        if(typeof constant != "undefined")
                        {
                            eq.append(new QGConstant(constant, negative));
                        }
                        else
                        {
                            // Otherwise it is a variable
                            eq.append(new QGVariable(builtString, negative));
                        }
                        builtString = "";
                    }
                    // If we are working on a number, assume its a constant
                    else if(builtNumber.length > 0)
                    {
                        logDebugMessage("Parsing '"+builtNumber+"' to " + parseFloat(builtNumber));
                        
                        eq.append(new QGConstant(new Constant(parseFloat(builtNumber))));
                        builtNumber = "";
                    }
                    // Append divider
                    eq.append(new QGParamDivider());
                    break;
                // Compressed function reference
                case 4:
                    // If we are working on a number, check if its a constant
                    if(builtNumber.length > 0)
                    {
                        // Check that we dont have a negated constant
                        if(builtNumber.charAt(0) != "-" || builtNumber.length > 1)
                        {
                            logDebugMessage("Parsing '"+builtNumber+"' to " + parseFloat(builtNumber));
                            
                            eq.append(new QGConstant(new Constant(parseFloat(builtNumber))));
                        }
                        else
                        {
                            // This is a negated constant.  Append it to the existing constant string
                            builtString = builtNumber + builtString;
                        }
                        builtNumber = "";
                    }
                    // If we are working on a string
                    if(builtString.length > 0) {
                        if(builtString == "-")
                        {
                            logErrorMessage("Error:  Standalone '-' is not a number.  Put some numerals after it.");
                        }
                        else
                        {
                            // Strip any negative symbols
                            var negative = builtString.charAt(0) == "-";
                            if(negative)
                            {
                                // Take remainder of string
                                builtString = builtString.substring(1);
                            }
                            // check if it is a constant
                            var constant = Constants[builtString]
                            if(typeof constant != "undefined")
                            {
                                eq.append(new QGConstant(constant, negative));
                            }
                            else
                            {
                                // Otherwise it is a variable
                                eq.append(new QGVariable(builtString, negative));
                            }
                        }
                        builtString = "";
                    }
                    // Check for negation
                    var prevType = alphaNumericType(b);
                    // -1 case handles equations that start with a negated value
                    if(c == "-" && (prevType == 3 || prevType == 4 || prevType == 6 || prevType == -1))
                    {
                        // Minus
                        builtNumber += c;
                    }
                    else
                    {
                        logDebugMessage("Determined '" + c + "' is a function since prevType(" + b + ") is " + prevType);
                        
                        // Append function
                        eq.append(new QGFunction(c));
                    }
                    break;
                // Closing char
                case 5:
                    // Close any open strings
                    // If we are working on a number, check if its a constant
                    if(builtNumber.length > 0)
                    {
                        // Check that we dont have a negated constant
                        if(builtNumber.charAt(0) != "-" || builtNumber.length > 1)
                        {
                            logDebugMessage("Parsing '"+builtNumber+"' to " + parseFloat(builtNumber));
                            
                            eq.append(new QGConstant(new Constant(parseFloat(builtNumber))));
                            builtNumber = "";
                        }
                        else
                        {
                            // This is a negated constant.  Append it to the existing constant string
                            builtString = builtNumber + builtString;
                            builtNumber = "";
                        }
                    }
                    if(builtString.length > 0) {
                        // Strip any negative symbols
                        var negative = builtString.charAt(0) == "-";
                        if(negative)
                        {
                            // Take remainder of string
                            builtString = builtString.substring(1);
                        }
                        // check if it is a constant
                        var constant = Constants[builtString]
                        if(typeof constant != "undefined")
                        {
                            eq.append(new QGConstant(constant, negative));
                        }
                        else
                        {
                            // Otherwise it is a variable
                            eq.append(new QGVariable(builtString, negative));
                        }
                        builtString = "";
                    }
                    eq.close();
                    break;
                // Opening char
                case 6:
                    // If we are working on a string, assume its a function
                    if(builtString.length > 0)
                    {
                        var negative = builtString.charAt(0) == "-";
                        if(negative)
                        {
                            builtString = builtString.substring(1,builtString.length);
                        }
                        eq.append(new QGFunction(builtString, negative));
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
            var negative = builtString.charAt(0) == "-",
            // check if it is a constant
                constant;
            if(negative)
            {
                builtString = builtString.substring(1,builtString.length);
            }
            constant = Constants[builtString];
            
            if(typeof constant != "undefined")
            {
                eq.append(new QGConstant(constant, negative));
            }
            else
            {
                // Otherwise it is a variable
                eq.append(new QGVariable(builtString, negative));
            }
            builtString = "";
        }
        else if(builtNumber.length > 0)
        {
            var negative = builtNumber.charAt(0) == "-";
            logDebugMessage("Parsing '"+builtNumber+"' to " + parseFloat(builtNumber));
            
            if(negative)
            {
                builtNumber = builtNumber.substring(1,builtNumber.length);
            }
            eq.append(new QGConstant(new Constant(parseFloat(builtNumber), negative)));
            builtNumber = "";
        }
        // Finalize parsing
        eq.finalize();
        // Save object
        //this.equation = eq;
        // Return parsed object
        return eq;
    };
    
    var solve = function(equation, context) {
        if(typeof equation != "undefined")
        {
            if(typeof context != "undefined")
            {
                return equation.solve(context);
            }
            else
            {
                logErrorMessage("Error: No context provided to solver");
            }
        }
        else
        {
            logErrorMessage("Error: Unable to solve because no equation available");
        }
    };
    
    var logDebugMessage = function(message) {
      if(debug)
      {
          console.log(message);
      }
    };
    
    var logErrorMessage = function(message) {
        if(debug)
        {
          console.log(message);
        }
        throw message;
    }
    
    return {
        DEBUG: debug,
        TESTGENERATION: testGen,
        parse: parseEquation,
        logDebugMessage : logDebugMessage,
        solve: solve
        //equation: parsedEquation
    };
}();
