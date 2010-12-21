//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/classes/math-processor [rev. #1]

MathProcessor = function(){
    var o = this;
    o.o = {
        "+": function(a, b){ return +a + b; },
        "-": function(a, b){ return a - b; },
        "%": function(a, b){ return a % b; },
        "/": function(a, b){ return a / b; },
        "*": function(a, b){ return a * b; },
        "^": function(a, b){ return Math.pow(a, b); },
        "~": function(a, b){ return Math.sqrt(a, b); }
    };
    o.s = { "^": 3, "~": 3, "*": 2, "/": 2, "%": 1, "+": 0, "-": 0 };
    o.u = {"+": 1, "-": -1}, o.p = {"(": 1, ")": -1};
};
with({p: MathProcessor.prototype}){
    p.methods = {
//        div: function(a, b){ return parseInt(a / b); },
//        fra: function(a){ return a - parseInt(a); },
        sum: function(n1, n2, n3, n){ for(var r = 0, a, l = (a = arguments).length; l; r += a[--l]); return r; },
        medium: function(n1, n2, n3, n4, n){ for(var r = 0, a, l = (a = arguments).length; l; r += a[--l]); return (r / a.length); }
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
