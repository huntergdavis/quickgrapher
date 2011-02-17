// updates graphs for all variables
function updateAllGraphs(equation, context, embeddedGraph, graphTitle)
{
    var graph,
    // Retrieve variables
        v, vars = equation.variables(),
        varLen = vars.length;
        
    //var graphID = "subgraph" + graphNumber.toString();
    // Check if we already have a graph element
    //graph = $("#" + graphID);
    // Check for children of the graph container
    graph = embeddedGraph.children("div");
    if(typeof graph == "undefined" || graph.length == 0)
    {
        // Create graph element
        var parentElement = embeddedGraph;
        graph = document.createElement("div");
        //graph.id = graphID;
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
        updateSingleGraph(graph, v, equation, localContext, steps);
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
function updateSingleGraph(graph, graphVariable, equation, context, steps)
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
function updateGraph(equation, varValues, embeddedGraph)
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
    
    updateAllGraphs(parsedEquation, context, embeddedGraph, "Untitled Graph");
    
}

function graphSingleElement(embeddedGraph)
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
        var localEq = embeddedGraph.attr(fullAttributeName);

        if(typeof localEq == "string")
        {
            // grab the values attribute
            var localValues = embeddedGraph.attr(fullValueName);
            
            // update the graph
            updateGraph(localEq, localValues, embeddedGraph);
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

/* jQuery extension */
(function($)
{
    // Config parameter is in case you want to have configurable options
    $.fn.to_graph = function(config)
    {
      return this.each(function()
          {
              var $this = $(this);
              
              // Probably want to encapsulate this in
              // and object eventually.
              graphSingleElement($this);
              
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
