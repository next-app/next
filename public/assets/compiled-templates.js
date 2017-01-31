var templates = {};
templates.repsView = function omelet(omelet$ctx){
var omelet$out="",om$var_7=0,filters={prepend:function prepend(input, str) {
    return '' + str + input
},append:function append(input, str) {
    return '' + input + str
},},runtime={Scope:function Scope() {
    var env = [{}]

    this.open = function() {
        env.push({})
    }
    this.close = function() {
        env.pop()
    }
    this.add = function(key, value) {
        if (env[env.length - 1][key]) {
            throw runtime.buildError(
                'Runtime error',
                'Variable \'' + key + '\' is already defined in this scope.',
                0, '', '')
        }
        env[env.length - 1][key] = value
    }
    this.addAll = function(obj) {
        var keys = Object.keys(obj)
        for (var i = 0; i < keys.length; i++) {
            this.add(keys[i], obj[keys[i]])
        }
    }
    this.find = function(key, throwOnUndefinedVariable) {
        var modifiers = Array.prototype.slice.call(arguments, 2)
        for (var i = env.length - 1; i >= 0; i--) {
            for (var k in env[i]) {
                if (k === key) {
                    if (modifiers.length === 0) {
                        return env[i][key]
                    }
                    var val = env[i][key]
                    for (var j = 0; j < modifiers.length; j++) {
                        var newVal = val[modifiers[j]]
                        if (typeof newVal === 'undefined') {
                            if (throwOnUndefinedVariable) {
                                throw runtime.buildError(
                                    'Runtime error',
                                    'Could not access undefined property \'' + modifiers[j] + '\' of object.',
                                    0, '', '')
                            } else {
                                return undefined
                            }
                        }
                        val = newVal
                    }
                    return val
                }
            }
        }
        if (throwOnUndefinedVariable) {
            throw runtime.buildError(
                'Runtime error',
                'Variable \'' + key + '\' is not defined or not in scope.',
                0, '', '')
        }

        return undefined
    }
},typeOf:function typeOf(obj) {
    return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1]
},htmlEscape:function htmlEscape(str) {
    return ('' + str).replace(/[&><\"\']/g, function(chr) {
        switch (chr) {
            case '"': return '&quot;'
            case '&': return '&amp;'
            case '<': return '&lt;'
            case '>': return '&gt;'
            case '\'': return '&apos;'
        }
    })
},applyFilters:function applyFilters(input, seq, fileName, source, line) {
    var output = input
    var filterSeq = seq.slice()

    for (var i = 0; i < filterSeq.length; i++) {
        var filterName = filterSeq[i][0]
        var filterArgs = filterSeq[i][1]
        filterArgs.unshift(output)
        try {
            output = filters[filterName].apply(null, filterArgs)
        } catch (e) {
            var err = runtime.buildError(
                'Filter error',
                e.message || 'Could not apply filter \'' + filterName + '\'.',
                line, source, fileName)
            throw err
        }
        filterArgs.shift()
    }

    return output
},buildError:function buildError(name, message, line, src, file) {
    var fullMessage

    var lines = src.split('\n')
    var start = line - 3 > 0 ? line - 3 : 0
    var end = lines.length > line + 3 ? lines.length : line + 3
    var context = lines.slice(start, end).map(function(text, i) {
        var curr = i + start + 1
        var preamble = (curr === line
                            ? '  > ' + curr + '| '
                            : '    ' + curr + '| ')
        var out = preamble + text
        return out
    }).join('\n')

    file = file ? '\'' + file + '\'' : 'input'
    fullMessage = name + ' on line ' + line + ' of ' + file + '.\n\n' +
                    context + '\n\n' +
                    message + '\n'

    var err = new Error(fullMessage)
    err.name = 'Omelet'
    err.msg = message
    err.line = line
    err.file = file
    err.src = src
    err.stack = ''
    return err
},truthy:function truthy(obj) {
    return (obj !== false && obj !== null &&
            obj !== '' && typeof obj !== 'undefined')
},falsy:function falsy(obj) {
    return (obj === false || obj === null ||
            obj === '' || typeof obj === 'undefined')
},},omelet$ctx=omelet$ctx||{},omelet$scope=new runtime.Scope(),omelet$source="+render-official official =\r\n    @section.official\r\n        @div.official-details\r\n            @h3\r\n                {official.name}\r\n                >if official.party\r\n                    +party = {official.party | prepend \" (\" | append \")\"}\r\n                    {party}\r\n            >if official.phones\r\n                @div.info-list\r\n                    @h4 phone numbers\r\n                    @ul\r\n                        >for phone in official.phones\r\n                            @li {phone}\r\n            >if official.emails\r\n                @div.info-list\r\n                    @h4 email addresses\r\n                    @ul\r\n                        >for email in official.emails\r\n                            @li|a[href={email | prepend \"mailto:\"}] {email}\r\n            >if official.links\r\n                @div.info-list\r\n                    @h4 links\r\n                    @ul\r\n                        >for link in official.links\r\n                            @li\r\n                                {link.type}:\r\n                                @a[href={link.url}] {link.url}\r\n\r\n@div.expanders-wrapper\r\n    >for division in divisions\r\n        @section.division.expander\r\n            @button.expander-header\r\n                @div.expander-header-left\r\n                    @div.expander-icon.default &#9654;\r\n                @div.expander-header-right\r\n                    @span.expander-type division - {division.type}\r\n                    @h1 {division.name}\r\n            @div.expander-content.collapsed\r\n                >for office in division.offices\r\n                    @section.office.expander\r\n                        @button.expander-header\r\n                            @div.expander-header-left\r\n                                @div.expander-icon.default &#9654;\r\n                            @div.expander-header-right\r\n                                @h2 {office.name}\r\n                        @div.expander-content.collapsed\r\n                            >for official in office.officials\r\n                                {render-official official}\r\n";
omelet$scope.addAll(omelet$ctx);
omelet$out+="";
omelet$scope.add("render-official",function(args){omelet$scope.open();
omelet$scope.add("official",args[0]||args["official"]);
var ret="\n<section class=\"official\">";
omelet$scope.open();
ret+="\n  \n  <div class=\"official-details\">";
omelet$scope.open();
ret+="\n    \n    <h3>";
omelet$scope.open();
ret+="\n      "+runtime.htmlEscape(omelet$scope.find("official", true ,"name"))+"";
if(runtime.truthy(omelet$scope.find("official", false ,"party"))) {
omelet$scope.open();
;
ret+="";
omelet$scope.add("party",(function(){omelet$scope.open();
var ret=""+runtime.htmlEscape(runtime.applyFilters(omelet$scope.find("official", true ,"party"),[["prepend",[" ("]],["append",[")"]]],"reps-view.omelet",omelet$source,7))+"";
omelet$scope.close();
return ret;
})());
ret+=""+runtime.htmlEscape(omelet$scope.find("party", true))+"";
omelet$scope.close();
}
;
ret+="";
omelet$scope.close();
ret+="\n    </h3>";
if(runtime.truthy(omelet$scope.find("official", false ,"phones"))) {
omelet$scope.open();
;
ret+="\n    <div class=\"info-list\">";
omelet$scope.open();
ret+="\n      \n      <h4>phone numbers</h4>\n      <ul>";
omelet$scope.open();
ret+="\n        ";
for (var om$var_1= 0;om$var_1 <omelet$scope.find("official", true ,"phones").length;om$var_1++){
omelet$scope.open();
omelet$scope.add("phone",omelet$scope.find("official", true ,"phones")[om$var_1]);
;
ret+="\n        <li>"+runtime.htmlEscape(omelet$scope.find("phone", true))+"</li>\n        ";
omelet$scope.close();
}
;
ret+="";
omelet$scope.close();
ret+="\n      </ul>";
omelet$scope.close();
ret+="\n    </div>";
omelet$scope.close();
}
;
ret+="";
if(runtime.truthy(omelet$scope.find("official", false ,"emails"))) {
omelet$scope.open();
;
ret+="\n    <div class=\"info-list\">";
omelet$scope.open();
ret+="\n      \n      <h4>email addresses</h4>\n      <ul>";
omelet$scope.open();
ret+="\n        ";
for (var om$var_2= 0;om$var_2 <omelet$scope.find("official", true ,"emails").length;om$var_2++){
omelet$scope.open();
omelet$scope.add("email",omelet$scope.find("official", true ,"emails")[om$var_2]);
;
ret+="\n        <li><a href=\""+runtime.htmlEscape(runtime.applyFilters(omelet$scope.find("email", true),[["prepend",["mailto:"]]],"reps-view.omelet",omelet$source,20))+"\">"+runtime.htmlEscape(omelet$scope.find("email", true))+"</a></li>\n        ";
omelet$scope.close();
}
;
ret+="";
omelet$scope.close();
ret+="\n      </ul>";
omelet$scope.close();
ret+="\n    </div>";
omelet$scope.close();
}
;
ret+="";
if(runtime.truthy(omelet$scope.find("official", false ,"links"))) {
omelet$scope.open();
;
ret+="\n    <div class=\"info-list\">";
omelet$scope.open();
ret+="\n      \n      <h4>links</h4>\n      <ul>";
omelet$scope.open();
ret+="\n        ";
for (var om$var_3= 0;om$var_3 <omelet$scope.find("official", true ,"links").length;om$var_3++){
omelet$scope.open();
omelet$scope.add("link",omelet$scope.find("official", true ,"links")[om$var_3]);
;
ret+="\n        <li>";
omelet$scope.open();
ret+="\n          "+runtime.htmlEscape(omelet$scope.find("link", true ,"type"))+":\n          <a \n          href=\""+runtime.htmlEscape(omelet$scope.find("link", true ,"url"))+"\">"+runtime.htmlEscape(omelet$scope.find("link", true ,"url"))+"</a>";
omelet$scope.close();
ret+="\n        </li>\n        ";
omelet$scope.close();
}
;
ret+="";
omelet$scope.close();
ret+="\n      </ul>";
omelet$scope.close();
ret+="\n    </div>";
omelet$scope.close();
}
;
ret+="";
omelet$scope.close();
ret+="\n  </div>";
omelet$scope.close();
ret+="\n</section>";
omelet$scope.close();
return ret;
});
omelet$out+="\n<div class=\"expanders-wrapper\">";
omelet$scope.open();
omelet$out+="\n  ";
for (var om$var_4= 0;om$var_4 <omelet$scope.find("divisions", true).length;om$var_4++){
omelet$scope.open();
omelet$scope.add("division",omelet$scope.find("divisions", true)[om$var_4]);
;
omelet$out+="\n  <section class=\"division expander\">";
omelet$scope.open();
omelet$out+="\n    \n    <button class=\"expander-header\">";
omelet$scope.open();
omelet$out+="\n      \n      <div class=\"expander-header-left\">";
omelet$scope.open();
omelet$out+="\n        \n        <div class=\"expander-icon default\">&#9654;</div>";
omelet$scope.close();
omelet$out+="\n      </div>\n      <div class=\"expander-header-right\">";
omelet$scope.open();
omelet$out+="\n        \n        <span class=\"expander-type\">division - "+runtime.htmlEscape(omelet$scope.find("division", true ,"type"))+"</span>\n        <h1>"+runtime.htmlEscape(omelet$scope.find("division", true ,"name"))+"</h1>";
omelet$scope.close();
omelet$out+="\n      </div>";
omelet$scope.close();
omelet$out+="\n    </button>\n    <div class=\"expander-content collapsed\">";
omelet$scope.open();
omelet$out+="\n      ";
for (var om$var_5= 0;om$var_5 <omelet$scope.find("division", true ,"offices").length;om$var_5++){
omelet$scope.open();
omelet$scope.add("office",omelet$scope.find("division", true ,"offices")[om$var_5]);
;
omelet$out+="\n      <section class=\"office expander\">";
omelet$scope.open();
omelet$out+="\n        \n        <button class=\"expander-header\">";
omelet$scope.open();
omelet$out+="\n          \n          <div class=\"expander-header-left\">";
omelet$scope.open();
omelet$out+="\n            \n            <div class=\"expander-icon default\">&#9654;</div>";
omelet$scope.close();
omelet$out+="\n          </div>\n          <div class=\"expander-header-right\">";
omelet$scope.open();
omelet$out+="\n            \n            <h2>"+runtime.htmlEscape(omelet$scope.find("office", true ,"name"))+"</h2>";
omelet$scope.close();
omelet$out+="\n          </div>";
omelet$scope.close();
omelet$out+="\n        </button>\n        <div class=\"expander-content collapsed\">";
omelet$scope.open();
omelet$out+="\n          ";
for (var om$var_6= 0;om$var_6 <omelet$scope.find("office", true ,"officials").length;om$var_6++){
omelet$scope.open();
omelet$scope.add("official",omelet$scope.find("office", true ,"officials")[om$var_6]);
;
omelet$out+=""+omelet$scope.find("render-official", true)({0:omelet$scope.find("official", true)})+"\n          ";
omelet$scope.close();
}
;
omelet$out+="";
omelet$scope.close();
omelet$out+="\n        </div>";
omelet$scope.close();
omelet$out+="\n      </section>\n      ";
omelet$scope.close();
}
;
omelet$out+="";
omelet$scope.close();
omelet$out+="\n    </div>";
omelet$scope.close();
omelet$out+="\n  </section>\n  ";
omelet$scope.close();
}
;
omelet$out+="";
omelet$scope.close();
omelet$out+="\n</div>";
return omelet$out.replace(/\n[ ]*\n/g, "\n").replace(/^\s+|\s+$/g, "");};