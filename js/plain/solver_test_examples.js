/* Solution test examples
 * */

var TestExamples = [];

TestExamples.push({
    name: "Basic math test",
    fxn : "y*x",
    curVarContext : [[3,2,5,3,1,2,3,4,5,6],[4,2,5,3,2,2,3,4,5,6]],
    parseSol : "3*4",
    numSol : [12,4,25,9,2,4,9,16,25,36]  
});


TestExamples.push({
    name: "Bill Calculator 3 and 4",
    fxn : "3*x+(15*y)",
    curVarContext : [[3],[4]],
    parseSol : "3*3+(15*4)",
    numSol : [69]
});

TestExamples.push({
    name: "Bill Calculator 5 and 6",
    fxn : "3*x+(15*y)",
    curVarContext : [[5],[6]],
    parseSol : "3*5+(15*6)",
    numSol : [105]
});

TestExamples.push({
        name:"Sine Tree Test", 
           fxn : "32*tree+15*sin(green)",
               curVarContext : [[36],[55]],parseSol : "32*36+15*sin(55)",numSol : [1137.0036723996207]});



/* The following examples test our functions*/
TestExamples.push({name:"Basic Math Test",fxn : "x*y/z-r+g^f",curVarContext : [[24],[34],[47],[63],[75],[90]],parseSol : "24*34/47-63+75^90",numSol : [5.6952619667371096e+168]});
TestExamples.push({name:"Advanced Math Test",fxn : "x*sqrt(t^2)",curVarContext : [[1],[50]],parseSol : "1*sqrt(50^2)",numSol : [50]});
TestExamples.push({name:"Sines And Cosines",fxn : "sin(cos(tan(asin(acos(atan(x))))))",curVarContext : [[0.82]],parseSol : "sin(cos(tan(asin(acos(atan(0.82))))))",numSol : [0.16934129712282822]});
TestExamples.push({name:"Logs and Lns",fxn : "log(x)-ln(x)",curVarContext : [[43]],parseSol : "log(43)-ln(43)",numSol : [-2.1277316601139757]});
TestExamples.push({name:"Algorithmics",fxn : "fact(x)+fib(x)",curVarContext : [[5]],parseSol : "fact(5)+fib(5)",numSol : [125]});
TestExamples.push({name:"More Algorithmics",fxn : "abs(sin(x))",curVarContext : [[0.42]],parseSol : "abs(sin(0.42))",numSol : [0.40776045305957015]});
TestExamples.push({name:"Ceiling and Floor",fxn : "ceil(sin(x))+floor(sin(y))",curVarContext : [[16],[30]],parseSol : "ceil(sin(16))+floor(sin(30))",numSol : [-1]});
TestExamples.push({name:"Less",fxn : "less(sin(x),cos(x))",curVarContext : [[31]],parseSol : "less(sin(31),cos(31))",numSol : [1]});
TestExamples.push({name:"Greater",fxn : "greater(sin(x),cos(x))",curVarContext : [[17]],parseSol : "greater(sin(17),cos(17))",numSol : [0]});
TestExamples.push({name:"Average",fxn : "average(sin(x),cos(x),log(x))",curVarContext : [[30]],parseSol : "average(sin(30),cos(30),log(30))",numSol : [0.21444702683812822]});
TestExamples.push({name:"Sum",fxn : "sum(sin(x),cos(x),log(x))",curVarContext : [[64]],parseSol : "sum(sin(64),cos(64),log(64))",numSol : [3.1180632426102273]});
TestExamples.push({name:"Product",fxn : "product(sin(x),cos(x),log(x))",curVarContext : [[35]],parseSol : "product(sin(35),cos(35),log(35))",numSol : [0.5974699356069958]});
TestExamples.push({name:"Product",fxn : "min(sin(x),cos(x),log(x))",curVarContext : [[37]],parseSol : "min(sin(37),cos(37),log(37))",numSol : [-0.6435381333569995]});
TestExamples.push({name:"Product",fxn : "max(sin(x),cos(x),log(x))",curVarContext : [[29]],parseSol : "max(sin(29),cos(29),log(29))",numSol : [1.462397997898956]});
