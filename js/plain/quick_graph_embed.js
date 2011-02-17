

function updateSolution(equation, context, solution)
{
    document.getElementById("formula").innerText = equation.toString(context);
    document.getElementById("solution").innerText = solution;
    document.getElementById("function_name").innerText = $("#equationName").val();
    
    var v, vars = equation.variables(),
        varLen = vars.length,
        varList = "";
    for(var i = 0; i < varLen; i++)
    {
        v = vars[i];
        varList += "<font id='" + v + "_param'>";
        varList += context[v];
        varList += "</font>";
        if(i != varLen - 1)
        {
            varList += ", ";
        }
    }
    document.getElementById("variable_list").innerHTML = varList;
    $("#result").show();
    // Clear display property to fix stupid jQuery bug
    $("#result").css({display: ""});
}


function createContext(vars)
{
    var context = new Context(vars),
        varLen = vars.length,
        v, slider, val, step;
        
    for(var i = 0; i < varLen; i++)
    {
        v = vars[i];
        step = parseFloat($("#" + v + "_step").val());
        slider = $("#" + v + "_slider_value");//$("#" + v + "_slider");
        val = parseInput(slider.text(),step);
        context.set(v, val);
    }
    
    return context;
}


function solveEquation()
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
          alert("Solve failed: " + exception);
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
          updateSolution(parsedEquation, context.toObj(), solution);
          // update all graphs
          updateAllGraphs(parsedEquation, context);
          
      }
        // generate a hash
        generateHashURL(parsedEquation.variables(),0);
    
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
          alert("Solve failed: " + exception);
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

/* clear the screen and parse the equation */
function clearAndParseEquation(equation)
{
    if(typeof equation != "undefined")
    {
        // clear the screen
        clearScreen();
        // parse the equation
        parsedEquation = QGSolver.parse(equation);
        // Create sliders
        createSliders(parsedEquation.variables());
        // Solve equation
        solveEquation();
    }
    else
    {
        alert("Please enter a formula");
    }
}

function clearAndParseMultipleEquations()
{
    clearScreen();
    parseMultipleEquations();
}

