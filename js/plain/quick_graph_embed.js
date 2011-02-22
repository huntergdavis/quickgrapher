// updates graphs for all variables
function graphAllVariablesForEquation(equation, context, embeddedGraph, graphTitle,refNum,attributeCount)
{
    var graph,
    // Retrieve variables
        v, vars = equation.variables(),
        varLen = vars.length;
        
    var graphID = "subgraph" + refNum.toString();
    // Check if we already have a graph element
    //graph = $("#" + graphID);
    // Check for children of the graph container
    graph = embeddedGraph.children("div");
    if(typeof graph == "undefined" || graph.length == 0)
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
        //graph = $(graph);
        graph = embeddedGraph.children("div");
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
            min = returnVariableMinStepMax(embeddedGraph,i,0,refNum,attributeCount),
            step = returnVariableMinStepMax(embeddedGraph,i,1,refNum,attributeCount),
            max = returnVariableMinStepMax(embeddedGraph,i,2,refNum,attributeCount),
            steps = ((max - min)/step) + 1;
        // Substitute iterator
        localContext[v] = new VariableIterator(min,step);
        // Create graph
        displaySingleLineGraphForEquation(graph, v, equation, localContext, steps);
        // Replace values into local context for next loop step
        localContext[v] = fixedPt;
   }
}


// returns the variable minimum/step/max or default if doesn't exist
function returnVariableMinStepMax(embeddedGraph,variableNumber,MSM,refNum,attributeCount)
{
    // if this isn't an equation graph, look for values
    var minstepmaxString = embeddedGraph.attr("minstepmax" + attributeCount);

    // if we have values to plot
    if(typeof minstepmaxString == "string")
    {    
        var triplets = minstepmaxString.split(";");
        var singlets = triplets[variableNumber].split(",");
        return parseFloat(singlets[MSM]);
    }
    else
    {
        switch(MSM)
        {
            case 0:
                return 1;
            case 1:
                return 5;
            case 2:
                return 100;
            default:
                return 5;
        }
        
    }
}


// updates a single graph
function displaySingleLineGraphForEquation(graph, graphVariable, equation, context, steps)
{
    // Retrieve reference to graph object
    var currVarValue, solution, data = [];
        
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
function updateGraphWithEquation(equation, varValues, embeddedGraph,refNum,attributeCount)
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
    
    // if there is no title, use the equation?
    var graphTitle = embeddedGraph.attr("title");
    
    if(graphTitle == "")
    {
         graphTitle = equation;
    }

    graphAllVariablesForEquation(parsedEquation, context, embeddedGraph, graphTitle,refNum,attributeCount);
    
}

function updateGraphWithPlot(localValues,localPlotType, embeddedGraph, refNum, plotLabel)
{
    // if there is no title, use the plot type?
    var graphTitle = embeddedGraph.attr("title");
    
    if(graphTitle == "")
    {
         graphTitle = localPlotType + " graph";
    }

    var graph;
    var graphID = "subgraph" + refNum.toString();
    // Check if we already have a graph element
    // Check for children of the graph container
    graph = embeddedGraph.children("div");
    if(typeof graph == "undefined" || graph.length == 0)
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
        graph = embeddedGraph.children("div");
        
        // set Graph options
        var opts = {name: graphName};
        opts['hue-increment'] = 45;
        opts['hue-base'] = 22;
        opts['value-base'] = 95;
        opts['title'] = graphTitle;
        graph.graphify(opts).realHover({
            hover: Graph.highlightNearest,
            out: Graph.removeHighlight
        });                
    }
 
    // data container for graph
    var data = retrieveValuesFromString(localValues);

    
    // Add plot for this variable (will overwrite existing ones)
    var cs = {label : plotLabel};
    cs['plot-type'] = localPlotType;
    graph.plot(
        plotLabel,
        data,
        cs
    );
    
}

// splits the string and retrieves x,y values for the graph
function retrieveValuesFromString(localValues)
{
    var data = new Array();
    var pairs = localValues.split(";");
    var numPairs = pairs.length;
    
    // loop over all pairs and push into data
    for(var i = 0;i<numPairs;i++)
    {
        var splitPair = pairs[i].split(",");
        data.push(splitPair);
    }
    return data;
}



