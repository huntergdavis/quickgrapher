// solver test suite

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


// create a new div element within the page 
// containg a Test Title, Description txt, boolean passed flag
function createNewTestDiv(title,desc,passed_flag) {
    
    
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
        insertionText += "- <div align=right>PASSED</div>";
    }
    else
    {
        insertionText += "- <div align=right>FAILED</div>";        
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
        description += "Parsed Function = " + parsedEquation.toString(context);
        description += "Expected Result = " + Examples[i].fxnSol + " <br>";
        description += "Actual Result = " + solution + "<br>";
        
        if(solution == Examples[i].fxnSol)
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
    
}


$(document).ready(function() {
    // Turn on debug
    QGSolver.DEBUG = true;
    // Load examples
    executeTestSuite();
});