/* clear the screen then parse later */
function parseMultipleEquations()
{
    
    // put all variables into single array
    var allVariables = [];
    
    // the base equation div name
    var eqNameBase = "mainEquation";
    
    // loop once over equations and grab all variables
    for(var i = 1;i<6;i++)
    {
        
        var eqName;
        if(i == 1)
        {
            eqName = eqNameBase;
        }
        else
        {
             eqName = eqNameBase + i.toString();
         }
        var singleEq = document.getElementById(eqName).value;
            
        if(typeof singleEq != "undefined")
        {
            // parse the equation
            parsedEquation = QGSolver.parse(singleEq);
            
            // concat the variables
            allVariables += parsedEquation.variables();
        }
        else
        {
            alert("Please enter a formula for " + eqName);
            return;
        }

    }
    
    // now that we've concatenated all variables...
    // remove duplicates
    var cleanVarArray = removeDuplicateVariables(allVariables);

    // Create slidersFunction
    createSliders(cleanVarArray);
    
    // loop second time over equations and solve top down
    for(var i = 1;i<6;i++)
    {
        var eqName;
        if(i > 1)
        {
            eqName = eqNameBase + i.toString();
        }
        else
        {
            eqName = eqNameBase;
        }
        var singleEq = document.getElementById(eqName).value;
            
        if(typeof singleEq != "undefined")
        {
            // parse the equation
            parsedEquation = QGSolver.parse(singleEq);
            // Solve equation
            solveEqInMult();
        }
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
    solveEquation();
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
    var URL = "www.quickgrapher.com/index.html?";
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
    
    // add equation(s) to url
    if(multi == 1)
    {
        // the base equation div name
        var eqNameBase = "#mainEquation";
    
        // loop once over equations and grab all variables
        for(var i = 1;i<6;i++)
        {
            var eqName;
            if(i == 1)
            {
                eqName = eqNameBase;
            }
            else
            {
                eqName = eqNameBase + i.toString();
            }        
            
            var localEquation = $(eqName).val();
            if(typeof localEquation != "undefined")
            {
                URL += compressName(localEquation);
            }
            URL += ";"
        
        }
        URL += "=";
    }
    else
    {
        var localEquation = $("#mainEquation").val();
        if(typeof localEquation != "undefined")
        {
            URL += compressName(localEquation) + "=";
        }       
    }
    
    // variables to store hash values
    var delimiter = ":",
        minString = "",
        maxString = "",
        stepString = "",
        lastString = "",
        visString = "";
    
    
    // Loop over variables
    var name = "",
        v, varLen = vars.length,
        step, minVal, maxVal, last;
        
    for(var i = 0; i < varLen; i++)
    {
        // Current variable
        v = vars[i];
        
        // get current variable's values
        lastVal = parseFloat($("#" + v + "_slider").val()),
        minVal = parseFloat($("#" + v + "_min").val()),
        stepVal = parseFloat($("#" + v + "_step").val()),
        maxVal = parseFloat($("#" + v + "_max").val());
        var visVal;
        
        if($("#" + v + "_graph_checkbox").is(":checked"))
        {
            visVal = 1;
        }        
        else
        {
            visVal = 0;
        }
        
        // add current values to correct hash strings
        minString = minString + minVal + delimiter;
        maxString = maxString + maxVal + delimiter;
        stepString = stepString + stepVal + delimiter;
        lastString = lastString + lastVal + delimiter;
        visString = visString + visVal + delimiter;
    }    
    
    // replace spaces with %20 for web addresses
    var graphName =  $("#equationName").val();
    cleanGraphName = graphName.replace(/\s/g,"%20");
    
    // clean up the plusses in URL for email clients
    URL = URL.replace(/\+/g,"'%");
    
    // add the fully constituted strings to URL
    URL += minString + "{" + maxString + "}" + stepString + "[" + lastString + ";" + visString + "=" + cleanGraphName + "]";
    
    // sneak the url into the instructions block    
    $("#instruct").attr("href", URL);
    updateShare(URL,graphName);
    
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

// updates graphs for all variables
function updateAllGraphs(equation, context, embeddedGraph, graphNumber,graphTitle)
{
    var graph,
    // Retrieve variables
        v, vars = equation.variables(),
        varLen = vars.length;
        
    var graphID = "subgraph" + graphNumber.toString();
    // Check if we already have a graph element
    graph = $("#" + graphID);
    if(graph.length == 0)
    {
        // Create graph element
        var parentElement = embeddedGraph;
        graph = document.createElement("div");
        graph.id = graphID;
        graph.style.position = "relative";
        graph.style.width = "100%";
        graph.style.height = "100%";
        // Add to canvas
        parentElement.append(graph);
        
        // Register with Graph
        var graphName = graphTitle;
        graph = $(graph);
        var opts = {name: graphName};
        opts['hue-increment'] = 45;
        opts['hue-base'] = 22;
        opts['value-base'] = 95;
        opts['title'] = graphTitle + " ( " + vars.join(", ") +" )";
        graph.graphify(opts)/*.attach_legend({
          'legend-mode': false,
          'legend-container': $("#legend"),
        })*/.realHover({
            hover: Graph.highlightNearest,
            out: Graph.removeHighlight
        });
        
        // Set variable colors from plot
        //var color;
        //for(var i = 0; i < varLen; i++)
        //{
        //    v = vars[i];
        //    color = $("#subgraph").color(v);
        //    if(typeof color == "undefined")
        //    {
        //        color = "rgb(0,0,0)";
         //   }
            
        //    $("#" + v + "_slider_value").css({color: color});
        //}
    }
    else
    {
        // Update graph title
        graph.graph_option("title",graphTitle + " ( " + vars.join(", ") +" )");
    }
 
    /// Loop over variable
    var name = "",
        localContext = context.toObj(),
        step, min, max;
        
    for(var i = 0; i < varLen; i++)
    {
        // Current variable
        v = vars[i];

        // Adjust context
        var fixedPt = localContext[v],
            min = 1,
            step = 1,
            max = 100,
            steps = ((max - min)/step) + 1;
        // Substitute iterator
        localContext[v] = new VariableIterator(min,step);
        // Create graph
        updateSingleGraph(graphID, v, equation, localContext, steps);
        // Replace values into local context for next loop step
        localContext[v] = fixedPt;

        //if(!$("#" + v + "_graph_checkbox").is(":checked"))
        //{
         //   // Make sure we have cleared the data for this variable
        //    graph.hide_data(v);
       // }
   }
}


// updates a single graph
function updateSingleGraph(graphID, graphVariable, equation, context, steps)
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
    //var color = $("#subgraph").color(lbl);
    //if(typeof color == "undefined")
    //{
    //    color = "rgb(0,0,0)";
    //}
    
    //$("#" + lbl + "_variable_name").css({"color": color});
   // $("#" + lbl + "_slider_value").css({color: color});
    //cs = {color: color};
    //cs["font-weight"] = "bold";
    //$("#" + lbl + "_param").css(cs);
}


function compressName(name)
{
    // Remove spaces
    var compressed = name.replace(/\s/g,"");
    return compressed;
}


// set all context variables to correct variables
function createTestContext(vars,varContext) {
    var context = new Context(vars),
        varLen = vars.length,
        v, slider, val, step;
        
    // split the varContext by commas
    var ourValues = varContext.split(",");    
        
    for(var i = 0; i < varLen; i++)
    {
        v = vars[i];
        if(typeof ourValues[i] != "undefined")
        {
            context.set(v, ourValues[i]);
        }
        else
        {
            context.set(v, 1);
        }
        
    }
    
    return context;
}


// updateGraph appends an html5 canvas element at the embeddedGraph
// element position for the equation and varValues passed in
function updateGraph(equation, varValues, embeddedGraph, graphNumber)
{
    // we should technically allow to graph graphs without 
    // any values being passed in
    if(typeof varValues == "undefined")
    {
        varValues = "";
    }
    
    // parse our equation with a QGSolver
    var parsedEquation = QGSolver.parse(equation);
    
    // find all variables for parsed equation
    var vars = parsedEquation.variables();
    
    // create a context from the passed in values
    var context = createTestContext(vars,varValues);
    
    updateAllGraphs(parsedEquation, context, embeddedGraph, graphNumber,"Untitled Graph");
    
}

function graphSingleElement(embeddedGraph, graphNumber)
{
    var attributeBaseName = "equation";
    var valueBaseName = "values";
    var continueGraphingSingleElement = 1;
    var attributeCount = 0;
    
    while(continueGraphingSingleElement == 1)
    {
        var fullAttributeName = attributeBaseName;
        var fullValueName = valueBaseName;
        
        // we allow equation or equation1, so loop
        // zero tests for equation, 1 for eq1 and so on
        if(attributeCount > 0)
        {
            fullAttributeName +=  attributeCount.toString();
            fullValueName += attributeCount.toString();
        }
        
        // grab the equation attribute
        var localEq = embeddedGraph.getAttribute(fullAttributeName);

        if(typeof localEq == "string")
        {
            // grab the values attribute
            var localValues = embeddedGraph.getAttribute(fullValueName);
            
            // update the graph
            updateGraph(localEq, localValues, embeddedGraph, graphNumber);
        }
        else
        {
            // if we've gone past eq or eq1 and are on eq2
            // and it's blank, don't look for an eq3
            if(attributeCount > 1)
            {
                continueGraphingSingleElement = 0;
            }
        }
        
        // increment our attribute count
        attributeCount++;
    }
}

function replaceGraphTagsWithGraphs()
{
    var allGraphs = $("graph");
    var allGraphsLen = allGraphs.length;
    
    for(var i = 0;i<allGraphsLen;i++)
    {
        graphSingleElement($("graph")[i],i);
    }
    
}
 

$(document).ready(function() {
    // Turn on debug
    //QGSolver.DEBUG = true;
    QGSolver.DEBUG = false;
    // enable random load
    
    // Turn on Test Generation
    QGSolver.TESTGENERATION = false;
    
    // replace all graph tags
    replaceGraphTagsWithGraphs();
    
    // Load examples
    //loadExamples();
    // Load functions
    //loadFunctions();
    // Load From TitleBar
    //loadTitleBarHash();
    
    // Add key listeners
    //$("#equationName").keyup(function(event){
      //  if(event.keyCode == 13){
        //    var eq = $("#mainEquation");
          //  if(eq.val().length == 0)
            //{
   //             eq.focus();
     //       }
       //     else
         //   {
           //     $("#graphBtn").click();
 //           }
   //     }
    //});
//    $("#mainEquation").keyup(function(event){
  //      if(event.keyCode == 13){
     //       var name = $("#equationName");
       //     if(name.val().length == 0)
         //   {
           //     name.focus();
            //}
   //         else
     //       {
       //         $("#graphBtn").click();
         //   }
      //  }
    //});
});
