/**
 * Requires ComplexFunctions (in solver.js)
 */

/* Defined functions */
// Arithmetic
Functions["+"] = new ComplexFunction(0,false, 
        function(a,b) {
            return a + b;
        });
Functions["-"] = new ComplexFunction(0,false,
        function(a,b) {
            return a - b;
        });
Functions["*"] = new ComplexFunction(1,false,
        function(a,b) {
            return a * b;
        });
Functions["/"] = new ComplexFunction(1,false,
        function(a,b) {
            return a / b;
        });
Functions["^"] = new ComplexFunction(2,false,
        function(a,b) {
            return Math.pow(a,b);
        });
        
// Sinusoidal
Functions["sin"] = new ComplexFunction(1,true,
        function(a) {
            var result = Math.sin(a);
            return result;
        });