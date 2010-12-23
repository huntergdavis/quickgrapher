//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/classes/math-processor [rev. #1]

// extra math functions hunter added from SO examples and TAE
Array.prototype.max = function() {
  return Math.max.apply(null, this)
}

Array.prototype.min = function() {
  return Math.min.apply(null, this)
}

MathProcessor = function(){
    var o = this;
    o.o = {
        "+": function(a, b){ return +a + b; },
        "-": function(a, b){ return a - b; },
        "%": function(a, b){ return a % b; },
        "/": function(a, b){ return a / b; },
        "*": function(a, b){ return a * b; },
        "^": function(a, b){ return Math.pow(a, b); } 
          };
    
    o.s = { "^": 3, "*": 2, "/": 2, "%": 1, "+": 0, "-": 0 };
    o.u = {"+": 1, "-": -1}, o.p = {"(": 1, ")": -1};
};
with({p: MathProcessor.prototype}){
    p.methods = {
//        div: function(a, b){ return parseInt(a / b); },
//        fra: function(a){ return a - parseInt(a); },
		sin: function(n){ return Math.sin(n); },
		cos: function(n){ return Math.cos(n); },
		tan: function(n){ return Math.tan(n); },
		asin: function(n){ return Math.asin(n); },		
		acos: function(n){ return Math.acos(n); },
		atan: function(n){ return Math.atan(n); },		
		euler: function(n){ return (n * Math.E); },
		natlogten: function(n){ return (n * Math.LN10); },
		natlog: function(n){ return (n * Math.LN2); },
		logtwoe: function(n){ return (n * Math.LOG2E); },
		logtene: function(n){ return (n * Math.LOG10E); },
		abs: function(n){ return (Math.abs(n)); },
		ceil: function(n){ return (Math.ceil(n)); },
		exp: function(n){ return (Math.exp(n)); },
		floor: function(n){ return (Math.floor(n)); },
		log: function(n){ return (Math.log(n)); },
		random: function(n){ return (n * Math.random()); },
		round: function(n){ return (Math.round(n)); },
		sqrt: function(n){ return (Math.sqrt(n)); },
		pi: function(n){ return (n * Math.PI); },
		min: function(n1, n2){ args = arguments; return Math.min.apply(null, args); },		
		max: function(n1, n2, n3, n){ args = arguments; return Math.max.apply(null, args); },
		nextprime: function(n){var totest=Math.floor(n);if(totest >= 2){var smaller=1;while(smaller*smaller<=totest){totest++;smaller=2;while((totest%smaller>0)&&(smaller*smaller<=totest)){smaller++;}}return totest;}else{return 2;}},
		fibonacci: function(n){var fibs = new Array();fibs[0] = 0; fibs[1] = 1; for(i=0; i<n; i++){fibs.push(fibs[0] + fibs[1]);fibs.shift();}return fibs[0];},
		factorial: function(n){var result = 1;for (var i = 2; i <= n; i++) {result *= i;} return result;},
		greater: function(n1, n2){ if (n1 > n2) { return 1; } return 0; },		
		less: function(n1, n2){ if (n1 < n2) { return 1; } return 0; },					
        sum: function(n1, n2, n3, n){ for(var r = 0, a, l = (a = arguments).length; l; r += a[--l]); return r; },
        medium: function(n1, n2, n3, n){ for(var r = 0, a, l = (a = arguments).length; l; r += a[--l]); return (r / a.length); }
    };
    p.parse = function(e){
        for(var n, x, _ = this, o = [], s = [x = _.RPN(e.replace(/ /g, "").split(""))]; s.length;)
            for((n = s[s.length-1], --s.length); n[2]; o[o.length] = n, s[s.length] = n[3], n = n[2]);
        for(; (n = o.pop()) != undefined; n[0] = _.o[n[0]](isNaN(n[2][0]) ? _.f(n[2][0]) : n[2][0], isNaN(n[3][0]) ? _.f(n[3][0]) : n[3][0]));
        return +x[0];
    };
    p.RPN = function(e){
        var x, r, _ = this, c = r = [, , , 0];
        if(e[0] in _.u || !e.unshift("+"))
            for(; e[1] in _.u; e[0] = _.u[e.shift()] * _.u[e[0]] + 1 ? "+" : "-");
        (c[3] = [_.u[e.shift()], c, , 0])[1][0] = "*", (r = [, , c, 0])[2][1] = r;
        (c[2] = _.v(e))[1] = c;
        (!e.length && (r = c)) || (e[0] in _.s && ((c = r)[0] = e.shift(), !e.length && _.error()));
        while(e.length){
            if(e[0] in _.u){
                for(; e[1] in _.u; e[0] = _.u[e.shift()] * _.u[e[0]] + 1 ? "+" : "-");
                (c = c[3] = ["*", c, , 0])[2] = [-1, c, , 0];
            }
            (c[3] = _.v(e))[1] = c;
            e[0] in _.s && (c = _.s[e[0]] > _.s[c[0]] ?
                ((c[3] = (x = c[3], c[2]))[1][2] = [e.shift(), c, x, 0])[2][1] = c[2]
                : r == c ? (r = [e.shift(), , c, 0])[2][1] = r
                : ((r[2] = (x = r[2], [e.shift(), r, ,0]))[2] = x)[1] = r[2]);
        }
        return r;
    };
    p.v = function(e){
        var i, j, l, _ = this;
        if("0123456789.".indexOf(e[0]) + 1){
            for(i = -1, l = e.length; ++i < l && "0123456789.".indexOf(e[i]) + 1;);
            return [+e.splice(0,i).join(""), , , 0];
        }
        else if(e[0] == "("){
            for(i = 0, l = e.length, j = 1; ++i < l && (e[i] in _.p && (j += _.p[e[i]]), j););
            return _.RPN(l = e.splice(0,i), l.shift(), !j && e.shift());
        }
        else{
            if(((j = e[0].toLowerCase()) >= "a" && j <= "z") || j == "_"){
                for(i = 0; ((j = e[++i].toLowerCase()) >= "a" && j <= "z") || j == "_" || (j >= 0 && j <= 9););
                if(j == "("){
                    for(var l = e.length, j = 1; ++i < l && (e[i] in _.p && (j += _.p[e[i]]), j););
                    return [e.splice(0,i+1).join(""), , , 0];
                }
            }
        }
        _.error();
    };
    p.f = function(e){
        var n, i = 0, _ = this;
        if(((e = e.split(""))[i] >= "a" && e[i] <= "z") || e[i] == "_"){
            while((e[++i] >= "a" && e[i] <= "z") || e[i] == "_" || (e[i] >= 0 && e[i] <= 9));
            if(e[i] == "("){
                !_.methods[n = e.splice(0, i).join("")] && _.error("Função \"" + n + "\" não encontrada"), e.shift();
                for(var a = [], i = -1, j = 1; e[++i] && (e[i] in _.p && (j += _.p[e[i]]), j);)
                    j == 1 && e[i] == "," && (a.push(_.parse(e.splice(0, i).join(""))), e.shift(), i = -1);
                a.push(_.parse(e.splice(0,i).join(""))), !j && e.shift();
            }
            return _.methods[n].apply(_, a);
        }
    };
    p.error = function(s){
        throw new Error("MathProcessor: " + (s || "Erro na expressão"));
    };
}
