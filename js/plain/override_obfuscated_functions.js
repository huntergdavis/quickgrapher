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

/* LoadTitleBarHash loads in passed-in title bar equation */
function loadTitleBarHash()
{
    // Get location and search string.  I think there is a faster way to do this.
    var encodedBar = window.location.href,
        equationStart = encodedBar.indexOf("?")+1,
        encodedString = encodedBar.substring(equationStart,encodedBar.length),
        addressBar = encodedString;


    if(equationStart < 1) {
      equationStart = encodedBar.indexOf(".html/")+1;
    }


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
