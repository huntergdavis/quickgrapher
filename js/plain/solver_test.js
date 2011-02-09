// solver test suite

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
        insertionText += "- PASSED";
    }
    else
    {
        insertionText += "- FAILED";        
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
        var actual_result = "Not Yet Implemented";
        var description = "Function = " + Examples[i].fxn + " <br>";
        description += "Expected Result = " + Examples[i].fxnSol + " <br>";
        description += "Actual Result = " + actual_result;
        
        createNewTestDiv(Examples[i].name,description,0);
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
