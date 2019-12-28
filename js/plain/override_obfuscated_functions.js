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

/* function generateHashURL generates a save hash url for the current equation, receives variables as argument*/
function generateHashURL(vars,multi)
{
    // do NOT use window.location.href
    // it FAILS to on redirection sites
    //var URL = window.location.href,
    var URL = "www.hunterdavis.com/quickgrapher/?";

    functionListParent = $("#function_list");
    // the base equation div name
    //var eqNameBase = "#mainEquation";
    // the base name div name
    //var nameNameBase = "#equationName";

    functionListParent.find('div').each(function(i, el) {
        var row = $(el)[0];
        if(typeof row.fxnData != "undefined")
        {
            var localEquation = row.fxnData.eq.toString();
            if(typeof localEquation != "undefined")
            {
                URL += compressName(localEquation);
                var localName = row.fxnData.name.toString();
                localName = localName.replace(/\s/g,"%20");
                if(typeof localName != "undefined")
                {
                    URL += ":";
                    URL += localName;
                }

            // now add the variable context into the hash for this eq
            var localContext = row.fxnData.context;
            for(var variableIndex in localContext)
            {
                URL += ":"
                URL += variableIndex;
                URL += ":";
                URL += localContext[variableIndex].min;
                URL += ":";
                URL += localContext[variableIndex].curr;
                URL += ":";
                URL += localContext[variableIndex].max;
            }

        URL += "{"
        }
        }
    })
    URL += "=";


    // replace spaces with %20 for web addresses
    //var graphName =  $("#totalName").val(),
    //cleanGraphName = graphName.replace(/\s/g,"%20");
    var cleanGraphName = "";

    // clean up the plusses in URL for email clients
    URL = URL.replace(/\+/g,"'%");

    // add the fully constituted strings to URL
    URL += cleanGraphName + "]";

    // sneak the url into the instructions block
    $("#instruct").attr("href", URL);

}
