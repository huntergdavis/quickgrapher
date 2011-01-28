/* OUR ONLY GLOBALS ARE DECLARED
 HERE- array of variable names to legend info, array of variable names to values graphial graph*/
// var arrayLegendHash = new Array();
// var arrayValueHash = new Array();
// var colorArray = [];
// var variableFound = 0;
var parsedEquation = undefined;

// I put the passed in values into separate arrays
// we should move them to objects
// if we need them after the initial parse 
var variableMinHash = new Array();
var variableMaxHash = new Array();
var variableStepHash = new Array();
var variableLastHash = new Array();
var variableVisHash = new Array();
//var graphName = "Unnamed Graph";

/* LoadTitleBarHash loads in passed-in title bar equation */
function loadTitleBarHash() {
    
    /* find the locations of */
	var addressBar = window.location.href;
    var equationStart = addressBar.indexOf("?")+1;
    var equationEnd = addressBar.indexOf("=");
	var varsStart = equationEnd + 1;
	var varsStop = addressBar.indexOf("]");
    var equationString = "";                   
	var equationValid = 0;     
    
    /* ensure we've got an equation to parse*/
    if(equationStart < 1)
    {
        return;
    }
    
    /* assume the equation is the entire bar if no other hash material
     * (for people hotlinking or apis to work later) */
    if(equationEnd < 1)
    {
        equationEnd = addressBar.length;
    }
    
    /* Pull out our equation and set to be valid*/
    equationString = addressBar.substring(equationStart,equationEnd);
    equationValid = 1;
    
    /* if we have variable hashes passed in, deal with them */
	if(varsStart > 1)
	{
        var variableString = addressBar.substring(varsStart,varsStop);
		var minStart = 0;
		var minStop  = variableString.indexOf("{");
		var maxStart = minStop + 1;
		var maxStop  = variableString.indexOf("}");
		var stepStart = maxStop + 1;
		var stepStop = variableString.indexOf("[");
        var lastStart = stepStop + 1;
        var lastStop = variableString.indexOf(";");
        var visStart = lastStop + 1;
        var visStop = variableString.indexOf("=");
        var nameStart = visStop + 1;
        var nameStop = variableString.length;
        
		/* grab the minimum address*/
		var parseBlock = variableString.substring(minStart,minStop);
        parseAndAddToHash(parseBlock,":",variableMinHash);

        /* grab the maximum address*/
        parseBlock = variableString.substring(maxStart,maxStop);
        parseAndAddToHash(parseBlock,":",variableMaxHash);

        /* grab the step address*/
        parseBlock = variableString.substring(stepStart,stepStop);
        parseAndAddToHash(parseBlock,":",variableStepHash);
        
         /* grab the last address*/
        parseBlock = variableString.substring(lastStart,lastStop);
        parseAndAddToHash(parseBlock,":",variableLastHash);

         /* grab the visibility*/
        parseBlock = variableString.substring(visStart,visStop);
        parseAndAddToHash(parseBlock,":",variableVisHash);
        
        /* grab the name*/
        var tempName = variableString.substring(nameStart,nameStop);
        tempName = tempName.replace(/%20/g," ");
       

        
	} 	
	if(equationValid > 0)
	{
	    $("#mainEquation").val(equationString);
        $("#equationName").val(tempName);
        $("#graphBtn").click();
	}
}

