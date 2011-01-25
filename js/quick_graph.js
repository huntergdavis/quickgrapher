/* OUR ONLY GLOBALS ARE DECLARED
 HERE- array of variable names to legend info, array of variable names to values graphial graph*/
// var arrayLegendHash = new Array();
// var arrayValueHash = new Array();
// var colorArray = [];
// var variableFound = 0;
var parsedEquation = undefined;

/* loadSaved uses the passed variables from the address bar to set equations and
 hashes */
function loadSaved() {
    var args = arguments;
    var loadString = "";
    if (args.length > 0) {
        loadString = args[0];
    } else {
        loadString= String(document.getElementById("savebar").value);
    }

    if(loadString.length < 3) {
        alert("Could Not Load Saved Function from Hash");
    } else {

        /* Clear the
         Screen */
        clearScreen();
        /* Set our Equation */
        var equationStart = loadString.indexOf("?&$")+3;
        if(loadString.indexOf("?&$") > -1) {
            var equationEnd = loadString.indexOf("&#");
            var equation = loadString.substring(equationStart,equationEnd);
            equation=equation.replace(/%20/g," ");
            equation=equation.replace(/%25/g,"%");
            equation=equation.replace(/%28/g,"(");
            equation=equation.replace(/%29/g,")");
            document.getElementById('mainEquation').value = equation;
        }
    }

    /* Set our Titles */
    var titleHashStart = loadString.indexOf("&#")+2;
    var titleHashEnd = loadString.indexOf("&%");
    if(loadString.indexOf("&#") > 0) {
        var TitleHash = loadString.substring(titleHashStart,titleHashEnd);
        TitleHash=TitleHash.replace(/%20/g," ");
        addTitlesToHash(TitleHash);
    }

    /* Set our Values */
    var valueHashStart = loadString.indexOf("&%")+2;
    var valueHashEnd = loadString.indexOf("&*");
    if(loadString.indexOf("&%") > 0) {
        var ValueHash = loadString.substring(valueHashStart,valueHashEnd);
        ValueHash=ValueHash.replace(/%20/g," ");
        addValuesToHash(ValueHash);
    }

    // do an initial parse
    parseEquation();
    // update all graphs
    updateAllGraphs();
}

// adds array legend titles to global hash
function addTitlesToHash(titles) {
    var nextDelimiter = 0;
    var stillParsing = 1;
    var parseBlock = titles;

    /* Loop through all
     values in title bar and add them to hash table reference for names */
    while(stillParsing == 1) {
        nextDelimiter = parseBlock.indexOf("&:");
        if(nextDelimiter > -1) {
            stopDelimiter = parseBlock.indexOf("&,");
            var myVar = parseBlock.substring(0,nextDelimiter);
            var myLabel = parseBlock.substring(nextDelimiter+2,stopDelimiter);
            parseBlock = parseBlock.substring(stopDelimiter+2,parseBlock.length);
            arrayLegendHash[myVar] = myLabel;

        } else {
            stillParsing = 0;
        }
    }
    // x&:testme&;&,K&:hello&;&,y&:whats up&;&%
}

// adds array variable values to global hash
function addValuesToHash(titles) {
    var nextDelimiter = 0;
    var stillParsing = 1;
    var parseBlock = titles;

    /* Loop through all
     values in title bar and add them to hash table reference for names */
    while(stillParsing == 1) {
        nextDelimiter = parseBlock.indexOf("&:");
        if(nextDelimiter > -1) {
            stopDelimiter = parseBlock.indexOf("&,");
            var myVar = parseBlock.substring(0,nextDelimiter);
            var myLabel = parseBlock.substring(nextDelimiter+2,stopDelimiter);
            parseBlock = parseBlock.substring(stopDelimiter+2,parseBlock.length);
            arrayValueHash[myVar] = myLabel;

        } else {
            stillParsing = 0;
        }
    }
    // x&:testme&;&,K&:hello&;&,y&:whats up&;&%
}

/* showValue changes the sibling span text of a slider to be its value and recalculates the equation*/
/* The overall formula based on the
 change in this variable */
