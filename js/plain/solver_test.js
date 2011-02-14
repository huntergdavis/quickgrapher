// solver test suite
// keep track of passed and total
var passed = 0;
var total = 0;
var passedParse = 0;
var totalParsed = 0;

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

// set all context variables to correct variables
function createTestContext(vars,varContext,solNumber) {
    var context = new Context(vars),
        varLen = vars.length,
        v, slider, val, step;
        
    for(var i = 0; i < varLen; i++)
    {
        v = vars[i];
        context.set(v, varContext[i][solNumber]);
    }
    
    return context;
}

// print out basic statistics 
function printOutStats() {
    
    var insertionText = "<div class=\"instructions\" id=\"totals\">";
    insertionText += "<h2>Attempted: " + total + "</h2>";
    insertionText += "<h2>Passed: " + passed + "</h2>";
    var percentage = Math.floor((passed/total) *100);
    
    insertionText += "<h2>Attempted Parsed: " + totalParsed + "</h2>";
    insertionText += "<h2>Correctly Parsed: " + passedParse + "</h2>";   
    var parsedPercentage =  Math.floor((passedParse/totalParsed) *100);
    
    var totalPercentage = Math.floor(((passed + passedParse) / (total + totalParsed)) * 100);
    
    insertionText += "<h2>Why, That's " + percentage + "% successful numerically</h2>";
    insertionText += "<h2>" + parsedPercentage + "% successful parses</h2>";
    insertionText += "<h2>And " + totalPercentage + "% successful overall</h2>";
    insertionText += "</div>";
    
    // insert into the body
    $(insertionText).insertAfter("#tests");
    
}


// create a new div element within the page 
// containg a Test Title, Description txt, boolean passed flag
function createNewTestDiv(title,desc,passed_flag, passedParse_flag) {
    
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
        insertionText += "<div align=right style=\"color:blue;\">PASSED Numerically</div>";
        passed++;
    }
    else
    {
        insertionText += "<div align=right style=\"color:red;\">FAILED Numerically</div>";
    }

    // did the test pass parse?
    if(passedParse_flag == 1)
    {
        insertionText += "<div align=right style=\"color:blue;\">PASSED Parse</div>";
        passedParse++;
        totalParsed++;
    }
    else if(passedParse_flag == 0)
    {
        insertionText += "<div align=right style=\"color:red;\">FAILED Parse</div>";
        totalParsed++;
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
        
        createNewTestDiv(Examples[i].name,description,passedTest,2);
    }

}


// loop over examples and see if they solve correctly
function testSolverTestExamples() {

    var exLen = TestExamples.length;
    for(var i = 0; i < exLen; i++)
    {
        var parsedEquation = QGSolver.parse(TestExamples[i].fxn);

        var vars = parsedEquation.variables();
        // loop over each of the numerical solutions
        for(var j = 0;j < TestExamples[i].numSol.length;j++)
        {
            var context = createTestContext(vars,TestExamples[i].curVarContext,j);
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
            

            var description = "Function = " + TestExamples[i].fxn + " <br>";
            if(j == 0)
            {
                description += "Parsed Function = " + parsedEquation.toString(context.toObj()) + " <br>";
                description += "Expected Parsed Function = " + TestExamples[i].parseSol + " <br>";
            }
            description += "Expected Result = " + TestExamples[i].numSol[j] + " <br>";
            description += "Actual Result = " + solution + "<br>";
            
            var localPassedParse = 2;
            
            if(j == 0)
            {
                if(parsedEquation.toString(context.toObj()) == TestExamples[i].parseSol)
                {
                    localPassedParse = 1;
                }
                else
                {
                    localPassedParse = 0;
                }
            }
           
            if(solution.toString() == TestExamples[i].numSol[j])
            {
                passedTest = 1;
            }

            
            createNewTestDiv(TestExamples[i].name,description,passedTest,localPassedParse);
        }
    }

}


// execute the test suite in its entirety
function executeTestSuite() {
    //createNewTestDiv("Test A","Just a first test",1);
    
    //createNewTestDiv("Test B","Just a second test",0);
    
    // test the example equations
    testExampleEquations();
    
    // test the solver test equations
    testSolverTestExamples();
    
    // print out stats
    printOutStats();
    
}


$(document).ready(function() {
    // Turn on debug
    QGSolver.DEBUG = false;
            
    // execute the test suite
    executeTestSuite();
});
