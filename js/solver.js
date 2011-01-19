/**
 * Requires MathProcessor (math.js) for specific function evaluation
 */

var ComplexFunction = function(pri, prefix, func) {
    var p = pri, x = prefix, f = func;
    
    var evaluate = function(args) {
        if(args.length == f.length) {
            f.call(this,args)
        } else {
            // Error
        }
    };
    
    return {
        priority: p,
        prefix: x,
        evaluate: evaluate,
        length: f.length
    };
};

/* Defined functions */
var Functions = {};
Functions["+"] = new ComplexFunction(0,false, function(a,b) {
            return a + b;
        });
Functions["-"] = new ComplexFunction(0,false, function(a,b) {
            return a - b;
        });
Functions["*"] = new ComplexFunction(1,false, function(a,b) {
            return a * b;
        });
Functions["/"] = new ComplexFunction(1,false, function(a,b) {
            return a / b;
        });

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
                        // Order of application depends on priority
                        if(item.priority() > curr.priority())
                        {
                            // Extract previous parameter
                            var oldArg = curr.extract();
                            // Inject to current function
                            item.append(oldArg);
                            // Inject new item into existing function
                            curr.append(item);
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
                    else
                    {
                        if(!curr.closed())
                        {
                            curr.append(item);
                            // Replace
                            this.active.push(curr);
                            if(item.type == "QGBlock")
                            {
                                this.active.push(item);
                            }
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
        var close = function(prev) {
            // Close current item
            if(this.active.length > 0) {
                var curr = this.active.pop();
                if(curr.type == "QGFunction")
                {
                    // Prefixed functions can be closed
                    if(curr.prefix && !curr.closed())
                    {
                        // Mark block as closed and replace
                        curr.close();
                        this.active.push(curr);
                    }
                    else
                    {
                        // Attempt to recurse until we can close
                        if(curr.closed())
                        {
                            close(curr);
                        }
                    }
                }
                else if(curr.type == "QGBlock")
                {
                    if(!curr.closed())
                    {
                      // Assign tree head to block
                      curr.append(prev);
                      // Mark block as closed and replace
                      curr.close();
                      this.active.push(curr);
                    }
                    else
                    {
                        // Recurse
                        close(curr);
                    }
                }
                else
                {
                    // Try to recurse
                    close(curr);
                }
            }
            else
            {
              // Error, no item to close
              alert("Error: No item to close");
            }
        };
        
        // Try to close stack
        var reduce = function() {
            var curr;
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
                    else
                    {
                        // Error.  Unclosed items
                        alert("Error: Unclosed item in reduce: " + curr.toString());
                        this.content = undefined;
                    }
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
            this.func.evaluate(solvedArgs);
        };
        
        var stringify = function() {
            var str = "";
            if(this.prefix())
            {
                str += this.funcName + "(";
                var len = this.args.length;
                for(var i = 0; i < len; i++)
                {
                    str += this.args.toString();
                    if(i != len - 1)
                    {
                      str += ",";
                    }
                }
                str += ")";
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
            closed = false;
            
        console.log("new QGBlock()");

        var close = function() {
            this.closed = true;
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
        
        return {
            append: append,
            close: close,
            solve: solve,
            toString: stringify,
            closed: closed,
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
        if (/[0-9.]/.test(singlet)) {
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
                        eq.append(new QGConstant(parseInt(builtNumber)));
                        builtNumber = "";
                    }
                    // Append function
                    eq.append(new QGFunction(c));
                    break;
                // Closing char
                case 5:
                    eq.close();
                    break;
                // Opening char
                case 6:
                    // If we are working on a string, assume its a function
                    if(builtString.length > 0) {
                        eq.append(new QGFunction(builtString));
                        builtString = "";
                    }
                    // Otherwise, new block
                    else {
                        eq.append(new QGBlock());
                    }
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
            eq.append(new QGConstant(parseInt(builtNumber)));
            builtNumber = "";
        }
        // Finalize parsing
        eq.finalize();
        // Show parsed equation
        alert(eq.toString());
        // Return parsed object
        return eq;
    };
    /* parseEquation is an
     algorithm in 3 steps */
    /* Step
     1 - fill an array with each variable from equation */
    /* Step
     2 - call moreSliders to create a dynamic slider with each variable from equation */
    /* Step
     3 - moreSliders also creates a named textual field for the dynamic
     slider */
    // var parseEquation = function(rawEquation) {
    // 
    //     /* loop through each element of the rawEquation and add each alphanumeric to an unique preserving array */
    //     /* Also, sanity check that open paranthesis match closed parenthesis */
    //     /* while we are looping, also throw the sliders up for each alpha type */
    //     /* This is currently a heinous
    //      n^2 algorithm because of programmer laziness and input size */
    //     var variableChars = [];
    //     variableFound = 0;
    //     var paranthesisCheck = 0;
    //     var parsed = new QGEquation();
    //     for(var i = 0; i < rawEquation.length; i++) {
    //         var innerType = alphaNumericType(rawEquation[i])
    //         if(innerType == 1) {
    //             var foundMatch = 0;
    //             for (var j = 0; j < variableChars.length; j++) {
    //                 if( rawEquation[i] == variableChars[j]) {
    //                     foundMatch = 1;
    //                 }
    //             }
    //             if (foundMatch == 0) {
    //                 variableFound++;
    //                 variableChars[variableChars.length] = rawEquation[i];
    //                 //moreSliders(rawEquation[i],"");
    //             }
    //         } else if(innerType == 6) {
    //             // end alphamatch test
    //             paranthesisCheck = paranthesisCheck + 1;
    //         } else if(innerType == 5) {
    //             paranthesisCheck = paranthesisCheck - 1;
    //         }
    //     }
    // 
    //     if(paranthesisCheck != 0) {
    //         alert("parenthesis are not fully closed");
    //         return;
    //     }
    // 
    //     /* solve the first pass at the equation with zero
    //      values */
    //     solveEquation(rawEquation);
    // 
    //     if(rawEquation.length > 0) {
    //         if(variableFound > 0) {
    //             if(document.checkboxform.updategraphcheckbox.checked==false) {
    //                 return;
    //             }
    //             //updateAllGraphs();
    //         }
    //     }
    // };
    /* solveEquation solves the equation presented */
    var solveEquation = function(rawEquation) {
        // always trim whitespace
        var trimmedEquation = rawEquation.replace(/^\s*/, "").replace(/\s*$/, "");
        //alert(trimmedEquation);

        // in direct instances this is called twice, which is heinous but not noticible to user
        var origEquation = storeAndReplaceFunctions(trimmedEquation);
        var lenForUs = origEquation.length;

        /* This point is our Recursion, we solve for a smaller paranthesis and recurse */
        var openParenIndex = 0;
        var closedParenIndex = 0;
        var firstOpen = -1;
        var lastClosed = -1;
        var continueLoop = 1;

        // loop over the equation finding parenthesis in the FORWARD direction
        for(var i=0;i<lenForUs;i++) {
            if(continueLoop == 1) {
                // 6 = open, 5 = closed
                if(alphaNumericType(origEquation[i]) == 6) {
                    openParenIndex++;
                    if(firstOpen == -1) {
                        firstOpen = i;
                    }
                } else if(alphaNumericType(origEquation[i]) == 5) {
                    closedParenIndex++;
                    lastClosed = i;
                }

                // if we've completed a paranthesie pair
                // 1. parse the parenthesie
                // 2. put return value into string instead of parenthesie pair
                // 3. return SolveEquation(newEquationMinusParanthesiePair)

                // make sure we have the first parenthesie pair (or outermost)
                if(((openParenIndex + closedParenIndex) > 1) && (openParenIndex == closedParenIndex) ) {
                    // get the insides of this parenthesie
                    var insideParenthesies = origEquation.substring(firstOpen+1,lastClosed);
                    // if this parenthesie is the entire shebang, return the insides and ignore
                    if((firstOpen == 0) && (lastClosed == lenForUs)) {
                        return solveEquation(insideParenthesies);
                    }

                    // if openParenIndex > 1, we can recurse further...
                    if(openParenIndex > 1) {
                        // at this point, we may be inside a functional argument
                        // test for first level commas
                        var splitPoint = -1;
                        var lastSplitPoint = 0;
                        var recursiveDepth = 0;
                        var splitUp = 0;
                        var equationStringAfterSplitParse = origEquation.substring(0,firstOpen+1);
                        for(var k=0;k<insideParenthesies.length;k++) {
                            if(insideParenthesies[k] == ',') {
                                if(recursiveDepth == 0) {
                                    // if we find a split, recurse for this item in the function arguments
                                    splitPoint = k;
                                    splitUp = 1;
                                    var ourSplitFirstPart = insideParenthesies.substr(lastSplitPoint,splitPoint);
                                    var ourSplitFirstPartSolution = solveEquation(ourSplitFirstPart);
                                    equationStringAfterSplitParse += ourSplitFirstPartSolution;
                                    equationStringAfterSplitParse += ",";

                                    lastSplitPoint = splitPoint;
                                }
                            }
                            if((k == insideParenthesies.length-1) && splitUp == 1) {
                                var alertString = "got to end of arguments" + "::";
                                //document.getElementById("debugbar").value += alertString;
                                // if we previously found a split and are at the end, grab the last bit
                                splitPoint = k;
                                var ourSplitFirstPart = insideParenthesies.substr(lastSplitPoint+1,splitPoint);
                                var ourSplitFirstPartSolution = solveEquation(ourSplitFirstPart);
                                equationStringAfterSplitParse += ourSplitFirstPartSolution;
                                lastSplitPoint = splitPoint;
                            }

                            // if we see an open bracket, ++
                            // if we see a closed bracket, --
                            // 6 = open, 5 = closed
                            var alphaType = alphaNumericType(insideParenthesies[k]);
                            if(alphaType == 6) {
                                recursiveDepth++;
                            } else if(alphaType == 5) {
                                recursiveDepth--;
                            }

                        }
                        if(splitUp == 1) {
                            equationStringAfterSplitParse += origEquation.substring(lastClosed,lenForUs);
                            return solveEquation(equationStringAfterSplitParse);
                        }
                        // else if we have no first level commas,
                        // solve for the inside of Parenthesies
                        var parenthesieSolution = solveEquation(insideParenthesies);
                        var newEquation = origEquation.substring(0,firstOpen+1) + parenthesieSolution;
                        newEquation = newEquation + origEquation.substring(lastClosed,lenForUs);
                        return solveEquation(newEquation);
                    } else {
                        continueLoop = 0;
                    }
                }
            }
        }

        // reset shared loop variables
        openParenIndex = 0;
        closedParenIndex = 0;
        var lastOpen = -1;
        var firstClosed = -1;
        continueLoop = 1;

        // now loop over the input in the REVERSE direction
        for(var i=lenForUs;i>0;i--) {
            if(continueLoop == 1) {
                // 6 = open, 5 = closed
                if(alphaNumericType(origEquation[i]) == 5) {
                    closedParenIndex++;
                    if(firstClosed == -1) {
                        firstClosed = i;
                    }
                } else if(alphaNumericType(origEquation[i]) == 6) {
                    openParenIndex++;
                    lastOpen = i;
                }

                // if we've completed a paranthesie pair
                // 1. parse the parenthesie
                // 2. put return value into string instead of parenthesie pair
                // 3. return SolveEquation(newEquationMinusParanthesiePair)

                // make sure we have the first parenthesie pair (or outermost)
                if(((openParenIndex + closedParenIndex) > 1) && (openParenIndex == closedParenIndex) ) {
                    // get the insides of this parenthesie
                    var insideParenthesies = origEquation.substring(lastOpen+1,firstClosed);

                    // if this parenthesie is the entire shebang, return the insides and ignore
                    if((lastOpen == 0) && (firstClosed == lenForUs)) {
                        return solveEquation(insideParenthesies);
                    }

                    // if openParenIndex > 1, we can recurse further...
                    if(openParenIndex > 1) {
                        // at this point, we may be inside a functional argument
                        // test for first level commas
                        var splitPoint = -1;
                        var lastSplitPoint = insideParenthesies.length;
                        var recursiveDepth = 0;
                        var splitUp = 0;
                        var equationStringAfterSplitParse = origEquation.substring(firstClosed,lenForUs);
                        for(var k=insideParenthesies.length;k>0;k--) {
                            if(insideParenthesies[k] == ',') {
                                if(recursiveDepth == 0) {
                                    // if we find a split, recurse for this item in the function arguments
                                    splitPoint = k;
                                    splitUp = 1;
                                    var ourSplitFirstPart = insideParenthesies.substr(splitPoint,lastSplitPoint);
                                    var ourSplitFirstPartSolution = solveEquation(ourSplitFirstPart);
                                    equationStringAfterSplitParse = ourSplitFirstPartSolution + equationStringAfterSplitParse;

                                    lastSplitPoint = splitPoint;
                                }
                            }
                            if(k == insideParenthesies.length && splitUp == 1) {
                                // if we previously found a split and are at the end, grab the last bit
                                splitPoint = k;
                                var ourSplitFirstPart = insideParenthesies.substr(splitPoint,lastSplitPoint);
                                var ourSplitFirstPartSolution = solveEquation(ourSplitFirstPart);
                                equationStringAfterSplitParse = ourSplitFirstPartSolution + equationStringAfterSplitParse;
                                lastSplitPoint = splitPoint;
                            }

                            // if we see an open bracket, ++
                            // if we see a closed bracket, --
                            // 6 = open, 5 = closed
                            var alphaType = alphaNumericType(insideParenthesies[k]);
                            if(alphaType == 6) {
                                recursiveDepth++;
                            } else if(alphaType == 5) {
                                recursiveDepth--;
                            }

                        }
                        if(splitUp == 1) {
                            equationStringAfterSplitParse = origEquation.substring(0,lastSplitPoint) + equationStringAfterSplitParse;
                            return solveEquation(equationStringAfterSplitParse);
                        }
                        // else if we have no first level commas,
                        // solve for the inside of Parenthesies
                        var parenthesieSolution = solveEquation(insideParenthesies);
                        var newEquation = origEquation.substring(0,lastOpen+1) + parenthesieSolution;
                        newEquation = newEquation + origEquation.substring(firstClosed,lenForUs);
                        return solveEquation(newEquation);
                    } else {
                        continueLoop = 0;
                    }
                }
            }
        }

        // at this point, we can
        /* Create an array with one element per item */
        var eachIndividual=new Array();
        var eachIndividualSize = 0;
        var numericalDigits = 0;

        for(var i=0;i<lenForUs;i++) {
            // we want consecutive numerical items to be added as a group
            if(alphaNumericType(origEquation[i]) == 2) {
                if(i == lenForUs-1) {
                    if(numericalDigits > 0) {
                        numericalDigits++;
                        eachIndividual[eachIndividualSize] = origEquation.substring(i-numericalDigits,i+1);
                        eachIndividualSize = eachIndividualSize + 1;
                        numericalDigits = 0;
                    } else {
                        eachIndividual[eachIndividualSize] = origEquation[i];
                        eachIndividualSize = eachIndividualSize + 1;
                    }
                } else {
                    numericalDigits = numericalDigits + 1;
                }
            } else {
                if(numericalDigits > 0) {
                    eachIndividual[eachIndividualSize] = origEquation.substring(i-numericalDigits,i);
                    eachIndividualSize = eachIndividualSize + 1;
                    numericalDigits = 0;
                }
                // add the non-numeric item at this location
                eachIndividual[eachIndividualSize] = origEquation[i];
                eachIndividualSize = eachIndividualSize + 1;
            }

        }
        /* start looping over the equation, cleaning up variables */
        /* alphaNumericType:
         6=open parantheses
         5=closed paranthesis 4=operator,  2 =numeric, 1=alpha, 0=unsupported operator*/
        /* loop over the individual element collection and reorganize into a string */
        var newEquationString = '';
        var skipReplace = 0;
        var lastAlphaType = -1;
        var alphaType = -1;
        for(var i=0;i<eachIndividual.length;i++) {

            alphaType = alphaNumericType(eachIndividual[i]);
            if(i>0) {
                if(alphaType == 6 && lastAlphaType == 2) {
                    newEquationString += '*';
                }
                if(alphaType == 6 && lastAlphaType == 1) {
                    newEquationString += '*';
                }
                if(alphaType == 1 && lastAlphaType == 2) {
                    newEquationString += '*' + arrayValueHash[eachIndividual[i]];
                    skipReplace = 1;
                }
                if(alphaType == 1 && lastAlphaType == 1) {
                    newEquationString += '*' + arrayValueHash[eachIndividual[i]];
                    skipReplace = 1;
                }
                if(alphaType == 2 && lastAlphaType == 5) {
                    newEquationString += '*';
                }
                if(alphaType == 2 && lastAlphaType == 2) {
                    newEquationString += '*';
                }
            }
            /* replace % signs with actual numerical value (.01) */
            if(eachIndividual[i] == '\%') {
                newEquationString += "*(.01)";
            } else {
                if(skipReplace == 0) {
                    if(alphaType == 1) {
                        newEquationString += arrayValueHash[eachIndividual[i]];
                    } else {
                        newEquationString += eachIndividual[i];
                    }
                } else {
                    skipReplace = 0;
                }
            }
            if(alphaType > 0) {
                lastAlphaType = alphaType;
            }
        } // end of loop over element collection for loop

        /* loop over the reconstituted collection and add
         implicit * between brackets */
        /* also, remove white spaces! */
        var implicitEquationString = '';
        for(var i=0;i<newEquationString.length;i++) {
            newStringAlphaType = alphaNumericType(newEquationString[i]);
            if(i > 0) {
                if(newStringAlphaType == 3 && alphaNumericType(newEquationString[i-1]) == 3) {
                    implicitEquationString += '*';
                }
            }
            if(newEquationString[i] != ' ') {
                implicitEquationString += newEquationString[i];
            }
        }

        /*  document.getElementById("mainResult").innerHTML=implicitEquationString; */
        //alert(implicitEquationString);

        // this is the old method
        //parsedEquationResult = "Could Not Parse";
        //implicitEquationString = "return " + implicitEquationString;
        //ourEquationFunction = new Function(implicitEquationString);
        //alert(ourEquationFunction);
        //parsedEquationResult=ourEquationFunction();
        //document.getElementById("mainResult").innerHTML= parsedEquationResult;

        if(implicitEquationString != "") {
            // restore known function names into the equation
            implicitEquationStringWithFunctions = replaceStoredFunctions(implicitEquationString);
            //alert(implicitEquationString);
            //alert("turns into");
            //alert(implicitEquationStringWithFunctions);
            //<input type="text" id="debugbar" value="" />
            //document.getElementById("debugbar").value += implicitEquationStringWithFunctions;
            //document.getElementById("debugbar").value += "::";

            var parsedValue;
            // this is the new math parse method
            var p = new MathProcessor();
            try {
                parsedValue = p.parse(implicitEquationStringWithFunctions);
            } catch(e) {
                //var alertString = "Could Not Parse The Following:" + implicitEquationStringWithFunctions + "::";
                //document.getElementById("debugbar").value += alertString;

                //alert(alertString);
                parsedValue = 0;
            }

            document.getElementById("mainResult").innerHTML= parsedValue;
            /* Also allow user to edit this in the future */
            stringifyPage();
            return parsedValue;
        }

        /* Also allow user to edit this in the future */
        //stringifyPage();
    };
    /*
     * Return block controls what functions are publically available
     */
    return {
        parse: parseEquation,
        solve: solveEquation

    };
}();