function showValue(sliderValue, sliderId)
{
    var v = sliderId.substring(0,sliderId.indexOf("_")),
        sliderLabel = $("#" + v + "_slider_value"),
        dynamicUpdate = $("#dynamic_update");
    sliderLabel.empty();
    sliderLabel.append(sliderValue);
    
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

/* stringify hash turns the main arrayLegendHash into a string and returns it */
/* the returned string is exactly what
 hash.concat({key: 'value', key2: 'value'}) is looking for */
function stringifyHash() {
    var returnString = "";
    var keys = arrayValueHash;
    for(var i in keys) {
        returnString += i + "&:" +  arrayLegendHash[i];
        returnString += "&,"
    }
    returnString += "";
    return returnString;
}

/* stringify values hash turns the main arrayValueHash into a string and returns it */
/* the returned string is exactly what
 hash.concat({key: 'value', key2: 'value'}) is looking for */
function stringifyValueHash() {
    var returnString = "";
    var keys = arrayValueHash;
    for(var i in keys) {
        returnString += i + "&:" +  arrayValueHash[i];
        returnString += "&,"
    }
    returnString += "";
    return returnString;
}

/* StringifyPage stringifies the hash as well as the
 equation */
function stringifyPage() {
    var stringifiedHash = stringifyHash();
    var stringifiedValuesHash = stringifyValueHash();
    var stringifiedEquation = document.getElementById('mainEquation').value;
    stringifiedEquation=stringifiedEquation.replace(/\s/g,"%20");
    var returnString = "?&$" + stringifiedEquation + "&#" + stringifiedHash + "&%" + stringifiedValuesHash + "&*";
    document.getElementById("savebar").value = returnString;
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
    
    // Clear sliders
    $("tr.variable").empty();
    $("tr.variable").remove();
    
    // Clear variables
    $("#variable_list").empty();
}

// sin = ú
// cos = ù
// tan = _
// asin = Ǵ
// acos = ǵ
// atan = #
// sum = :
// medium = ;
// min = ÿ
// max = þ
// less = ý
// greater = ü
// euler = û
// factorial = ø
// natlogten = ÷
// natlog = ö
// pi = õ
// logtene = ô
// logtwoe = ó
// abs = ò
// ceil = ñë
// exp = ð
// floor = ï
// log = î
// random = í
// round = ì
// sqrt = ë
// fibonacci = ê
// nextprime = é
// replace all known functions with pipeesque characters
// store these pipe characters incrementally in the functions array
function storeAndReplaceFunctions(equation) {
    var sanitizedEquation = equation;

    sanitizedEquation = sanitizedEquation.replace( new RegExp( "nextprime", "gi" ), "é" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "fibonacci", "gi" ), "ê" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "pi", "gi" ), "õ" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "logtene", "gi" ), "ô" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "logtwoe", "gi" ), "ó" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "natlogten", "gi" ), "÷" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "natlog", "gi" ), "ö" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "asin", "gi" ), "Ǵ" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "acos", "gi" ), "ǵ" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "atan", "gi" ), "#" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "sin", "gi" ), "ú" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "cos", "gi" ), "ù" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "tan", "gi" ), "_" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "sum", "gi" ), ":" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "medium", "gi" ), ";" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "min", "gi" ), "ÿ" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "max", "gi" ), "þ" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "less", "gi" ), "ý" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "greater", "gi" ), "ü" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "euler", "gi" ), "û" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "factorial", "gi" ), "ø" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "abs", "gi" ), "ò" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "ceil", "gi" ), "ñ" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "exp", "gi" ), "ð" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "floor", "gi" ), "ï" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "log", "gi" ), "î" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "random", "gi" ), "í" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "round", "gi" ), "ì" );
    sanitizedEquation = sanitizedEquation.replace( new RegExp( "sqrt", "gi" ), "ë" );

    return sanitizedEquation;
}

