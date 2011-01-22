/* OUR ONLY GLOBALS ARE DECLARED
 HERE- array of variable names to legend info, array of variable names to values graphial graph*/
// var arrayLegendHash = new Array();
// var arrayValueHash = new Array();
// var colorArray = [];
// var variableFound = 0;
var parsedEquation = undefined;

// custom loadsaved functions for neater HTML downstairs
function loadSinWaves() {
    var equation = "?&$sin(5x)%20-%20cos(5y)&#x&:X Times 5&,y&:5 Times Y&,&%x&:1&,y&:3&,&*";
    loadSaved(equation);
}

// custom loadsaved functions for neater HTML downstairs
function loadBillCalculator() {
    var equation = "?&$100*(s%20-%20r%20-%20l%20-%20c%20-%20g-m-i)%20-%20n%20-t%20-p%20-a-e%20+%20100*(b%20+%20k)&#s&:Salary (*100 Monthly)&,r&:Rent (*100 Monthly)&,l&:Student Loan Payments (*100 Monthly)&,c&:Car Payments (*100 Monthly)&,g&:Grocery Bill (*100 Monthly)&,n&:Netflix&,t&:Tivo&,p&:Pet Food&,a&:Gas&,m&:Spending Money&,e&:Electric&,i&:Retirement Savings (*100 Monthly)&,b&:Income From Sub Lease (*100 Monthly)&,k&:Income From Stock Market (*100 Monthly)&,&%s&:33&,r&:17&,l&:2&,c&:3&,g&:5&,m&:3&,i&:6&,n&:14&,t&:12&,p&:47&,a&:66&,e&:78&,b&:6&,k&:1&,&*";
    loadSaved(equation);
}

// custom loadsaved functions for neater HTML downstairs
function loadNestedFunctions() {
    var equation = "?&$min(sum(max(1,x,4),min(3,4,5)),sum(max(1,y,3),min(6,5,3)))&#x&:Maximum Quantifier A&,y&:Maximum Quantifier B&,&%x&:7&,y&:7&,&*";
    loadSaved(equation);
}

// custom loadsaved functions for neater HTML downstairs
function loadSine() {
    var equation = "?&$sin(x)&#x&:Sine&,y&:Maximum Quantifier B&,&%x&:0&,&*";
    loadSaved(equation);
}

function loadASine() {
    var equation = "?&$asin(x)&#x&:ASine&,y&:Maximum Quantifier B&,&%x&:0&,&*";
    loadSaved(equation);
}

/////////// start copy/paste
function loadAddition() {
    var equation = "?&$x%20+%20y&#x&:First Integer&,y&:Second Integer&,&%x&:0&,y&:0&,&*";
    loadSaved(equation);
}

function loadMinus() {
    var equation = "?&$x%20-%20y&#x&:First Integer&,y&:Second Integer&,&%x&:0&,y&:0&,&*";
    loadSaved(equation);
}

function loadPower() {
    var equation = "?&$x^2&#x&:Number to be Squared&,&%x&:0&,&*";
    loadSaved(equation);
}

function loadDivision() {
    var equation = "?&$x/5&#x&:Number to Divide by Five&,&%x&:0&,&*";
    loadSaved(equation);
}

function loadMult() {
    var equation = "?&$x*5&#x&:Number to Multiply by Five&,&%x&:0&,&*";
    loadSaved(equation);
}

function loadPercentage() {
    var equation = "?&$p%&#p&:Percentage of Number&,&%p&:0&,&*";
    loadSaved(equation);
}

function loadCos() {
    var equation = "?&$cos(y)&#y&:Cosine&,&%y&:0&,&*";
    loadSaved(equation);
}

function loadTan() {
    var equation = "?&$tan(y)&#y&:Tangent&,&%y&:0&,&*";
    loadSaved(equation);
}

function loadACos() {
    var equation = "?&$acos(y)&#y&:ACosine&,&%y&:0&,&*";
    loadSaved(equation);
}

function loadATan() {
    var equation = "?&$atan(y)&#y&:ATangent&,&%y&:0&,&*";
    loadSaved(equation);
}

function loadSum() {
    var equation = "?&$sum(x,y,z,a,b,c)&#y&:Summation Index 2&,x&:Summation Index 1&,z&:Summation Index 3&,a&:Summation Index 4&,b&:Summation Index 5&,c&:Summation Index 6&,&%x&:11&,y&:17&,z&:22&,a&:27&,b&:38&,c&:39&,&*";
    loadSaved(equation);
}

function loadMedium() {
    var equation = "?&$medium(x,1,33,55)&#x&:Variable Value&,&%x&:0&,&*";
    loadSaved(equation);
}

function loadMax() {
    var equation =  "?&$max(x,1,33,55)&#x&:Variable Value&,&%x&:0&,&*";
    loadSaved(equation);
}

function loadMin() {
    var equation =  "?&$min(x,1,33,55)&#x&:Variable Value&,&%x&:0&,&*";
    loadSaved(equation);
}

function loadLess() {
    var equation = "?&$less(x,y)%20+%202*%20less(y,x)&#x&:First Variable&,y&:Second Variable&,&%x&:0&,y&:0&,&*";
    loadSaved(equation);
}

function loadGreater() {
    var equation = "?&$greater(x,y)%20+%202*%20greater(y,x)&#x&:First Variable&,y&:Second Variable&,&%x&:15&,y&:16&,&*";
    loadSaved(equation);
}

function loadEuler() {
    var equation = "?&$euler(e)&#e&:Euler Multiple&,&%e&:18&,&*";
    loadSaved(equation);
}

function loadFactorial() {
    var equation = "?&$factorial(4)&#&%&*";
    loadSaved(equation);
}

