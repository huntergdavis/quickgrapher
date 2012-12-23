//var parsedEquation = undefined;

// I put the passed in values into separate arrays
// we should move them to objects
// if we need them after the initial parse 
var variableMinHash = [];
var variableMaxHash = [];
var variableStepHash = [];
var variableLastHash = [];
var variableVisHash = [];

/* LoadTitleBarHash loads in passed-in title bar equation */
function loadTitleBarHash()
{
    // Get location and search string.  I think there is a faster way to do this. 
    var encodedBar = window.location.href,
        equationStart = encodedBar.indexOf("?")+1,
        encodedString = encodedBar.substring(equationStart,encodedBar.length),
        addressBar = encodedString;
        
    // Demunge
    addressBar = addressBar.replace(/'%/g,"+"); 
    

    var equationEnd = addressBar.indexOf("="),
        equationString = "",
        equationValid = 0;     
    
    
    var loadRandom = false;
    /* ensure we've got an equation to parse*/
    if(equationStart < 1)
    {
        var exNumber;
        if(loadRandom)
        {
            // let's load a random example instead
            var exLen = examples.length;
            var exRand = Math.floor(Math.random() * exLen);
            if (exRand == 0)
            {
                exRand++;
            }
            exNumber = exRand;
        }
        else
        {
            exNumber = 5;
        }
        
        // Assume we have the address we need currently
        var URL = window.location.href,
        // Pull off any existing URI params
            end = URL.indexOf("?");
        if(end != -1)
        {
            URL = URL.substring(0,end);
        }
        newURL = URL + "?" + examples[exNumber].url;
        window.location = newURL;
        
        
        return;
    }
    
    /* assume the equation is the entire bar if no other hash material
     * (for people hotlinking or apis to work later) */
    if(equationEnd < 1)
    {
        equationEnd = addressBar.length;
    }
    
    /* Pull out our equation sets*/
    var equationArrayString = addressBar.substring(0,equationEnd);
    
    // parse out all the equations with a separator
    var equationStringArray = returnArrayOfEquations(equationArrayString);
    var esaLength = equationStringArray.length;

    // if we have equations...
    for(var i = 0; i < esaLength;i++)
    {
        var eqLength = equationStringArray[i].length;
        if(eqLength > 1)
        {
            // allow each function to have its own name
            var functionName = "Function";
            equationString = "Equation";
            var localVarName,localVarMin,localVarCurr,localVarMax;
            var localContext = {};
            var equationStringSplit = equationStringArray[i].split(":");
            var innerSplitLength = equationStringSplit.length;
            var semicolonCounter = 0;
            for(var j = 0;j<innerSplitLength;j++)
            {
                if(j == 0)
                {
                    equationString = equationStringSplit[j];
                }
                else if(j == 1)
                {
                    functionName = equationStringSplit[j];
                }
                else
                {
                    if(semicolonCounter == 0)
                    {
                        localVarName = equationStringSplit[j];
                    }
                    else if(semicolonCounter == 1)
                    {
                        localVarMin = equationStringSplit[j];
                    }
                    else if(semicolonCounter == 2)
                    {
                        localVarCurr = equationStringSplit[j];
                    }
                    else if(semicolonCounter == 3)
                    {
                        localVarMax = equationStringSplit[j];
                        localContext[localVarName] = {
                            min: localVarMin,
                            curr: localVarCurr,
                            max: localVarMax
                        };
                        semicolonCounter = -1;
                    }
                    semicolonCounter++;
                }
            } // end of inner vars split loop
            
            var parsed;
            try
            {
                parsed = QGSolver.parse(equationString);
            }
            catch(exception)
            {
                visualErrorFunction();         
            }
            functionName = sanitizeFunctionName(functionName);
            row = createFunctionRowWithContext(functionName,equationString,parsed,localContext);
            // Solve equation in row
            solveEquation(row, parsed);
            // correctly size bar elements
            resizeBars();
            }
    } // end of outer equations loop
}

function returnArrayOfEquations(equationArrayString)
{
    // local array storage
    var localArray = new Array();
        
    // look for a split delimiter
    if(equationArrayString.indexOf("{") > 0)
    {
        localArray = equationArrayString.split("{");
    }
    else
    {
        localArray.push(equationArrayString);
    }
    return localArray;
}

/* function parseAndAddToHash parses a string at delimeter and adds to a hash*/
function parseAndAddToHash(stringToParse,delimiter,hashToGrow)
{
    
    /* should we continue parsing? */
    var stillParsing = true;
        
    /* local variable for splitting */
    var parseBlock = stringToParse
        
    /* loop through a string and split at indicies */
  	while(stillParsing)
  	{
        /* break down the string and go to next delimiter*/
		    var nextDelimiter = parseBlock.indexOf(delimiter);
		    if(nextDelimiter > -1)
		    {
		        var hashValue = parseBlock.substring(0,nextDelimiter);
		        parseBlock = parseBlock.substring(nextDelimiter+1,parseBlock.length);
		        hashToGrow.push(hashValue);
	      }
	      else
	      {
		        stillParsing = false;
        }
    }
}



/* showValue changes the sibling span text of a slider to be its value and recalculates the equation*/
/* The overall formula based on the
 change in this variable */
function showValue(sliderValue, sliderId)
{
    var v = sliderId.substring(0,sliderId.indexOf("_")),
        sliderLabel = $("#" + v + "_slider_value"),
        step = parseFloat($("#" + v + "_step").val()),
        dynamicUpdate = $("#dynamic_update");
        
    sliderLabel.empty();
    sliderLabel.append(parseInput(sliderValue,step));
    
    var update = dynamicUpdate.is(":checked");
    if(update)
    {
        solveEquation();
    }
}

/* clearEqAndScreen clears out equation and all named elements */
function clearEqAndScreen()
{
    // clear out equation and equation fxn name
    $("#mainEquation").val("");
    $("#equationName").val("Function");
    
    // clear out all named elements
    clearScreen();
}


/* clearScreen clears out all named elements */
function clearScreen()
{

    var graphParent = $("#graph_container"),
        sliderParent = $("#variables");
          
    // Clear existing graph
    graphParent.empty();
    
    // Clear solved result display
    $("#result").hide();
    
    // Hide legend title
    //$("#legendTitle").hide();
    
    // Clear sliders
    $("tr.variable").empty();
    $("tr.variable").remove();
    
    // Clear variables
    $("#variable_list").empty();

    // clear all global saved hashes
    variableMinHash = [];
    variableMaxHash = [];
    variableStepHash = [];
    variableLastHash = [];
    variableVisHash = [];
    
    // Clear out all function rows
    $('.fxn_row').remove();

    
}

function parseInput(input, step)
{
    var val = parseFloat(input),
        prec = val / step,
        str = prec + "",
        decimal,
        rounded = Math.round(parseFloat(str)),
        result = val;
        
    if(step < 1)
    {
        str = rounded + "";
        decimal = str.indexOf(".");
        
        
        if(decimal != -1)
        {
            result = parseInt(str.substring(0,decimal)) * step;
        }
        else
        {
            result = parseInt(str) * step;
        }
        
        // Do final rounding check
        str = result + "";
        var len = str.length;
        decimal = str.indexOf(".");
        // We have a possible rounding error
        if(decimal != -1 && len > decimal + 3)
        {
            // As long as we find zeros
            var i;
            for(i = len - 2; i > -1; i--)
            {
                if(str.charAt(i) != "0")
                {
                    i++;
                    break; 
                }
            }
            // If we found a 0 chain at the end
            if(i != len - 2)
            {
                result = parseFloat(str.substring(0,i));
            }
        }
    }

    return result;
}

function convertToPNG()
{
    var parentElement = $("#subgraph_graph")[0];
    if(typeof parentElement != "undefined")
    {
        var pngDataURL = parentElement.toDataURL("image/png");
        window.open(pngDataURL);
        // the below works in firefox, but you can't name it...
        //var pngDataFile = pngDataURL.replace("image/png","image/octet-stream");
        //document.location.href = pngDataFile;
    }
    else
    {
        alert("Please Graph Something First, Thanks!");
    }
}

function selectVariable(equationName, varName)
{
    // Set active variable
    var row = $("#row_" + equationName)[0],
        sanitizedName = sanitizeFunctionName(equationName);
    var eq = row.fxnData.eq,
        fxn = row.fxnData.fxn;
    eq.setVariable(varName);
    
    // Re-solve using this variable
    updateFunction(sanitizedName, fxn, eq);
}


//id='"+fxnName+"_" + variableName + "_slider'"
function selectValue(fxnName, varName)
{
    var slider = $("#" + fxnName + "_" + varName + "_slider"),
        variableLabel = $("#" + fxnName + "_" + varName + "_curr"),
        step = parseFloat(slider.attr("step")),
        sliderValue = parseInput(slider.val(),step);
        
    variableLabel.empty();
    variableLabel.append(sliderValue);
    
    var update = true; //dynamicUpdate.is(":checked");
    if(update)
    {
        var eqEl = $("#row_" + fxnName)[0],
            eq = eqEl.fxnData.eq;
        var context = eqEl.fxnData.context;
        
        // Update context
        context[varName].curr = sliderValue;
        
        solveEquation(eqEl, eq)
        //updateSolution(fxnName, eq, context, solution);
    }
}

/**
 * 
 * CurrentContext: {
 *    min: minimum value,
 *    curr: current value,
 *    max: maximum value
 * }
 * 
 */
function currentValueTemplate(template, fxnName, variableName, currentContext)
{
    template += "<div style='height: 100%; padding: 5px 10px 3px 10px; font-size: 26pt; background-color: rgb(255,255,255); color: rgb(0,0,0); float: left; width: 180px;'>";
    template += "<font style='font-size: 18pt; font-weight: bold;'>" + variableName + " = </font>";
    template += "<font id='"+fxnName+"_"+variableName+"_curr'>" + currentContext.curr + "</font>";
    template += "</div>";
  
    return template;
}

function sliderValueTemplate(template, fxnName, variableName, currentContext)
{
    template += "<div style='height: 100%; padding: 2px 5px 1px 5px; color: rgb(255,255,255); background: none; float: left; font-size: 20px;'>";
    // Min value
    template += "<font style='margin: auto;'>";
    template += currentContext.min;
    template += "</font>";
    // Slider
    var mn = currentContext.min,
        mx = currentContext.max;
    template += "<input id='"+fxnName+"_" + variableName + "_slider'";
    template += " type='range' alt='Adjust "+variableName+"' title='Adjust "+variableName+"'";
    template += " min='"+mn+"' max='"+mx+"' step='"+((mx-mn)/1000)+"' value='"+currentContext.curr+"'";
    template += "onchange=\"selectValue('"+fxnName+"','"+variableName+"')\"";
    template += "style='width: 440px; margin: 5px 10px 0px 10px;'/>";
    
    
    // inp = document.createElement("input");
    //     inp.id = v + "_slider";
    //     inp.setAttribute("type", "range");
    //     inp.setAttribute("min", minValue); //variableMinHash[i]);
    //     inp.setAttribute("max", maxValue); //variableMaxHash[i]);
    //     inp.setAttribute("step", stepValue); //variableStepHash[i]);
    //     inp.setAttribute("value", lastValue);
    //     inp.setAttribute("alt", "Adjust " + v);
    //     inp.setAttribute("title", "Adjust " + v);
    //     el.append(inp);
    //     first.append(el);
    //     inp = $(inp);
    //     // Set initial value
    //     inp.val(lastValue);
    //     // Add change listener
    //     inp[0].setAttribute("onchange", "showValue(this.value, this.id)");
    
    
    // Max value
    template += "<font style='margin: auto;'>";
    template += currentContext.max;
    template += "</font>";
    template += "</div>";
  
    return template;
}

function populateDropDownValue(dropdown, context, fxnName, variableName, equation)
{
    var v, vars = equation.variables(),
        varLen = vars.length,
        template = "";
        
    // Clear dropdown
    dropdown.empty();
    
    // Grab current context for this variable
    var currCtx = context[variableName];
    
    // Setup value template
    template = currentValueTemplate(template, fxnName, variableName, currCtx);
    
    template = sliderValueTemplate(template, fxnName, variableName, currCtx);
    
    // Close variable list
    // template = closeVariableList(template);
    
    dropdown.html(template);
}

// TODO: This should probably be done using actual 
// object creation and not string concatenation but
// I'm too lazy to change it right now.
function populateDropDownVariables(dropdown, fxnName, equation)
{
    var vars = equation.variables(),
        varLen = vars.length,
        varName,
        active = equation.variable.varName,
        template = "";
        
    // Clear dropdown
    dropdown.empty();
    
    // Setup variable list
    template = openVariableList(template, "variables");
    
    // Add variables
    var varDOM;
    for(var i = 0; i < varLen; i++)
    {
        varName = vars[i];
        varDOM = "<label><input type='radio' name='variable'";
        if(varName == active)
        {
            varDOM += " checked='checked'";
        }
        varDOM += " onchange='selectVariable(\"" + fxnName + "\",\""+varName+"\")'>" + varName + "</label>";
        template += varDOM;
    }
    
    // Close variable list
    template = closeVariableList(template);
    
    dropdown.html(template);
}

function openVariableList(template, label)
{
    template += "<form>";
    template += "<fieldset>";
    template += "<legend style='display:none;'>" + label + "</legend>";
    return template;
}

function closeVariableList(template)
{
    template += "</fieldset>";
    template += "</form>";
    return template;
}

function editValue()
{
    // "." + name + "-" + v + "-variable"
    var id = this.id,
        first = id.indexOf("-"),
        second = id.indexOf("-", first+1),
        fxnName = id.substring(0,first),
        varName = id.substring(first+1,second);
        
    // Retrieve equation
    var row = $("#row_" + fxnName)[0],
        eq = row.fxnData.eq,
        context = row.fxnData.context;
    
    // Find drop down
    var dropdown = $("#dropdown_content_" + fxnName),
        container = $("#dropdown_" + fxnName);
    
    // Populate dropdown
    populateDropDownValue(dropdown, context, fxnName, varName, eq);
    
    // Show dropdown
    container.show();
}

function editVariable()
{
    // Function name
    var fxnName = this.id;
        fxnName = fxnName.substring(0,fxnName.length - 16);
        
    // Retrieve equation
    var row = $("#row_" + fxnName)[0];
    var eq = row.fxnData.eq;
    
    // Find drop down
    var dropdown = $("#dropdown_content_" + fxnName),
        container = $("#dropdown_" + fxnName);
    
    // Populate dropdown
    populateDropDownVariables(dropdown, fxnName, eq);
    
    // Show dropdown
    container.show();
}

function updateSolution(name, equation, context, solution)
{
    // document.getElementById("formula").innerText = equation.toString(context);
    // document.getElementById("solution").innerText = solution;
    // document.getElementById("function_name").innerText = $("#equationName").val();
    var cleanName  = sanitizeFunctionName(name);
    var fxn =  $("#fxn_" + cleanName)[0];
        var niceName = desanitizeFunctionName(name);
        var alertstring = "nicename: " + niceName + " name:" + name;
        var inner = equation.toHTML(niceName, name, "p", context);
        inner += " = " + solution;
            
    fxn.innerHTML = inner;
    
    // Add onclick listeners
    $("#" + name + "_active_variable").click(editVariable);
    var v, vars = equation.variables(),
        varLen = vars.length;
    for(var i = 0; i < varLen; i++)
    {
        v = vars[i];
        $("." + name + "-" + v + "-value").click(editValue);
    }
    
    // Save equation
    
    
    //$("#" + name + "_solution").text(solution);
    
    // var v, vars = equation.variables(),
    //     varLen = vars.length,
    //     varList = "";
    // for(var i = 0; i < varLen; i++)
    // {
    //     v = vars[i];
    //     varList += "<font id='" + v + "_param'>";
    //     varList += context[v];
    //     varList += "</font>";
    //     if(i != varLen - 1)
    //     {
    //         varList += ", ";
    //     }
    // }
    //document.getElementById("variable_list").innerHTML = varList;
    //$("#result").show();
    // Clear display property to fix stupid jQuery bug
    //$("#result").css({display: ""});
}


function createContext(eq, vars)
{
    var context = new Context(vars),
        varLen = vars.length,
        v, slider, val, step,
        data = eq.fxnData.context;
        
    for(var i = 0; i < varLen; i++)
    {
        v = vars[i];
        //step = parseFloat($("#" + v + "_step").val());
        //slider = $("#" + v + "_slider_value");//$("#" + v + "_slider");
        //val = parseInput(slider.text(),step);
        val = data[v].curr;
        context.set(v, val);
    }
    
    return context;
}


function solveEquation(equationElement, parsedEquation)
{
    if(typeof parsedEquation != "undefined")
    {
      // Create context
      var vars = parsedEquation.variables();
      var context = createContext(equationElement, vars);
      
      QGSolver.logDebugMessage("Context: " + context.toString());
      
      // Solve
      var solution = undefined;
      try
      {
          solution = QGSolver.solve(parsedEquation, context.toObj());
      }
      catch(exception)
      {
          visualErrorFunction();  
      }
      
      // If we solved the equation, update page
      if(typeof solution != "undefined")
      {
         // automatically generate a test case for any graph created  
          if(QGSolver.TESTGENERATION)
          {
              // add the name to the test case
              var testCase = "\nTestExamples.push({name:\"";
              testCase += $("#equationName").val() + "\",";
              
              // add the function to the test case
              testCase += "fxn : \"";
              testCase += parsedEquation.toString() + "\",";
              
              // add the curValContext to the test case
              testCase += "curVarContext : [";
              for(var j = 0;j<vars.length;j++)
              {
                  testCase += $("#" + vars[j] + "_slider_value").text();
                  if(j < vars.length-1)
                  {
                    testCase += ",";
                  }
              }
                            
              testCase += "],";
              
              // add the parse Solution to the test case
              testCase += "parseSol : \""
              testCase += parsedEquation.toString(context.toObj()) + "\",";
              
              // add the numerical Solution to the test case
              testCase += "numSol : \"";
              testCase += solution + "\"";
              
              // close out the brackets
              testCase += "});\n";
              
              
              console.log(testCase);
          }          
                    
          // Update solution display
          var name = equationElement.fxnData.name;
          updateSolution(name, parsedEquation, context.toObj(), solution);
          // Update graph
          addFunctionToGraph(name, parsedEquation, context);

          // update all graphs
          //updateAllGraphs(parsedEquation, context);
          
      }
        // generate a hash
        generateHashURL(parsedEquation.variables(),1);
    
    }
}

function solveEqInMult()
{
    if(typeof parsedEquation != "undefined")
    {
      // Create context
      var vars = parsedEquation.variables();
      var context = createContext(vars);
      
      QGSolver.logDebugMessage("Context: " + context.toString());
      
      // Solve
      var solution = undefined;
      try
      {
          solution = QGSolver.solve(context.toObj());
      }
      catch(exception)
      {
         visualErrorFunction();  
      }
      
      // If we solved the equation, update page
      if(typeof solution != "undefined")
      {
          // Update solution display
          updateSolution(parsedEquation, context.toObj(), solution);
          // update all graphs
          updateAllGraphs(parsedEquation, context);
          
      }
        // generate a hash
        generateHashURL(parsedEquation.variables(),1);
    
    }
}

function removeDuplicateVariables(dupArray)
{
    var a = [];
    var l = dupArray.length;
    for(var i=0; i<l; i++) {
        var found = 0;
        for(var j=i+1; j<l; j++) {
            // If this[i] is found later in the array
            if (dupArray[i] == dupArray[j])
            {
                found = 1;
            }
            if(dupArray[i] == ",")
            {
                found = 1;
            }
        }
        if(found == 0)
        {
            a.push(dupArray[i]);
        }
    }
    return a;
}

function toggleDraw(toggleID)
{
    solveEquation(this);
}

function updateMinimum(inputID)
{
    // Retrieve variable name
    var v = inputID.substring(0,inputID.indexOf("_")),
        minField = $("#" + v + "_min"),
        min = parseFloat(minField.val()),
        maxField = $("#" + v + "_max"),
        max = parseFloat(maxField.val()),
        step = parseFloat($("#" + v + "_step").val()),
        slider = $("#" + v + "_slider"),
        curr = parseInput(slider.val(), step);
    // Make sure the value is less than the maximum
    if(min >= max)
    {
        min = max - 1;
        minField.val(min);
    }
    // Make sure slider value is within new range
    if(curr < min)
    {
        slider.val(min);
    }
    // Update slider values
    slider[0].setAttribute("min", min);
    
    // Resolve with new parameters
    solve();
    
    // if we changed the value we need to change the display
    if(curr < min)
    {
        // update visually
        showValue(min, inputID);
    }
    
}

function updateMaximum(inputID)
{
    // Retrieve variable name
    var v = inputID.substring(0,inputID.indexOf("_")),
        minField = $("#" + v + "_min"),
        min = parseFloat(minField.val()),
        maxField = $("#" + v + "_max"),
        max = parseFloat(maxField.val()),
        step = parseFloat($("#" + v + "_step").val()),
        slider = $("#" + v + "_slider"),
        curr = parseInput(slider.val(), step);
    // Make sure the value is grater than the minimum
    if(max <= min)
    {
        max = min + 1;
        maxField.val(max);
    }
    // Make sure slider value is within new range
    if(curr > max)
    {
        slider.val(max);
    }
    // Update slider values
    slider[0].setAttribute("max", max);
    // Resolve with new parameters
    solve();

    // if we changed the value we need to change the display
    if(curr > max)
    {
        // update visually
        showValue(max, inputID);
    }    
    
}

function updateStep(inputID)
{
    // Retrieve variable name
    var v = inputID.substring(0,inputID.indexOf("_")),
        stepField = $("#" + v + "_step"),
        slider = $("#" + v + "_slider");
    // Update slider values
    slider[0].setAttribute("step", parseFloat(stepField.val()));
    // Resolve with new parameters
    solve();
}

/* function generateHashURL generates a save hash url for the current equation, receives variables as argument*/
function generateHashURL(vars,multi)
{
    // do NOT use window.location.href
    // it FAILS to on redirection sites
    //var URL = window.location.href,
    var URL = "www.hunterdavis.com/quickgrapher/index.html?";
    // Pull off any existing URI params
    end = URL.indexOf("?");
    if(end != -1)
    {
        URL = URL.substring(0,end+1);
    }
    else
    {
        URL = URL + "?";
    }
    
    functionListParent = $("#function_list");	
    // the base equation div name
    //var eqNameBase = "#mainEquation";
    // the base name div name
    //var nameNameBase = "#equationName";

    functionListParent.find('div').each(function(i, el) {
        var row = $(el)[0];
        if(typeof row.fxnData != "undefined")
        {
            var localEquation = row.fxnData.eq.toString();
            if(typeof localEquation != "undefined")
            {
                URL += compressName(localEquation);
                var localName = row.fxnData.name.toString();
                localName = localName.replace(/\s/g,"%20");
                if(typeof localName != "undefined")
                {
                    URL += ":";
                    URL += localName; 
                }
            
            // now add the variable context into the hash for this eq
            var localContext = row.fxnData.context;
            for(var variableIndex in localContext)
            {
                URL += ":"
                URL += variableIndex;
                URL += ":";
                URL += localContext[variableIndex].min;
                URL += ":";
                URL += localContext[variableIndex].curr;
                URL += ":";
                URL += localContext[variableIndex].max;
            }
            
        URL += "{"
        }
        }
    })
    URL += "=";

    
    // replace spaces with %20 for web addresses
    //var graphName =  $("#totalName").val(),
    //cleanGraphName = graphName.replace(/\s/g,"%20");
    var cleanGraphName = "";
    
    // clean up the plusses in URL for email clients
    URL = URL.replace(/\+/g,"'%");
    
    // add the fully constituted strings to URL
    URL += cleanGraphName + "]";
    
    // sneak the url into the instructions block    
    $("#instruct").attr("href", URL);
    //updateShare(URL,graphName);
    
    // sneak the url into social sharing services
    $("#twitter_share").attr("st_url",URL);
    $("#facebook_share").attr("st_url",URL);
    $("#linkedin_share").attr("st_url",URL);
    $("#gbuzz_share").attr("st_url",URL);
    $("#email_share").attr("st_url",URL);
    $("#sharethis_share").attr("st_url",URL);
    $("#reddit_share").attr("st_url",URL);
    $("#slashdot_share").attr("st_url",URL);
    
}

// update our share icon dynamically
function updateShare(url, title)
{
    if(typeof SHARETHIS != "undefined")
    {
        var object = SHARETHIS.addEntry({
        title: title,
        url: url
        });
        object.attachButton(document.getElementById('blank_share'));
    }
} 


function createFunctionRow(name,fxn,parsed)
{
    var v;
    var vars = parsed.variables();
    var varsLen = vars.length, ctx,
        el, elParent = $("#function_list"),
        row, container,
        style,
        main_id = "row_" + name;
        
    // Create context
    ctx = {};
    for(var i = 0; i < varsLen; i++)
    {
        v = vars[i];
        // Default value is 1 RANDOM!!!!11!1!
        ctx[v] = {
            min: 0,
            curr: Math.round(1+20*Math.random()),
            max: 100
        };
    }
    return createFunctionRowWithContext(name, fxn, parsed,ctx)
}

function createFunctionRowWithContext(name, fxn, parsed,context)
{
    var v;
    var vars = parsed.variables();
    var varsLen = vars.length, ctx,
        el, elParent = $("#function_list"),
        row, container,
        style,
        main_id = "row_" + name;
        
    // Create context
    ctx = context;

    // Check if we already have this row
    row = $("#" + main_id);
    // 
    // // Row container
    // el = document.createElement("div");
    // el.id = "row_" + name;
    // el.className = "fxn_row";
    // el.fxnData = {
    //     name: name,
    //     fxn: fxn,
    //     eq: parsed,
    //     context: ctx
    // };
    // row = el;
    // el = $(el);
    // elParent.append(el);
    // elParent = el;
    // 
    // // Row table
    // el = document.createElement("table");
    // elParent.append(el);
    // elParent = $(el);
    // 
    // // Table row
    // el = document.createElement("tr");
    // elParent.append(el);
    // el = $(el);
    // // set an attr on each row for value tracking
    // el.attr("innerFunction",fxn);
    // el.attr("innerName",name);
    // 
    // elParent = $(el);
    // 
    // // Icon column
    // el = document.createElement("td");
    // el.id = "icons_" + name;
    // el.className = "fxn_icons";
    // el = $(el);
    // elParent.append(el);
    // 
    // // Function column
    // el = document.createElement("td");
    // el.id = "fxn_" + name;
    // el.className = "fxn_highlight";
    // // Function HTML string (id prefix, element open tag, element close tag, context(optional) )
    // var niceName = name.replace(/\_/g," ");
    // var inner = parsed.toHTML(niceName,"p");
    // 
    //     inner += " = ";
    // el.innerHTML = inner;
    // el = $(el);
    // // modified later by graph
    // style = {
    //     background: "rgb(255,255,255)",
    //     innerFunction: parsed.toString(),
    //     innerName: name,
    // };
    // el.css(style);
    // elParent.append(el);
    // 
    // // Remove column
    // el = document.createElement("td");
    // el.id = "remove_" + name;
    // el.className = "fxn_remove";
    // elParent.append(el);

        
    if(row.length == 0)
    {
        // Row container
        el = document.createElement("div");
        el.id = main_id;
        el.className = "fxn_row";
        el.fxnData = {
            name: name,
            fxn: fxn,
            eq: parsed,
            context: ctx
        };
        row = el;
        el = $(el);
        elParent.append(el);
        elParent = el;
        
        // Row table
        el = document.createElement("table");
        el.setAttribute("cellspacing","0");
        elParent.append(el);
        var elTable = $(el);
        elParent = $(el);
        
        /////// First row ////////////
        
        // Function display row
        el = document.createElement("tr");
        elParent.append(el);
        elParent = $(el);
        
        // Icon column
        el = document.createElement("td");
        el.id = "icons_" + name;
        el.className = "fxn_icons";
        el = $(el);
        elParent.append(el);
        
        // Function column
        el = document.createElement("td");
        el.id = "fxn_" + name;
        el.className = "fxn_highlight";
        // Function HTML string (id prefix, element open tag, element close tag, context(optional) )
        var inner = parsed.toHTML(name,"p")
            inner += " = ";
        el.innerHTML = inner;
        el = $(el);
        // modified later by graph
        style = {
            background: "rgb(255,255,255)"
        };
        el.css(style);
        elParent.append(el);
        
        // Remove column
        el = document.createElement("td");
        el.id = "remove_" + name;
        el.className = "fxn_remove";
        elParent.append(el);
        
        el.innerHTML = "-";
        
        $(el).click(removeRow);
        
        /////// Second row ////////////
        
        // Dropdown row
        el = document.createElement("tr");
        el.id = "dropdown_" + name;
        elTable.append(el);
        elParent = $(el);
        elParent.hide();
        container = elParent;
        
        // Empty column
        el = document.createElement("td");
        el.id = "empty_left_" + name;
        // el = $(el);
        elParent.append(el);
        $(el).click(removeRow);
        
        // Dropdown column
        el = document.createElement("td");
        el.id = "ddc_" + name;
        el.className = "fxn_dropdown";
        el = $(el);
        // modified later by graph
        style = {
            border: "0px"
        };
        el.css(style);
        elParent.append(el);
        
        createDropdownTable(container, el, name);
        
        // Empty column
        el = document.createElement("td");
        el.id = "empty_right_" + name;
        elParent.append(el);
        
        $(el).click(removeRow);
    }
    else
    {
        row = row[0];
        row.fxnData = {
            name: name,
            fxn: fxn,
            eq: parsed,
            context: ctx
        };
        // Function HTML string (id prefix, element open tag, element close tag, context(optional) )
        var inner = parsed.toHTML(name,"p")
            inner += " = ";
        // Update function
        $("#fxn_" + name)[0].innerHTML = inner;
    }
    
    return row;
}


function createDropdownTable(container, root, name)
{
    var el, table, row;
    // Dropdown slide buttons and container
    table = document.createElement("table");
    table.className = "fxn_dropdown";
    table = $(table);
    root.append(table);
    
    row = document.createElement("tr");
    //row.className = "fxn_dropdown";
    row = $(row);
    root.append(row);
    
    el = document.createElement("td");
    el.className = "fxn_dropdown_closer";
    el.innerHTML = "«";
    el = $(el);
    el.click(function(){
        container.hide()
    });
    row.append(el);
    
    el = document.createElement("td");
    el.id = "dropdown_content_" + name;
    el.className = "fxn_dropdown_content";
    row.append($(el));
    
    el = document.createElement("td");
    el.className = "fxn_dropdown_closer";
    el.innerHTML = "«";
    el = $(el);
    el.click(function(){
        container.hide()
    });
    row.append(el);
}

function removeRow()
{
    var id = $(this).attr("id").substring(7);
    // Remove from UI
    $("#row_" + id).remove();
    // Remove from graph
    $("#subgraph").remove_data(id);
}


function createSliders(vars)
{
    var v, varsLen = vars.length,
        sliderParent = $("#variables"),
        el, inp, first,
        sliderLabel, sliderValue,
        graphCheck, graphCheckLabel;
    for(var i = 0; i < varsLen; i++)
    {
        // each variable may have a stored min, max, step, last
        var minValue = "";
        var maxValue = "";
        var stepValue = "";
        var lastValue = "";
        var visValue = 1;
        // if not, use the default values
        // default min value
        if(!variableMinHash[i]) {
            minValue = 0;
        }
        else
        {
            minValue = variableMinHash[i];
        }
        // default max value
        if(typeof variableMaxHash[i] == "undefined") {
            maxValue = 100;
        }
        else
        {
            maxValue = variableMaxHash[i];
        }
         // default step value
        if(typeof variableStepHash[i] == "undefined") {
            stepValue = 1;
        }
        else
        {
            stepValue = variableStepHash[i];
        }       
        // default last value
        if(typeof variableLastHash[i] == "undefined") {
            lastValue = 1;
        }
        else
        {
            lastValue = variableLastHash[i];
        }
        if(typeof variableVisHash[i] == "undefined") {
            visValue = 1;
        }
        else
        {
            visValue = variableVisHash[i];
        }
        
        v = vars[i];
        // Create slider list item
        first = document.createElement("tr");
        first.setAttribute("class","variable");
        sliderParent.append(first);
        first = $(first);
        // Create show checkbox
        inp = document.createElement("input");
        inp.setAttribute("class","show_select");
        inp.id = v + "_graph_checkbox";
        inp.setAttribute("type", "checkbox");
        inp.setAttribute("onclick", "toggleInclude(this.id)");
        inp.setAttribute("alt", "Draw " + v);
        inp.setAttribute("title", "Draw " + v);
        if(visValue == 1)
        {
            inp.setAttribute("checked", "checked");
        }
        
        // Variable name and value  (added checkbox here)
        el = document.createElement("td");
        el.setAttribute("rowspan","2");
        el = $(el);
        
        el.append(inp);
        
        inp = document.createElement("div");
        inp.innerHTML = v + "<font style='font-size: 7pt; margin-left:2px;'> = </font>";
        inp.id = v + "_variable_name";
        el.append(inp);
        inp = $(inp);
        var cs = {
            width:"100%",
            // Need to load this from graph
            color:"rgb" + "(0,0,0)",
            display: "inline"
        };

        cs["font-size"] = "13pt";
        inp.css(cs);
        inp = document.createElement("div");
        inp.setAttribute("class","variable_value");
        inp.innerHTML = lastValue;
        inp.id = v + "_slider_value";
        el.append(inp);
        inp = $(inp);
        first.append(el);
        
        el = document.createElement("td");
        el.setAttribute("class","minimum");
        el = $(el);
        inp = document.createElement("input");
        inp.setAttribute("id", v + "_min");
        inp.setAttribute("type", "text");
        inp.setAttribute("class", "range_input");
        inp.setAttribute("size", "10");
        inp.setAttribute("value", minValue);
        inp.setAttribute("onchange", "updateMinimum(this.id)");
        inp.setAttribute("alt", "Set minimum value for " + v);
        inp.setAttribute("title", "Set minimum value for " + v);
        el.append(inp);
        first.append(el);
        
        el = document.createElement("td");
        el.setAttribute("class","step");
        el = $(el);
        inp = document.createElement("input");
        inp.setAttribute("id", v + "_step");
        inp.setAttribute("type", "text");
        inp.setAttribute("class", "range_input");
        inp.setAttribute("size", "10");
        inp.setAttribute("value", stepValue);
        inp.setAttribute("onchange", "updateStep(this.id)");
        inp.setAttribute("alt", "Set step value for " + v);
        inp.setAttribute("title", "Set step value for " + v);
        el.append(inp);
        first.append(el);
        
        el = document.createElement("td");
        el.setAttribute("class","maximum");
        el = $(el);
        inp = document.createElement("input");
        inp.setAttribute("id", v + "_max");
        inp.setAttribute("type", "text");
        inp.setAttribute("class", "range_input");
        inp.setAttribute("size", "10");
        inp.setAttribute("value", maxValue);
        inp.setAttribute("onchange", "updateMaximum(this.id)");
        inp.setAttribute("alt", "Set maximum value for " + v);
        inp.setAttribute("title", "Set maximum value for " + v);
        el.append(inp);
        first.append(el);
        
        first = document.createElement("tr");
        first.setAttribute("class","variable");
        sliderParent.append(first);
        first = $(first);
        
        el = document.createElement("td");
        el.setAttribute("class","range");
        el.setAttribute("colspan","3");
        el = $(el);
        inp = document.createElement("input");
        inp.id = v + "_slider";
        inp.setAttribute("type", "range");
        inp.setAttribute("min", minValue); //variableMinHash[i]);
        inp.setAttribute("max", maxValue); //variableMaxHash[i]);
        inp.setAttribute("step", stepValue); //variableStepHash[i]);
        inp.setAttribute("value", lastValue);
        inp.setAttribute("alt", "Adjust " + v);
        inp.setAttribute("title", "Adjust " + v);
        el.append(inp);
        first.append(el);
        inp = $(inp);
        // Set initial value
        inp.val(lastValue);
        // Add change listener
        inp[0].setAttribute("onchange", "showValue(this.value, this.id)");
    }
    
    // Verify slider compatibility with browser
    //If range isnt supported
    if(!Modernizr.inputtypes.range)
    {
        $('input[type=range]').each(function() {  
            var $input = $(this);  
            var $slider = $('<div id="' + $input.attr('id') + '" class="' + $input.attr('class') + '"></div>');  
            var step = $input.attr('step');  
            
            $input.after($slider).hide();  
            
            $slider.slider({  
                min: parseFloat($input.attr('min')),
                max: parseFloat($input.attr('max')),
                step: parseFloat($input.attr('step')),
                value: parseFloat($input.attr('value')),
                change: function(e, ui) { 
                    showValue(ui.value, this.id);
                }  
            });
        });
    }
}

function verifyGraph()
{
    var graphID = "subgraph";
    // Check if we already have a graph element
    graph = $("#" + graphID);
    if(graph.length == 0)
    {
        // Create graph element
        var parentElement = $("#graph_container");
        graph = document.createElement("div");
        graph.id = graphID;
        graph.style.position = "relative";
        graph.style.width = "100%";
        graph.style.height = "100%";
        // Add to canvas
        parentElement.append(graph);
        
        // Register with Graph
        var graphName = $("#equationName").val();
        graph = $(graph);
        var opts = {name: graphName};
        opts['hue-increment'] = 45;
        opts['hue-base'] = 22;
        opts['value-base'] = 95;
        opts['title'] = "What to put for title?"; //$("#equationName").val() + " ( " + vars.join(", ") +" )";
        graph.graphify(opts).realHover({
            hover: Graph.highlightNearest,
            out: Graph.removeHighlight
        });
        
        // Set variable colors from plot
        // var color;
        // for(var i = 0; i < varLen; i++)
        // {
        //     v = vars[i];
        //     color = $("#subgraph").color(v);
        //     if(typeof color == "undefined")
        //     {
        //         color = "rgb(0,0,0)";
        //     }
        //     
        //     $("#" + v + "_slider_value").css({color: color});
        // }
    }
}

function addFunctionToGraph(name, equation, context)
{
    // Verify graph exists
    verifyGraph();
    
    // Solve function
    var localContext = context.toObj(),
        min = 0,
        step = 0.1,
        max = 100,
        steps = ((max - min)/step) + 1,
        graphVariable = equation.variable.varName,
        //originalVarValue = localContext[equation.variable],
        originalVarValue = localContext[equation.variable.varName],
        currVarValue, solution, data = [];
        
        
    localContext[graphVariable] = new VariableIterator(min,step);
        
    // Solve for the specified points
    for(var i = 0; i < steps; i++)
    {
        currVarValue = localContext[graphVariable].value;
        try
        {
            solution = equation.solve(localContext);
        } catch(error)
        {
            solution = undefined;
            QGSolver.logDebugMessage("Solve Error: [var: "+graphVariable+", value: "+currVarValue+"] " + error);
            visualErrorFunction();  
            
        }
        // Only add the point if it is a valid solution
        if((typeof solution != "undefined") && isFinite(solution))
        {
            data.push([currVarValue, solution]);
        }
        
        // Step variable
        localContext[graphVariable].step();
    }
    
    // Add plot for this variable (will overwrite existing ones)
    var cs = {label : graphVariable};//name};
    cs['plot-type'] = 'line';
    cs['graph'] = graph;
    cs['highlight-point'] = originalVarValue;
    graph.plot(
        name,
        data,
        cs
    );
    
    // Update color
    var color = $("#subgraph").color(name);
    if(typeof color == "undefined")
    {
        color = "rgb(255,255,255)";
    }
    
    var cs = {};
    cs["background-color"] = color;
    
    $("#fxn_" + name).css(cs);
}

// updates graphs for all variables
function updateAllGraphs(equation, context)
{
    var unifiedGraph = true,
        graph,
    // Retrieve variables
        v, vars = equation.variables(),
        varLen = vars.length;
    if(unifiedGraph)
    {
        var graphID = "subgraph";
        // Check if we already have a graph element
        graph = $("#" + graphID);
        if(graph.length == 0)
        {
            // Create graph element
            var parentElement = $("#graph_container");
            graph = document.createElement("div");
            graph.id = graphID;
            graph.style.position = "relative";
            graph.style.width = "100%";
            graph.style.height = "100%";
            // Add to canvas
            parentElement.append(graph);
            
            // Register with Graph
            var graphName = $("#equationName").val();
            graph = $(graph);
            var opts = {name: graphName};
            opts['hue-increment'] = 45;
            opts['hue-base'] = 22;
            opts['value-base'] = 95;
            opts['title'] = $("#equationName").val() + " ( " + vars.join(", ") +" )";
            graph.graphify(opts)/*.attach_legend({
              'legend-mode': false,
              'legend-container': $("#legend"),
            })*/.realHover({
                hover: Graph.highlightNearest,
                out: Graph.removeHighlight
            });
            
            // Set variable colors from plot
            var color;
            for(var i = 0; i < varLen; i++)
            {
                v = vars[i];
                color = $("#subgraph").color(v);
                if(typeof color == "undefined")
                {
                    color = "rgb(0,0,0)";
                }
                
                $("#" + v + "_slider_value").css({color: color});
            }
        }
        else
        {
            // Update graph title
            graph.graph_option("title",$("#equationName").val() + " ( " + vars.join(", ") +" )");
        }
    }
 
    /// Loop over variable
    var name = "",
        localContext = context.toObj(),
        step, min, max;
        
    for(var i = 0; i < varLen; i++)
    {
        // Current variable
        v = vars[i];
        // If we are supposed to draw this variable
        if($("#" + v + "_graph_checkbox").is(":checked")
            || (typeof graph.color(v) == "undefined"))
        {
            // Adjust context
            var fixedPt = localContext[v],
                min = parseFloat($("#" + v + "_min").val()),
                step = parseFloat($("#" + v + "_step").val()),
                max = parseFloat($("#" + v + "_max").val()),
                steps = ((max - min)/step) + 1;
            // Substitute iterator
            localContext[v] = new VariableIterator(min,step);
            // Create graph
            updateGraph(graphID, v, equation, localContext, steps);
            // Replace values into local context for next loop step
            localContext[v] = fixedPt;
        }
        if(!$("#" + v + "_graph_checkbox").is(":checked"))
        {
            // Make sure we have cleared the data for this variable
            graph.hide_data(v);
        }
    }
}

// updates a single graph
function updateGraph(graphID, graphVariable, equation, context, steps)
{
    // Retrieve reference to graph object
    var graph = $("#" + graphID),
        currVarValue, solution, data = [];
        
    // Solve for the specified points
    for(var i = 0; i < steps; i++)
    {
        currVarValue = context[graphVariable].value;
        try
        {
            solution = equation.solve(context);
        } catch(error)
        {
            solution = undefined;
            QGSolver.logDebugMessage("Solve Error: [var: "+graphVariable+", value: "+currVarValue+"] " + error);
            visualErrorFunction();  
            
        }
        // Only add the point if it is a valid solution
        if((typeof solution != "undefined") && isFinite(solution))
        {
            data.push([currVarValue, solution]);
        }
        
        // Step variable
        context[graphVariable].step();
    }
    
    var lbl = "",
        v, vars = equation.variables(),
        varLen = vars.length;

    lbl += graphVariable;
    
    // Add plot for this variable (will overwrite existing ones)
    var cs = {label : lbl};
    cs['plot-type'] = 'line';
    graph.plot(
        graphVariable,
        data,
        cs
    );
    
    // Set variable colors from plot
    var color = $("#subgraph").color(lbl);
    if(typeof color == "undefined")
    {
        color = "rgb(0,0,0)";
    }
    
    //$("#" + lbl + "_variable_name").css({"color": color});
    $("#" + lbl + "_slider_value").css({color: color});
    cs = {color: color};
    cs["font-weight"] = "bold";
    $("#" + lbl + "_param").css(cs);
}

// returns a unique function name 
function getUniqueFunctionName(name)
{
    var functionName = name;
    var functionListParent = $("#function_list");	
    var foundUniqueIterations = 1;
    var continueLooping = 1;
    
    while(continueLooping > 0)
    { 
        if(foundUniqueIterations > 1)
        {
            functionName = name + "(" + foundUniqueIterations.toString() + ")";
        }
        var foundOne = 0;
        // test for duplicate names;
        functionListParent.find('tr').each(function(i, el) {
            var localName = $(el).attr('innerName');
            if(functionName == localName)
            {
                foundOne = 1;
            }
        })
        if(foundOne == 0)
        {
            continueLooping = 0;
            return functionName;
        }
        foundUniqueIterations++;
    }
}

function toggle(exampleID)
{
    var ex = $("#" + exampleID);
    if(ex.is(":visible"))
    {
        ex.hide();
    }
    else
    {
        // Hide all others
        $(".menu_item").hide();
        // Show this one
        ex.show();
    }
    return false;
}

function showExamples(exampleID)
{
    var ex = $("#" + exampleID);
    ex.show();
    return false;
}

function hideExamples(exampleID)
{
    var ex = $("#" + exampleID);
    ex.hide();
    return false;
}

function nextExamples()
{
    var exLen = examples.length;
    if((curr_page + 1) * 5 < exLen)
    {
        curr_page = curr_page + 1;
        // Clear display
        var list = $("#examplelist").empty();
        
        var ex, example;
        
        for(var i = (curr_page * 5); i < exLen && i < (curr_page + 1)*5; i++)
        {
            ex = examples[i];
            createExampleLink(ex, list);
        }
            
        if( curr_page > 0 )
        {
            $("#prevExamples").show();
        }
        if( ((curr_page+1)*5) > exLen )
        {
            $("#nextExamples").hide();
        }
    }
    return false;
}

function prevExamples()
{
    var exLen = examples.length;
    if(curr_page > 0)
    {
        curr_page = curr_page - 1;
        // Clear display
        var list = $("#examplelist").empty();
        
        var ex, example;
        
        for(var i = (curr_page * 5); i < exLen && i < (curr_page + 1)*5; i++)
        {
            ex = examples[i];
            createExampleLink(ex, list);
        }
        
        $("#nextExamples").show();
        if( curr_page == 0 )
        {
            $("#prevExamples").hide();
        }
    }
    return false;
}

var examples,
    functions,
    curr_page;

function loadExamples()
{
    // Load examples
    examples = Examples;
    // If there was nothing to load, just create empty array
    if(typeof examples == "undefined")
    {
        examples = [];
    }
    
    if(examples.length > 0)
    {
        resetExamples();
    }
}

function loadFunctions()
{
    // Load functions
    functions = Functions;
    // If there was nothing to load, just create empty array
    if(typeof functions == "undefined")
    {
        functions = {};
    }
  
    var list = $("#functionlist"), fxn,
        col, row = 0, cols = 5,
        fxnCount = 0, colSize = 1, colWidth,
        emptied = false, margins;
    // Count functions
    for(var f in functions)
    {
        fxnCount++;
    }
    colSize = Math.ceil(fxnCount / cols);
    var item = list,
      w = item.width();
    while(w == 0 || item.css("width").indexOf("%") != -1)
    {
        if(typeof item.parent() != "undefined")
        {
            item = item.parent();
            w = item.width();
        }
        else
        {
            break;
        }
    }
    colWidth = Math.floor(item.width() / cols);
    if(colSize < 1)
    {
        colSize = 1;
    }
    // Create links
    for(var fxnName in functions)
    {
        if(!emptied)
        {
            list.empty();
            emptied = true;
        }
        margins = "margin-top: ";
        col = Math.floor(row/colSize);
        var top = 0;
        if(row > 0 && row % colSize == 0)
        {
            top = -14 * colSize;
        }
        
        margins += top + "px;";
        margins += " margin-left: " + (col * colWidth + 5) + "px;";
        // If last row
        var next = row + 1;
        if(next == fxnCount && next % colSize != 0)
        {
            margins += " margin-bottom: " +  (14 * (colSize - (next%colSize))) + "px;";
        }
        createFunctionLink(fxnName, margins, list);
        row++;
    }
}

function insertFunction(linkID)
{
    var fxnName = linkID.substring(linkID.indexOf("_")+1,linkID.length),
        fxn = functions[fxnName];
    
    if(typeof fxn != "undefined")
    {
        var append = "",
            eq = $("#mainEquation"),
        // Add a space if none there
            curr = eq.val(),
            cursorOffset = 0;
        if(curr.length > 0 && curr.charAt(curr.length - 1) != " ")
        {
            append += " ";
            
        }
        append += fxnName;
        if(fxn.prefix)
        {
            append += "()";
            cursorOffset = -2;
        }
        append += " ";
        curr += append;
        eq.val(curr);
        // Focus
        eq.focus();
        // Set cursor
        eq[0].selectionStart = curr.length + cursorOffset;
        eq[0].selectionEnd = curr.length + cursorOffset;
    }
}

function compressName(name)
{
    // Remove spaces
    var compressed = name.replace(/\s/g,"");
    return compressed;
}

// removes ' and space from function name
function sanitizeFunctionName(name)
{
    name = name.replace(/\s/g,"_");
    name = name.replace(/\'/g,"-_-");
    return name;
}

// add's ' and space back in
function desanitizeFunctionName(name)
{
    name = name.replace(/\-\_\-/g,"'");
    name = name.replace(/_/g," ");
    return name;
}

function createFunctionLink(fxnStr, style, parent)
{
    var ex = document.createElement("li");
    
    ex.setAttribute("id","fxn_" + fxnStr);
    ex.setAttribute("onclick","insertFunction(this.id)");
    ex.setAttribute("style",style);
    
    // Text to add
    ex.innerHTML = fxnStr;
    
    parent.append(ex);
}

function createExampleLink(example, parent)
{
    var ex = document.createElement("li"),
        inner = "<a href='http://www.hunterdavis.com/quickgrapher/index.html?";
    inner += compressName(example.url);
    inner += "'>"
    inner += example.name;
    inner += "</a>";
    ex.innerHTML = inner;
    ex.setAttribute("id","example_" + compressName(example.name));
    parent.append(ex);
}

function resetExamples()
{
    curr_page = 0;
    
    // Clear display
    var list = $("#examplelist");
    list.empty();
    
    // Display
    var exLen = examples.length,
        ex, example;
    
    for(var i = (curr_page * 5); i < exLen && i < (curr_page + 1)*5; i++)
    {
        ex = examples[i];
        createExampleLink(ex, list);
    }
        
    if( exLen > 5 )
    {
        $("#nextExamples").show();
    }
}

function loadExample(exampleID)
{
    var exampleName = exampleID.substring(8,exampleID.length),
        ex, exLen = examples.length;
    
    // Close examples list
    var p = $("#" + exampleID).parent();
    hideExamples(p.id());
    
    // Load display
    for(var i = 0; i < exLen; i++)
    {
        ex = examples[i];
        if(compressName(ex.name) == exampleName)
        {
            $("#mainEquation").val(ex.fxn);
            $("#graphBtn").click();
            break;
        }
    }
    
    return false;
}

function getViewportDimensions()
{
    var dims = {};
    // Compliant browsers use innerWidth
    if (typeof window.innerWidth != 'undefined')
    {
        dims.width = window.innerWidth,
        dims.height = window.innerHeight
    }
    // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
    else if (typeof document.documentElement != 'undefined'
        && typeof document.documentElement.clientWidth !=
        'undefined' && document.documentElement.clientWidth != 0)
    {
        dims.width = document.documentElement.clientWidth,
        dims.height = document.documentElement.clientHeight
    }
    // For older versions of IE
    else
    {
        dims.width = document.getElementsByTagName('body')[0].clientWidth,
        dims.height = document.getElementsByTagName('body')[0].clientHeight
    }
    
    return dims;
}

var fullscreen_active = false,
    // To prevent re-entrance issues if the person clicks link rapidly
    toggling = false;
    
function resizeFullscreen()
{
    // Calculate available width
    var dims = getViewportDimensions(),
        w = dims.width,
        h = dims.height,
    // Graph & equation get 75%
        graphW = Math.floor(0.75 * w),
    // Solution and variables get other 25%
        resultsW = w - graphW - 5;
    
    // Adjust for vertical screens
    var vertical = false;
    // Start adjusting graph compression
    // Minimum width the variable bar can manage is 240px
    if(resultsW < 250)
    {
        resultsW = 250;
        graphW = w - resultsW - 5;
    }
    if(h > 1.05*w)
    {
        vertical = true;
    } 
    
    // Fix styles
    var style;
    if(vertical)
    {
        $("#result").removeClass("result_fullscreen");
        $("#solution_column").addClass("solution_column");
        $("#solution_column").removeClass("solution_column_fullscreen");
        $("#variables_column").addClass("variables_column_fullscreen_vert");
        $("#variables_column").removeClass("variables_column");
        $("#variables_column").removeClass("variables_column_fullscreen");
        style = {
            width : Math.floor(w - 300)
        };
        $("#variables_column").css(style);
        style = {
            width : Math.floor(w - 10),
            height : Math.floor(0.65 * h)
        };
        $("#graph_container").css(style);
        style = {width : w - 260};
        $("#mainEquation").css(style);
        
        // Remove background logo
        style = {};
        style["background-image"] = "";
        $("#fullscreen_container").css(style);
    }
    else
    {
        $("#result").addClass("result_fullscreen");
        $("#solution_column").removeClass("solution_column");
        $("#solution_column").addClass("solution_column_fullscreen");
        $("#variables_column").removeClass("variables_column");
        $("#variables_column").removeClass("variables_column_fullscreen_vert");
        $("#variables_column").addClass("variables_column_fullscreen");
        style = {width : ""};
        $("#mainEquation").css(style);
        style = {width : graphW - 30};
        $("#equation").css(style);
        style = {
            width : graphW,
            height : h - 40
        };
        $("#graph_container").css(style);
        style = {width : resultsW};
        $("#result").css(style);
        $("#solution_column").css(style);
        $("#variables_column").css(style);
        
        // Add background logo
        style = {};
        style["background-image"] = "url('images/logo_1.png')";
        $("#fullscreen_container").css(style);
    }
}
    
function toggleFullscreen()
{
    if(!toggling)
    {
        toggling = true;
        if(!fullscreen_active)
        {
            // Update toggle
            fullscreen_active = true;
            $("#fullscreen_toggle").text("X");
            var style = {};
            style["background-color"] = "rgb(255,0,0)";
            style["color"] = "rgb(255,255,255)";
            style["border"] = "0px";
            $("#fullscreen_toggle").css(style);
            // Hide normal elements
            $("#container").hide();
            $("#footer").hide();
            $("#beta_box").hide();
            // Move necessary elements to fullscreen block
            var fsc = $("#fullscreen_container");
            // -- Equation
            fsc.append($("#equation"));
            // -- Graph
            fsc.append($("#graph_container"));
            // -- Solutions & Variables
            fsc.append($("#result"));
            // -- Variables
            // Calculate available width
            var dims = getViewportDimensions(),
                w = dims.width,
                h = dims.height,
                vertical = false,
            // Graph & equation get 75%
                graphW = Math.floor(0.75 * w),
            // Solution and variables get other 25%
                resultsW = w - graphW - 5;
                
            if(h > 1.05*w)
            {
                vertical = true;
            }
                
            // Fix styles
            style = {};
            // Background style
            if(vertical)
            {
                // Remove background logo
                style["background-image"] = "";
                $("#fullscreen_container").css(style);
            }
            else
            {
                // Add background logo
                style["background-image"] = "url('images/logo_1.png')";
                $("#fullscreen_container").css(style);
            }
            // Input style
            style = {};
            style["margin"] = "2px 0px 0px 30px";
            $("#equation").css(style);
            
            // Graph style
            style = {};
            style["margin"] = "5px 5px 5px 5px";
            style["display"] = "inline";
            $("#graph_container").css(style);
            
            // Results and variables display
            if(!vertical)
            {
                $("#result").addClass("result_fullscreen");
            }
            
            $("#mainEquation").removeClass("equation_input");
            $("#mainEquation").addClass("equation_input_fullscreen");
            
            if(!vertical)
            {
                $("#solution_column").removeClass("solution_column");
                $("#solution_column").addClass("solution_column_fullscreen");
                $("#variables_column").removeClass("variables_column");
                $("#variables_column").addClass("variables_column_fullscreen");
            }
            resizeFullscreen();
            // Show fullscreen block
            $("#fullscreen_container").show();
            // Fire resize handler
            $("#subgraph").trigger("resize");
        }
        else
        {
            // Update toggle
            fullscreen_active = false;
            $("#fullscreen_toggle").text("Fullscreen");
            var style = {};
            style["background-color"] = "";
            style["color"] = "";
            style["border"] = "";
            $("#fullscreen_toggle").css(style);
            // Hide fullscreen block
            $("#fullscreen_container").hide();
            // Move elements to normal location
            // -- Graph
            $("#graph_container").insertAfter("#functions");
            // -- Solution & variables
            // -- Equation
            $("#equation").insertAfter("#graph_break");
            $("#result").insertAfter("#equation");
            // // -- Variables
            // Fix styles
            style = {};
            style["margin"] = "";
            style["width"] = "";
            $("#equation").css(style);
            style = {};
            style["margin"] = "";
            style["width"] = "";
            style["height"] = "";
            style["display"] = "";
            $("#graph_container").css(style);
            // Fire resize handler
            $("#subgraph").trigger("resize");
            style = {};
            style["width"] = "";
            $("#result").removeClass("result_fullscreen");
            $("#mainEquation").addClass("equation_input");
            $("#mainEquation").removeClass("equation_input_fullscreen");
            $("#result").css(style);
            $("#solution_column").addClass("solution_column");
            $("#solution_column").removeClass("solution_column_fullscreen");
            $("#solution_column").css(style);
            $("#variables_column").addClass("variables_column");
            $("#variables_column").removeClass("variables_column_fullscreen");
            $("#variables_column").removeClass("variables_column_fullscreen_vert");
            $("#variables_column").css(style);
            // Show normal elements
            $("#container").show();
            $("#footer").show();
            $("#beta_box").show();
            // Fire resize handler
            $("#subgraph").trigger("resize");
            resizeBars();
        }
        toggling = false;
    }
}

$(window).resize(function() {
    if(fullscreen_active && !toggling)
    {
        toggling = true;
        resizeFullscreen();
        toggling = false;
    }
    resizeBars();
});

// toggleGrid turns the graph grid on and off
function toggleGrid() {
    verifyGraph();
    graph.toggle_Grid();    
}

// extend the jquery function with an animate highlight function
$.fn.animateHighlight = function(highlightColor, duration) {
    var highlightBg = highlightColor || "#FFFF9C";
    var animateMs = duration || 1500;
    var originalBg = this.css("backgroundColor");
    this.stop().css("background-color", highlightBg).animate({backgroundColor: originalBg}, animateMs);
};

// visualErrorFunction is a function called whenever something
// can go sour.  it shakes the equation box
function visualErrorFunction() {
    $('#equation').effect('shake', { times:5 }, 100);
    $('#equation').animateHighlight("#dd0000", 1000);
}

// resizeBars dynamically changes css depending on screen size
// for the function input and function bars
// this resolves any issues on netbooks
function resizeBars() {
    
    var windowWidth = $(window).width();
    if (windowWidth<=1090){
        $("#equation").css("width","768px"); 
        $("div.fxn_row").css("width","770px"); 
    }
    else {
        $("#equation").css("width","898px"); 
        $("div.fxn_row").css("width","900px");         
    }
}

/* From page */
function clearAndParse()
{
    clearAndParseEquation(this, document.getElementById('mainEquation').value);
}
function clearAndParseMultiple()
{
    clearAndParseMultipleEquations();
}
function solve()
{
    solveEquation(this);
}
function solveMult()
{
    solveEqInMult();
}
function toggleInclude(toggleID)
{
    toggleDraw(toggleID);
}
function addFunction() {
    var fxn = $('#mainEquation').val(),
        name = $('#equationName').val();
        name = sanitizeFunctionName(name);
        
    // parse the equation
    var parsed;
    try
    {
        parsed = QGSolver.parse(fxn);
    }
    catch(exception)
    {
        visualErrorFunction();         
    }
    
    updateFunction(name, fxn, parsed)
}

function updateFunction(sanitizedName, fxnString, parsedEquation) {
    // Verify row exists
    var row = createFunctionRow(sanitizedName, fxnString, parsedEquation);
    // Solve equation in row
    solveEquation(row, parsedEquation);
    // correctly size bar elements
    resizeBars();
}


$(document).ready(function() {
    // Turn on debug
    //QGSolver.DEBUG = true;
    QGSolver.DEBUG = false;
    // enable random load
    
    // Turn on Test Generation
    QGSolver.TESTGENERATION = false;
    
    // Load examples
    loadExamples();
    // Load functions
    loadFunctions();
    // Load From TitleBar
    loadTitleBarHash();
    
    // correctly size bar elements
    resizeBars();
    
    
    // Add key listeners
    $("#equationName").keyup(function(event){
        if(event.keyCode == 13){
            var eq = $("#mainEquation");
            if(eq.val().length == 0)
            {
                eq.focus();
            }
            else
            {
                $("#graphBtn").click();
            }
        }
    });
    $("#mainEquation").keyup(function(event){
        if(event.keyCode == 13){
            var name = $("#equationName");
            if(name.val().length == 0)
            {
                name.focus();
            }
            else
            {
                $("#graphBtn").click();
            }
        }
    });
});