// replace all known pipette characters with function names
function replaceStoredFunctions(sanitizedEquation) {

    var restoredEquation = sanitizedEquation;

    restoredEquation = restoredEquation.replace( new RegExp( "é", "g" ), "nextprime" );
    restoredEquation = restoredEquation.replace( new RegExp( "ê", "g" ), "fibonacci" );
    restoredEquation = restoredEquation.replace( new RegExp( "ò", "g" ), "abs" );
    restoredEquation = restoredEquation.replace( new RegExp( "ñ", "g" ), "ceil" );
    restoredEquation = restoredEquation.replace( new RegExp( "ð", "g" ), "exp" );
    restoredEquation = restoredEquation.replace( new RegExp( "ï", "g" ), "floor" );
    restoredEquation = restoredEquation.replace( new RegExp( "î", "g" ), "log" );
    restoredEquation = restoredEquation.replace( new RegExp( "í", "g" ), "random" );
    restoredEquation = restoredEquation.replace( new RegExp( "ì", "g" ), "round" );
    restoredEquation = restoredEquation.replace( new RegExp( "ë", "g" ), "sqrt" );
    restoredEquation = restoredEquation.replace( new RegExp( "õ", "g" ), "pi" );
    restoredEquation = restoredEquation.replace( new RegExp( "ô", "g" ), "logtene" );
    restoredEquation = restoredEquation.replace( new RegExp( "ó", "g" ), "logtwoe" );
    restoredEquation = restoredEquation.replace( new RegExp( "÷", "g" ), "natlogten" );
    restoredEquation = restoredEquation.replace( new RegExp( "ö", "g" ), "natlog" );
    restoredEquation = restoredEquation.replace( new RegExp( "ø", "g" ), "factorial" );
    restoredEquation = restoredEquation.replace( new RegExp( "û", "g" ), "euler" );
    restoredEquation = restoredEquation.replace( new RegExp( "ü", "g" ), "greater" );
    restoredEquation = restoredEquation.replace( new RegExp( "ý", "g" ), "less" );
    restoredEquation = restoredEquation.replace( new RegExp( "þ", "g" ), "max" );
    restoredEquation = restoredEquation.replace( new RegExp( "ÿ", "g" ), "min" );
    restoredEquation = restoredEquation.replace( new RegExp( "ú", "g" ), "sin" );
    restoredEquation = restoredEquation.replace( new RegExp( "ù", "g" ), "cos" );
    restoredEquation = restoredEquation.replace( new RegExp( "_", "g" ), "tan" );
    restoredEquation = restoredEquation.replace( new RegExp( "Ǵ", "g" ), "asin" );
    restoredEquation = restoredEquation.replace( new RegExp( "ǵ", "g" ), "acos" );
    restoredEquation = restoredEquation.replace( new RegExp( "#", "g" ), "atan" );
    restoredEquation = restoredEquation.replace( new RegExp( ":", "g" ), "sum" );
    restoredEquation = restoredEquation.replace( new RegExp( ";", "g" ), "medium" );
    return restoredEquation
}

function parseInput(input, step)
{
    var val = parseFloat(input),
        prec = val / step,
        rounded = Math.round(prec),
        result = rounded * step;
        
    return result;
}