function loadNatLogTen() {
    var equation = "?&$natlogten(l)&#l&:Value for Log&,&%l&:0&,&*";
    loadSaved(equation);
}

function loadNatLog() {
    var equation = "?&$natlog(l)&#l&:Value for Log&,&%l&:0&,&*";
    loadSaved(equation);
}

function loadPi() {
    var equation = "?&$pi(m)&#m&:Multiples of Pi&,&%m&:0&,&*";
    loadSaved(equation);
}

function loadLogTenE() {
    var equation = "?&$logtene(l)&#l&:Value For Log&,&%l&:0&,&*";
    loadSaved(equation);
}

function loadLogTwoE() {
    var equation = "?&$logtwoe(l)&#l&:Value For Log&,&%l&:0&,&*";
    loadSaved(equation);
}

function loadAbs() {
    var equation = "?&$abs(-x)&#x&:Negative Values 1 through 100&,&%x&:0&,&*";
    loadSaved(equation);
}

function loadCeil() {
    var equation = "?&$ceil(x%20+%20.5)&#x&:Ceiling of Half Integers&,&%x&:0&,&*";
    loadSaved(equation);
}

function loadExp() {
    var equation = "?&$exp(8)&#&%&*";
    loadSaved(equation);
}

function loadFloor() {
    var equation = "?&$floor(y%20+%20.5)&#y&:Half Integers 1 to 100&,&%y&:0&,&*";
    loadSaved(equation);
}

function loadLog() {
    var equation = "?&$log(x)&#x&:Logarithmic Number&,&%x&:0&,&*";
    loadSaved(equation);
}

function loadRandom() {
    var equation = "?&$random(x%20-%20x%20+%201)&#x&:Subtracted Away Value&,&%x&:0&,&*";
    loadSaved(equation);
}

function loadRound() {
    var equation = "?&$round(x%20+%20.6)%20-%20round(y%20+%20.3)&#x&:Higher Rounding Value&,y&:Lower Rounding Value&,&%x&:0&,y&:0&,&*";
    loadSaved(equation);
}

function loadSqrt() {
    var equation = "?&$sqrt(x)&#x&:Values 1 to 100&,&%x&:0&,&*";
    loadSaved(equation);
}

function loadFibonacci() {
    var equation = "?&$fibonacci(min(x,15))&#x&:Values 1 to 100&,&%x&:0&,&*";
    loadSaved(equation);
}

function loadNextPrime() {
    var equation = "?&$nextprime(p)&#p&:Numbers less than a Prime&,&%p&:0&,&*";
    loadSaved(equation);
}

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
    // as we're looping over values, don't clear the legend (annoying!)
    //arrayLegendHash = null;
    //arrayLegendHash = [];
    // arrayValueHash = null;
    // colorArray = null;
    // arrayValueHash = [];
    // colorArray = [];

    /* loop over the collection of cloned sliders and
     delete their parents */
    // var cloneSpanCollection = document.getElementsByName("clonedSlider");
    // var cloneSpanCollectionLength = cloneSpanCollection.length;
    // for (var i = 0; i < cloneSpanCollectionLength; i++)
    // {
    //     cloneSpanCollection[0].parentNode.parentNode.removeChild(cloneSpanCollection[0].parentNode);
    // }
    // 
    var graphParent = $("#graph_container"),
        sliderParent = $("#sliders");
          
    // Clear existing graph
    graphParent.empty();
    // Clear sliders
    sliderParent.empty();
    
    // Clear solved result display
    $("#result").hide();
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

function updateSolution(equation, context, solution)
{
    document.getElementById("formula").innerText = equation.toString(context);
    document.getElementById("solution").innerText = solution;
    $("#result").show();
}

function createContext(vars) {
    var context = new Context(vars),
        varLen = vars.length,
        v, slider, val;
        
    for(var i = 0; i < varLen; i++)
    {
        v = vars[i];
        slider = $("#" + v + "_slider");
        val = parseInt(slider.val());
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
        createSliders(parsedEquation.variables());
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

// updates graphs for all variables
function updateAllGraphs(equation, context)
{
    var unifiedGraph = true;
    if(unifiedGraph)
    {
        var graphID = "subgraph";
        // Check if we already have a graph element
        if($("#" + graphID).length == 0)
        {
            // Create graph element
            var graph = document.createElement("div"),
                parentElement = $("#graph_container");
            graph.id = graphID;
            graph.style.position = "relative";
            graph.style.width = parentElement.width();
            graph.style.height = parentElement.height();
            // Add to canvas
            parentElement.append(graph);
            // Register with Graph
            $(graph).graphify({'hue-increment' : 35, 'hue-base' : 0}).attach_legend().realHover({
                hover: Graph.highlightNearest,
                out: Graph.removeHighlight
            });
        }
    }
 
    /// Loop over variable
    var name = "",
        v, vars = equation.variables(), varLen = vars.length,
        localContext = context.toObj();
    for(var i = 0; i < varLen; i++)
    {
        // Current variable
        v = vars[i];
        // If we are supposed to draw this variable
        if($("#" + v + "_graph_toggle").is(":checked"))
        {
            //name = "Title" + varName;
            // Adjust context
            var fixedPt = localContext[v];
            // Substitute iterator
            localContext[v] = new VariableIterator(0,1);
            // Create graph
            updateGraph(graphID, v, equation, localContext, 101);
            // Replace values into local context for next loop step
            localContext[v] = fixedPt;
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
    
    // Add plot for this variable (will overwrite existing ones)
    graph.plot(
        graphVariable,
        data,
        {'plot-type' : 'line'}
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