// solver test suite
// keep track of passed and total
var passed = 0;
var total = 0;


// set all context variables to 1
function createContext(vars) {
    var context = new Context(vars),
        varLen = vars.length,
        v, slider, val, step;
        
    for(var i = 0; i < varLen; i++)
    {
        v = vars[i];
        context.set(v, 1);
    }
    
    return context;
}

// print out basic statistics 
function printOutStats() {
    
    var insertionText = "<div class=\"instructions\" id=\"totals\">";
    insertionText += "<h2>Attempted: " + total + "</h2>";
    insertionText += "<h2>Passed: " + passed + "</h2>";
    var percentage = Math.floor((passed/total) *100);
    insertionText += "<h2>Why, That's " + percentage + "% successful</h2>";
    insertionText += "</div>";
    
    // insert into the body
    $(insertionText).insertAfter("#tests");
    
}


// create a new div element within the page 
// containg a Test Title, Description txt, boolean passed flag
function createNewTestDiv(title,desc,passed_flag) {
    
    // keep track globally
    total++;
    
    var insertionText = "<div class=\"instructions\" id=\"";
    
    // set the div id to be the title
    insertionText += title;
    
    insertionText += "\">";
    
    // have the title be large and in charge
    insertionText += "<h2>";
    insertionText += title;
    
    // did the test pass?
    if(passed_flag == 1)
    {
        insertionText += "- <div align=right style=\"color:blue;\">PASSED</div>";
        passed++;
    }
    else
    {
        insertionText += "- <div align=right style=\"color:red;\">FAILED</div>";
    }
    
    // limit the largeness
    insertionText += "</h2>";
    
    // give some descriptive text
    insertionText += desc;
    
    // close it all up
    insertionText += "</div>";
    
    
    // insert into the body
    $(insertionText).insertAfter("#tests");
    
}

// loop over examples and see if they solve correctly
function testExampleEquations() {

    var exLen = Examples.length;
    for(var i = 0; i < exLen; i++)
    {
        var parsedEquation = QGSolver.parse(Examples[i].fxn);

        var vars = parsedEquation.variables();
        var context = createContext(vars);
        var passedTest = 0;
        //console.log("Context: " + context.toString());
        
        // Solve
        var solution = undefined;
        try
        {
            solution = QGSolver.solve(context.toObj());
        }
        catch(exception)
        {
            //alert("Solve failed: " + exception);
            passedTest = 0;
            solution = "Solve failed:" + exception;
        }
        
        var actual_result = "Not Yet Implemented";
        var description = "Function = " + Examples[i].fxn + " <br>";
        description += "Parsed Function = " + parsedEquation.toString(context) + " <br>";
        description += "Expected Result = " + Examples[i].fxnSol + " <br>";
        description += "Actual Result = " + solution + "<br>";
        
        
       
        if(solution.toString() == Examples[i].fxnSol)
        {
            passedTest = 1;
        }
        
        createNewTestDiv(Examples[i].name,description,passedTest);
    }

}


// execute the test suite in its entirety
function executeTestSuite() {
    //createNewTestDiv("Test A","Just a first test",1);
    
    //createNewTestDiv("Test B","Just a second test",0);
    
    // test the example equations
    testExampleEquations();
    
    // print out stats
    printOutStats();
    
}


$(document).ready(function() {
    // Turn on debug
    QGSolver.DEBUG = true;
    // Load examples
    executeTestSuite();
});