function updateSolution(equation, context, solution)
{
    document.getElementById("formula").innerText = equation.toString(context);
    document.getElementById("solution").innerText = solution;
    var v, vars = equation.variables(),
        varLen = vars.length,
        varList = "";
    for(var i = 0; i < varLen; i++)
    {
        v = vars[i];
        varList += v;
        varList += "=";
        varList += context[v];
        if(i != varLen - 1)
        {
            varList += ",";
        }
    }
    document.getElementById("variable_list").innerText = varList;
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
        slider = $("#" + v + "_slider");
        val = parseInput(slider.val(),step);
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
      console.log("Context: " + context.toString());
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

function createSliders(vars)
{
    var v, varsLen = vars.length,
        sliderParent = $("#sliders"),
        slider, sliderContainer,
        sliderLabel, sliderValue,
        graphCheck, graphCheckLabel;
    for(var i = 0; i < varsLen; i++)
    {
        v = vars[i];
        // Create slider list item
        sliderContainer = document.createElement("li");
        sliderContainer.id = v + "_container";
        sliderParent.append(sliderContainer);
        sliderContainer = $(sliderContainer);
        // Create slider entry
        sliderLabel = document.createElement("span");
        sliderLabel.setAttribute("class","sliderLabel");
        // Add to container
        sliderContainer.append(sliderLabel);
        // Put in label text
        sliderLabel = $(sliderLabel);
        sliderLabel.append(v)
        // Create slider
        // <input type="range" id="x_slider" min="0" max="100" value="0" step="1" onchange="showValue(this.value, this.id)" />
        slider = document.createElement("input");
        slider.id = v + "_slider";
        slider.setAttribute("type", "range");
        slider.setAttribute("min", "0");
        slider.setAttribute("max", "100");
        slider.setAttribute("step", "1");
        slider = $(slider);
        slider.css("margin-top","3px");
        // Add to container
        sliderContainer.append(slider);
        // Set initial value
        slider.val(1);
        // Add change listener
        slider[0].setAttribute("onchange", "showValue(this.value, this.id)");
        // Add text display
        sliderValue = document.createElement("span");
        sliderValue.id = v + "_slider_value";
        sliderValue.setAttribute("class","sliderValue");
        // Add to container
        sliderContainer.append(sliderValue);
        // Put in label text
        sliderValue = $(sliderValue);
        sliderValue.append("1");
        
        // Add graph checkbox
        graphCheck = document.createElement("input");
        graphCheck.id = v + "_graph_checkbox";
        graphCheck.setAttribute("type", "checkbox");
        graphCheck.setAttribute("onclick", "toggleInclude(this.id)");
        graphCheck.setAttribute("checked", "checked");
        // Add to container
        sliderContainer.append(graphCheck);
        
        graphCheck = $(graphCheck);
        graphCheck.css("margin","3px");
        // Graph checkbox label
        graphCheckLabel = document.createElement("span");
        graphCheckLabel.id = v + "_graph_checkbox_label";
        // Add to container
        sliderContainer.append(graphCheckLabel);
        // Put in label text
        graphCheckLabel = $(graphCheckLabel);
        graphCheckLabel.css({
            "font-size" : "9pt",
            "font-weight" : "bold"
        });
        graphCheckLabel.append("(graph)");
    }
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
        inp.setAttribute("checked", "checked");
        el.append(inp);
        first.append(el);
        
        // Variable name and value
        el = document.createElement("td");
        el.setAttribute("rowspan","2");
        el = $(el);
        inp = document.createElement("div");
        inp.innerHTML = v + " = ";
        el.append(inp);
        inp = $(inp);
        inp.css({"float":"left"});
        inp = document.createElement("div");
        inp.setAttribute("class","variable_value");
        inp.innerHTML = "1";
        inp.id = v + "_slider_value";
        el.append(inp);
        inp = $(inp);
        inp.css({"float":"left"});
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
        inp.setAttribute("value", "0");
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
        inp.setAttribute("value", "1");
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
        inp.setAttribute("value", "100");
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
        inp.setAttribute("min", "0");
        inp.setAttribute("max", "100");
        inp.setAttribute("step", "1");
        inp.setAttribute("value", "1");
        el.append(inp);
        first.append(el);
        inp = $(inp);
        // Set initial value
        inp.val(1);
        // Add change listener
        inp[0].setAttribute("onchange", "showValue(this.value, this.id)");
    }
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
            graph.style.width = parentElement.width() + "px";
            graph.style.height = parentElement.height() + "px";
            // Add to canvas
            parentElement.append(graph);
            // Register with Graph
            graph = $(graph);
            graph.graphify({'hue-increment' : 35, 'hue-base' : 0, 'value-base': 75}).attach_legend().realHover({
                hover: Graph.highlightNearest,
                out: Graph.removeHighlight
            });
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
        if($("#" + v + "_graph_checkbox").is(":checked"))
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
        else
        {
            // Make sure we have cleared the data for this variable
            graph.remove_data(v);
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
            console.log("Solve Error: [var: "+graphVariable+", value: "+currVarValue+"] " + error);
        }
        // Only add the point if it is a valid solution
        if((typeof solution != "undefined") && isFinite(solution))
        {
            data.push([currVarValue, solution]);
        }
        
        // Step variable
        context[graphVariable].step();
    }
    
    var lbl = "Fxn(",
        v, vars = equation.variables(),
        varLen = vars.length;
    for(var i = 0; i < varLen; i++)
    {
        v = vars[i];
        if(v == graphVariable)
        {
            lbl += v;
        }
        else
        {
            lbl += context[v];
        }
        if(i != varLen - 1)
        {
            lbl += ",";
        }
    }
    lbl += ")";
    
    // Add plot for this variable (will overwrite existing ones)
    graph.plot(
        graphVariable,
        data,
        {'plot-type' : 'line',
          'label' : lbl}
    );
    // var subGraphChartName = "subgraphChart" + graphVariable,
        // graphChartName = "graphChart" + graphVariable,
        // subGraphLegendName = "subgraphLegend" + graphVariable;

    // delete any old graph of this variable
    // var subGraphElement = document.getElementById(subGraphChartName);
    // if(subGraphElement != null)
    // {
    //     document.getElementById(graphChartName).removeChild(subGraphElement);
    // }
    // 
    // // variables for rgraph instance
    // var myGraphElement = document.createElement("div");
    // myGraphElement.id = subGraphChartName;
    // myGraphElement.innerHTML = "";
    // document.getElementById(graphChartName).appendChild(myGraphElement);
    // 
    // // our x and y variables for our canvas
    // var xsize = 300;
    // var ysize = 150;
    // var xpos = 20;
    // var ypos = 20;
    // 
    // // our rgraph instance canvas
    // var rGraph = Raphael(subGraphChartName,xpos,ypos,xsize,ysize);
    // 
    // /* set txt type */
    // rGraph.g.txtattr.font = "12px 'Fontin Sans', Fontin-Sans, sans-serif";
    // 
    // /* storage for singledimensional arrays of X and Y plot values and legend*/
    // var YValueOneDimension = [];
    // var XValueOneDimension = [];
    // var legendTxt = "<ul>";
    // 
    // /* for now X value range is not dynamic, upgrade this later */
    // for(var i = 0; i < 100; i++)
    // {
    //     XValueOneDimension[i] = i;
    // }
    // 
    // /* set the color array */
    // var testColor = colorArray[graphVariable];
    // if(testColor == null) {
    //     colorArray[graphVariable] = Raphael.getColor();
    // }
    // 
    // var testLabel = arrayLegendHash[graphVariable];
    // 
    // if(testLabel == null) {
    //     testLabel = "Unlabeled";
    // }
    // legendTxt += "<li><FONT COLOR=\"" + colorArray[graphVariable] + "\">" + graphVariable + "(" + testLabel + ")" + ": " +  colorArray[graphVariable] + "</FONT></li>";
    // 
    // /* for each variable, loop 100 times and find the equation solution for each loop iteration with that J var set as the value */
    // var originalVarValue = arrayValueHash[graphVariable];
    // YValueOneDimension[0] = 0;
    // var ourVal = 0;
    // for(var j=1;j<100;j++) {
    //     arrayValueHash[graphVariable] = j;
    //     ourVal = solveEquation(document.getElementById('mainEquation').value);
    //     if(document.getElementById("mainResult").innerHTML == "NaN") {
    //         alert("Cannot Graph Value Which Equates To NaN (Such as asin(4) or 4/0 for example)");
    //         return;
    //     }
    //     YValueOneDimension[j] = ourVal;
    // 
    // }
    // 
    // /* reset the key back to original state */
    // arrayValueHash[graphVariable] = originalVarValue;
    // 
    // /* reset the equation back to original state */
    // solveEquation(document.getElementById('mainEquation').value);
    // if(document.getElementById("mainResult").innerHTML == "NaN") {
    //     alert("Cannot Graph Value Which Equates To NaN (Such as asin(4) or 4/0 for example)");
    //     return;
    // }
    // 
    // /* append the legend */
    // legendTxt += "</ul>"
    // var myLegendElement = document.createElement("div");
    // myLegendElement.id = subGraphLegendName;
    // myLegendElement.innerHTML = legendTxt;
    // 
    // document.getElementById(subGraphChartName).appendChild(myLegendElement);
    // var tempColorArray = [];
    // tempColorArray[0] = colorArray[graphVariable];
    // /* create the graph */
    // /* graph requires 2 singleimensional arrays of numbers */
    // /* the first set of arrays is the X axis values of this variable*/
    // /* the second set of arrays is the Y axis values of this variable*/
    // var lines = rGraph.g.linechart(xpos, ypos, xsize, ysize, XValueOneDimension, YValueOneDimension,
    // {nostroke: false, axis: "0 0 1 1", symbol: "o", smooth: true, colors: tempColorArray});
    // lines.symbols.attr({r: 3});
    // // lines.lines[0].animate({"stroke-width": 6}, 1000);
    // // lines.symbols[0].attr({stroke: "#fff"});
    // // lines.symbols[0][1].animate({fill: "#f00"}, 1000);
}
