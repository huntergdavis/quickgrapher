/**
 * Requires ComplexFunctions (in solver.js)
 */

/* Defined functions */
/*
 * Functions are defined by a symbol and
 * a ComplexFunction object.
 *   e.g.
 *      Functions[symbol] = new ComplexFunction(...);
 * 
 * With ComplexFunction having the signature:
 * 
 *      ComplexFunction(precedence, prefix, function, open-ended)
 * 
 * Parameters:
 * 
 *    precedence (integer) : Binding precendence for infix arithmetic
 *        operations.  Only applied to infix functions which are adjacent
 *        in the equation.
 *    
 *    prefix (boolean) : True, if this is a prefix function (i.e. sin).
 *        False, if this is an infix function (i.e. +).
 * 
 *    function (function) : The actual javascript function to call for
 *        this operator/symbol.
 * 
 *    open-ended (boolean) : Optional, default: false.  True, if this
 *        function can handle an unlimited number of arguments. False, if
 *        this function has a set number of arguments.  If false, the
 *        number of arguments expected is infered from the signature of
 *        the 'function' parameter.
 */
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
Functions["/"] = new ComplexFunction(2,false,
        function(a,b) {
            return a / b;
        });
Functions["^"] = new ComplexFunction(3,false,
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
        
/* Linear Algebra */
Functions["rand"] = new ComplexFunction(1,true,
		function() {
			return Math.random();
		});

Functions["fact"] = new ComplexFunction(1,true,
		function(n) {
			var result = 1;for (var i = 2; i <= n; i++) {result *= i;} return result;
		});
		
Functions["fib"] = new ComplexFunction(1,true,
		function(n) {
			var fibs = new Array();
			fibs[0] = 0; 
			fibs[1] = 1; 
			for(i=0; i<n; i++){
				fibs.push(fibs[0] + fibs[1]);fibs.shift();
				}
				return fibs[0];
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
Functions["less"] = new ComplexFunction(1,true,
        function(a,b) {
            var results = 0;
            if(a < b) 
            {
				results = 1;
            }
            return results;
        },false);
Functions["greater"] = new ComplexFunction(1,true,
        function(a,b) {
            var results = 0;
            if(a > b) 
            {
				results = 1;
            }
            return results;
        },false);                
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
/*
 * Constants are defined by a symbol and
 * a Constant object.
 *   e.g.
 *      Constants[symbol] = new Constant(..);
 * 
 * With Constant having the signature:
 * 
 *      Constant(value)
 * 
 * Parameters:
 * 
 *    value (number) : The numerical value to use for
 *          this constant.
 *    
 */
// PI : ~3.14159
Constants["pi"] = new Constant(Math.PI);
// E : ~2.71828
Constants["e"] = new Constant(Math.E);






/* Custom functions */

