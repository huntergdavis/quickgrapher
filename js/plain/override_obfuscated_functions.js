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