/* function parseAndAddToHash parses a string at delimeter and adds to a hash*/
function parseAndAddToHash(stringToParse,delimiter,hashToGrow) {
    
        /* should we continue parsing? */
        var stillParsing = 1;
        
        /* local variable for splitting */
        var parseBlock = stringToParse
        
        /* loop through a string and split at indicies */
    	while(stillParsing == 1) {
            
            /* break down the string and go to next delimiter*/
		    var nextDelimiter = parseBlock.indexOf(delimiter);
		    if(nextDelimiter > -1) {
		        var hashValue = parseBlock.substring(0,nextDelimiter);
		        parseBlock = parseBlock.substring(nextDelimiter+1,parseBlock.length);
		        hashToGrow.push(hashValue);
	            } 
                    else {
		        stillParsing = 0;
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
    
    // var sliderSubLabel = document.getElementById("sub" + sliderId);
    // sliderSubLabel.innerHTML=sliderValue;
    // 
    // /* Here we set the value hash with the value */
    // arrayValueHash[sliderId[sliderId.length-1]] = sliderValue;
    // 
    // solveEquation(document.getElementById('mainEquation').value);
    // 
    // /* Also update the graph */
    // if(document.checkboxform.updategraphcheckbox.checked==false) {
    //     return;
    // } else {
    //     updateAllGraphs();
    // }

    //document.getElementById(sliderId).nextSibling.innerHTML=sliderValue;
}

function renameSlider(sliderName) {
    var sliderNewName = prompt("Enter a new variable name","nonameslider");
    var sliderSubLabel = document.getElementById("slider" + sliderName);
    delete arrayLegendHash[sliderName];

    /* Set our hash key value for this variable, or add a new one if not exist */
    var sliderVar = sliderName[sliderName.length-1];
    arrayLegendHash[sliderVar] = sliderNewName;

    var newLabel = "(" + sliderName[sliderName.length-1] + ") " + sliderNewName;

    sliderSubLabel.innerHTML=newLabel;

    solveEquation(document.getElementById('mainEquation').value);

    /* Also update the graph */
    if(document.checkboxform.updategraphcheckbox.checked==false) {
        updateGraph(sliderName);
    } else {
        updateAllGraphs();
    }

}


/* moreSliders copies the invisible div slider element "slidertemplate" into a sibling div named sliderOutputX where
 X=numSliders */
function moreSliders(varName, varTitle) {

    /* Here we set the value hash with the value */
    if(!arrayValueHash[varName]) {
        arrayValueHash[varName] = 0;
    }

    /* clone the slider template but not its style*/
    var newSliders = document.getElementById('slidertemplate').cloneNode(true);
    newSliders.id = '';
    newSliders.style.display = 'block';

    /* loop over all child nodes of slider and name them uniquely sliderID(alpha) */
    var sliderSubLabel = null;
    var newSlider = newSliders.childNodes;
    for (var i=0;i<newSlider.length;i++) {
        var sliderOutputName = newSlider[i].id;
        /* if the slider id is a range type, name the container div as the same */
        if (sliderOutputName) {
            if(newSlider[i].type == "range") {
                newSliders.id = "sliderID" + varName;
                newSlider[i].name = "clonedSlider";
                newSlider[i].value = arrayValueHash[varName];
                sliderSubLabelName = "sub" + sliderOutputName + varName;
            }
            newSlider[i].id = sliderOutputName + varName;
        }
    }

    /* find the slider template and insert the correct slider behind it  */
    var insertHere = document.getElementById('slidertemplate');
    insertHere.parentNode.insertBefore(newSliders,insertHere);

    /* Also adds a nice label to the text field */
    var sliderTitle = document.getElementById("sliderTitle" + varName)
    /* If we've got a hashed title for this value, display it */
    var hashLabelValue = arrayLegendHash[varName];
    if(hashLabelValue) {
        sliderTitle.innerHTML= "(" + varName + ") " + hashLabelValue;
    } else {
        sliderTitle.innerHTML= "(" + varName + ") " + varTitle;
    }

    // and also set our slider innerHTML value
    sliderSubLabel = document.getElementById(sliderSubLabelName);
    sliderSubLabel.innerHTML=arrayValueHash[varName];

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
    
}

function parseInput(input, step)
{
    var val = parseFloat(input),
        prec = val / step,
        str = prec + "",
        decimal,
        rounded = Math.round(parseFloat(str)),
        result = input;
        
    if(step < 1)
    {
        str = rounded + "";
        decimal = str.indexOf(".");
        
        
        if(decimal != -1)
        {
            //rounded = parseInt(str.substring(0,decimal));
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

// function colorText(text, color)
// {
//     var result = text;
//     if(typeof color != undefined)
//     {
//         result = "<font style='color: "++"'>";
//         result += color;
//         result += "</font>";
//     }
//     return result;
// }

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
        //varList += v;
        //varList += "=";
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
}

function createContext(vars) {
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
      if(QGSolver.DEBUG)
      {
        console.log("Context: " + context.toString());
      }
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
        generateHashURL(parsedEquation.variables());
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
        createSliders2(parsedEquation.variables());
        // Solve equation
        solveEquation();
    }
    else
    {
        alert("Please enter a formula");
    }
}

function toggleDraw(toggleID)
{
    // var toggled = $("#" + toggleID).is(":checked");
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
function generateHashURL(vars)
{
    //var URL = "www.quickgrapher.com/index.html?";
    var URL = "http://www.quickgrapher.com/index.html?";
    
    // add equation to url
    var localEquation = $("#mainEquation").val();
    if(typeof localEquation != "undefined")
    {
        URL = URL + compressName(localEquation) + "=";
    }
    
    // variables to store hash values
    var delimiter = ":";
    var minString = "";
    var maxString = "";
    var stepString = "";
    var lastString = "";
    var visString = "";
    
    
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
    var cleanedGraphName = graphName.replace(/\s/g,"%20");
    
    // add the fully constituted strings to URL
    URL = URL + minString + "{" + maxString + "}" + stepString + "[" + lastString + ";" + visString + "=" + cleanedGraphName + "]";

    // put the URL as our new url
    //console.log(URL);
    
    // sneak the url into the instructions block    
    $("#instruct").attr("href", URL);
}

/*
 * 
 * <tr class="variable">
      <td rowspan="2"><input type="checkbox" class="show_select" onclick="solve()"/></td>
      <td rowspan="2"><div style="vertical-align: top;">x = 6</div></td>
      <td class="minimum"><input type="text" class="range_input" size="10" value="0"/></td>
      <td class="step"><input type="text" class="range_input" size="10" value="1"/></td>
      <td class="maximum"><input type="text" class="range_input" size="10" value="100"/></td>
    </tr>
    <tr class="variable">
      <td colspan="3" class="range">
        <input type="range" id="rangesliderID" min="0" max="100" value="0" step="1" onchange="showValue(this.value, this.id)" style="margin-left: 22px;width: 184px;"/>
      </td>
    </tr>
 * 
 * 
*/

function createSliders2(vars)
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
        el = document.createElement("td");
        el.setAttribute("rowspan","2");
        el = $(el);
        
        inp = document.createElement("input");
        inp.setAttribute("class","show_select");
        inp.id = v + "_graph_checkbox";
        inp.setAttribute("type", "checkbox");
        inp.setAttribute("onclick", "toggleInclude(this.id)");
        if(visValue == 1)
        {
            inp.setAttribute("checked", "checked");
        }
        el.append(inp);
        first.append(el);
        
        // Variable name and value
        el = document.createElement("td");
        el.setAttribute("rowspan","2");
        el = $(el);
        inp = document.createElement("div");
        inp.innerHTML = v + "<font style='font-size: 7pt; margin-left: 3px;'> = </font>";
        inp.id = v + "_variable_name";
        el.append(inp);
        inp = $(inp);
        var cs = {
          width:"100%",
          // Need to load this from graph
          color:"rgb" + "(0,0,0)"
        };
        cs["float"] = "left";
        cs["font-size"] = "13pt";
        inp.css(cs);
        inp = document.createElement("div");
        inp.setAttribute("class","variable_value");
        inp.innerHTML = lastValue;
        inp.id = v + "_slider_value";
        el.append(inp);
        inp = $(inp);
        cs = {};
        cs["float"] = "left";
        cs["font-weight"]="bold";
        cs["font-size"]="20pt";
        cs["margin-left"]="20px";
        inp.css(cs);
        first.append(el);
        
        el = document.createElement("td");
        el.setAttribute("class","minimum");
        el = $(el);
        // <input type="text" class="range_input" size="10" value="0"/>
        inp = document.createElement("input");
        inp.setAttribute("id", v + "_min");
        inp.setAttribute("type", "text");
        inp.setAttribute("class", "range_input");
        inp.setAttribute("size", "10");
        inp.setAttribute("value", minValue);
        inp.setAttribute("onchange", "updateMinimum(this.id)");
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
        inp.setAttribute("min", variableMinHash[i]);
        inp.setAttribute("max", variableMaxHash[i]);
        inp.setAttribute("step", variableStepHash[i]);
        inp.setAttribute("value", lastValue);
        el.append(inp);
        first.append(el);
        inp = $(inp);
        // Set initial value
        inp.val(lastValue);
        // Add change listener
        inp[0].setAttribute("onchange", "showValue(this.value, this.id)");
    }
    
    // Show legend title
    //$("#legendTitle").show();
}

// updates graphs for all variables
function updateAllGraphs(equation, context)
{
    var unifiedGraph = true,
        graph;
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
            graph.style.width = "100%";//parentElement.width() + "px";
            graph.style.height = "100%";//parentElement.height() + "px";
            // Add to canvas
            parentElement.append(graph);
            // Register with Graph
            var graphName = $("#equationName").val();
            graph = $(graph);
            var opts = {name: graphName};
            opts['hue-increment'] = 35;
            opts['hue-base'] = 0;
            opts['value-base'] = 75;
            graph.graphify(opts)/*.attach_legend({
              'legend-mode': false,
              'legend-container': $("#legend"),
            })*/.realHover({
                hover: Graph.highlightNearest,
                out: Graph.removeHighlight
            });
            
            // Set variable colors from plot
            var color,
                v, vars = equation.variables(),
                varLen = vars.length;
            for(var i = 0; i < varLen; i++)
            {
                v = vars[i];
                color = $("#subgraph").color(v);
                if(typeof color == "undefined")
                {
                    color = "rgb(0,0,0)";
                }
                
                //$("#" + v + "_variable_name").css({"color": color});
                $("#" + v + "_slider_value").css({color: color});
            }
        }
    }
 
    /// Loop over variable
    var name = "",
        v, vars = equation.variables(), varLen = vars.length,
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
            //name = "Title" + varName;
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
            //graph.remove_data(v);
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
            if(QGSolver.DEBUG)
            {
                console.log("Solve Error: [var: "+graphVariable+", value: "+currVarValue+"] " + error);
            }
        }
        // Only add the point if it is a valid solution
        if((typeof solution != "undefined") && isFinite(solution))
        {
            data.push([currVarValue, solution]);
        }
        
        // Step variable
        context[graphVariable].step();
    }
    
    var lbl = "",//"Fxn ( ",
        v, vars = equation.variables(),
        varLen = vars.length;
    // for(var i = 0; i < varLen; i++)
    // {
    //     v = vars[i];
    //     if(v == graphVariable)
    //     {
    //         lbl += v;
    //     }
    //     else
    //     {
    //         lbl += context[v];
    //     }
    //     if(i != varLen - 1)
    //     {
    //         lbl += ",";
    //     }
    // }
    lbl += graphVariable;
    // if( varLen > 1)
    // {
    //     lbl += ", ..."
    // }
    // lbl += " )";
    
    // Add plot for this variable (will overwrite existing ones)
    var cs = {label : lbl};
    cs['plot-type'] = 'line';
    graph.plot(
        graphVariable,
        data,
        cs
    );
    
    // Set variable colors from plot
    var color;
    // for(var i = 0; i < varLen; i++)
    // {
        //v = vars[i];
        color = $("#subgraph").color(lbl);
        if(typeof color == "undefined")
        {
            color = "rgb(0,0,0)";
        }
        
        //$("#" + lbl + "_variable_name").css({"color": color});
        $("#" + lbl + "_slider_value").css({color: color});
        cs = {color: color};
        cs["font-weight"] = "bold";
        $("#" + lbl + "_param").css(cs);
    // }
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
        //fxn = functions[fxnName];
        margins = "margin-top: ";
        col = Math.floor(row/colSize);
        var top = 0;
        if(row > 0 && row % colSize == 0)
        {
            top = -15 * colSize;
        }
        
        margins += top + "px;";
        margins += " margin-left: " + (col * colWidth) + "px;";
        // If last row
        var next = row + 1;
        if(next == fxnCount && next % colSize != 0)
        {
            margins += " margin-bottom: " +  (15 * (colSize - (next%colSize))) + "px;";
        }
        createFunctionLink(fxnName, margins, list);
        row++;
    }
}