// applies css tags to our graph tags
// currently sets display to block so
// canvas can render in a blocked area
function applyCssToGraphTag(embeddedGraph)
{ 
    // set the display to block
    embeddedGraph.css({"display": "block"});
    
    // ensure we have a valid height and width
    var w = embeddedGraph.width();
    var h = embeddedGraph.height(); 

    if(w < 30)
    {
        embeddedGraph.css({"width":"250"});
    }
    if(h < 30)
    {
        embeddedGraph.css({"height":"250"});
    }
}

// goes through a graph tag and calls various graphing agents
// for each type of tag found
function processSingleGraphTag(embeddedGraph,refNum)
{
    var equationBaseName = "equation";
    var variableBaseName = "vars";
    var graphTypeBaseName = "type";
    var graphValuesBaseName = "values";
    var graphLabelBaseName = "label";
    var graphMSMBaseName = "minstepmax";
    
    var continueProcessingSingleElement = 1;
    var attributeCount = 0;
    
    // before anything, we should apply our css styling
    applyCssToGraphTag(embeddedGraph);
    
    
    while(continueProcessingSingleElement == 1)
    {
        var fullEquationName = equationBaseName;
        var fullVariableName = variableBaseName;
        var fullTypeName = graphTypeBaseName;
        var fullValuesName = graphValuesBaseName;
        var fullLabelName = graphLabelBaseName;
        
        // we allow equation or equation1, so loop
        // zero tests for equation, 1 for eq1 and so on
        if(attributeCount > 0)
        {
            fullEquationName +=  attributeCount.toString();
            fullVariableName += attributeCount.toString();
            fullTypeName += attributeCount.toString();
            fullValuesName += attributeCount.toString();
            fullLabelName += attributeCount.toString();         
        }
        
        // grab the equation attribute
        var localEq = embeddedGraph.attr(fullEquationName);

        // if we have an equation
        if(typeof localEq == "string")
        {
            // grab the values attribute
            var localValues = embeddedGraph.attr(fullVariableName);
            
            // update the graph
            updateGraphWithEquation(localEq, localValues, embeddedGraph,refNum,attributeCount);
        }
        else
        {
            // if this isn't an equation graph, look for values
            var localValues = embeddedGraph.attr(fullValuesName);
            
            // if we have values to plot
            if(typeof localValues == "string")
            {
                // see if we have a plot type
                var localPlotType = embeddedGraph.attr(fullTypeName);
                
                // if we don't have a plot type, default to 
                // our default type - point graph
                if(typeof localPlotType != "string")
                {
                    localPlotType = "point";
                }
                
                // validate plot type
                localPlotType = validatePlotType(localPlotType);
                
                // set plot label
                var plotLabel = embeddedGraph.attr(fullLabelName);
                
                // update graph with values to plot
                updateGraphWithPlot(localValues,localPlotType, embeddedGraph, refNum,plotLabel);
                
            }
            
            // if we've gone past eq or eq1 and are on eq2
            // and it's blank, don't look for an eq3
            if(attributeCount > 1)
            {
                continueProcessingSingleElement = 0;
            }
        }
        
        // increment our attribute count
        attributeCount++;
    }
}

function validatePlotType(localPlotType)
{
    // we only support point and plot right now
    // so only graph those
    if((localPlotType != "point") && (localPlotType != "line"))
    {
        return "point";
    }    
    return localPlotType;
}

/* jQuery extension */
(function($)
{
    // Config parameter is in case you want to have configurable options
    $.fn.to_graph = function(config)
    {
      return this.each(function(index)
          {
              var $this = $(this);
              
              // Probably want to encapsulate this in
              // and object eventually.
              processSingleGraphTag($this, index);
              
              // Return 'this' to adhere to jQuery best practices.
              return $this;
          });
    };
})(jQuery);

$(document).ready(function() {
    // Turn on debug
    //QGSolver.DEBUG = true;
    QGSolver.DEBUG = false;
    // enable random load
    
    // Turn on Test Generation
    QGSolver.TESTGENERATION = false;
    
    // replace all graph tags
    // This is a reference to the jQuery extension name above
    // Config param is optional
    $("graph").to_graph();
});
