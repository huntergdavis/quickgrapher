/* Solution test examples
 * */

var TestExamples = [];

TestExamples.push({
    name: "Bill Calculator 3 and 4",
    fxn : "3*x+(15*y)",
    curVarContext : [3,4],
    parseSol : "3*3+(15*4)",
    numSol : "69"
});

TestExamples.push({
    name: "Bill Calculator 5 and 6",
    fxn : "3*x+(15*y)",
    curVarContext : [5,6],
    parseSol : "3*5+(15*6)",
    numSol : "105"
});

TestExamples.push({
        name:"Sine Tree Test", 
           fxn : "32*tree+15*sin(green)",
               curVarContext : [36,55],parseSol : "32*36+15*sin(55)",numSol : "1137.0036723996207"});