function insertFunction(linkID)
{
    // 
  
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

function createFunctionLink(fxnStr, style, parent)
{
    var ex = document.createElement("li");
    
    ex.setAttribute("id","fxn_" + fxnStr);
    //ex.setAttribute("class","column" + col);
    ex.setAttribute("onclick","insertFunction(this.id)");
    ex.setAttribute("style",style);
    
    // Text to add
    ex.innerHTML = fxnStr;
    
    parent.append(ex);
}

function createExampleLink(example, parent)
{
    var ex = document.createElement("li"),
        inner = "<a href='http://www.quickgrapher.com/index.html?";
    inner += compressName(example.url);
    inner += "'>"
    inner += example.name;
    inner += "</a>";
    ex.innerHTML = inner;
    ex.setAttribute("id","example_" + compressName(example.name));
    //example.setAttribute("onclick","loadExample(this.id)");
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

/* From page */
function clearAndParse()
{
    clearAndParseEquation(document.getElementById('mainEquation').value);
}
function solve()
{
    solveEquation();
}
function toggleInclude(toggleID)
{
    toggleDraw(toggleID);
}
$(document).ready(function() {
    // Load examples
    loadExamples();
    // Load functions
    loadFunctions();
    // Load From TitleBar
    loadTitleBarHash();
});
