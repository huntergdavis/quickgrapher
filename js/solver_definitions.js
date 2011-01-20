/**
 * Requires ComplexFunctions (in solver.js)
 */

/* Defined functions */
/* Arithmetic */
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
Functions["sqrt"] = new ComplexFunction(1,true,
        function(a) {
            return Math.sqrt(a);
        });
        
/* Sinusoidal */
Functions["sin"] = new ComplexFunction(1,true,
        function(a) {
            var result = Math.sin(a);
            return result;
        });
Functions["cos"] = new ComplexFunction(1,true,
        function(a) {
            return Math.cos(a);
        });
Functions["tan"] = new ComplexFunction(1,true,
        function(a) {
            return Math.tan(a);
        });
Functions["asin"] = new ComplexFunction(1,true,
        function(a) {
            return Math.asin(a);
        });
Functions["acos"] = new ComplexFunction(1,true,
        function(a) {
            return Math.acos(a);
        });
Functions["atan"] = new ComplexFunction(1,true,
        function(a) {
            return Math.atan(a);
        });

/* Logarithms */
// Log-10
Functions["log"] = new ComplexFunction(1,true,
        function(a) {
            return Math.log(a)/Math.LN10;
        });
// Log-e
Functions["ln"] = new ComplexFunction(1,true,
        function(a) {
            return Math.log(a);
        });
        
/* Rectifiers */
Functions["abs"] = new ComplexFunction(1,true,
        function(a) {
            return Math.abs(a);
        });
Functions["ceil"] = new ComplexFunction(1,true,
        function(a) {
            return Math.ceil(a);
        });
Functions["floor"] = new ComplexFunction(1,true,
        function(a) {
            return Math.floor(a);
        });
Functions["average"] = new ComplexFunction(1,true,
        function() {
            var results = 0,
                len = arguments.length;
            if(len > 1 || (typeof arguments[0] != "undefined"))
            {
                for(var i = 0; i < len; i++)
                {
                    results += arguments[i];
                }
            }
            if(len > 0)
            {
                results /= len;
            }
            return results;
        },true);
        
/* Combinators */
Functions["sum"] = new ComplexFunction(1,true,
        function() {
            var results = 0,
                len = arguments.length;
            if(len > 1 || (typeof arguments[0] != "undefined"))
            {
              for(var i = 0; i < len; i++)
              {
                  results += arguments[i];
              }
            }

            return results;
        },true);
Functions["product"] = new ComplexFunction(1,true,
        function() {
            var results = 1,
                len = arguments.length;
            if(len > 1 || (typeof arguments[0] != "undefined"))
            {
                for(var i = 0; i < len; i++)
                {
                    results *= arguments[i];
                }
            }

            return results;
        },true);

/* Defined constants */
// PI : ~3.14159
Constants["pi"] = new Constant(Math.PI);
// E : ~2.71828
Constants["e"] = new Constant(Math.E);






/* Custom functions */
Functions["cheese"] = new ComplexFunction(1,true,
        function(a,b,c,d,e,f) {
            return a * b * c * d * e * f;
        });
