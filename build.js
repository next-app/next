const fs = require('fs');
const omelet = require('omeletjs');

const toWrite = ["var templates = {};"];

function compile(path, templateName) {
    const tpl = omelet.compileFile(path, {
        templateName: ""
    });

    toWrite.push("templates." + templateName + " = " + tpl.toString() + ";")
}

function render(path, outputPath) {
    const html = omelet.renderFile(path, {
        states: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA",
                 "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
                 "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
                 "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
                 "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]
    }, {});

    fs.writeFileSync(outputPath, html, 'UTF-8');
}

// static HTML files can be written now
var outputDir = 'public/';
render('templates/home.omelet', outputDir + 'index.html');
render('templates/address.omelet', outputDir + 'address.html');
render('templates/representatives.omelet', outputDir + 'representatives.html');
render('templates/elections.omelet', outputDir + 'elections.html');
render('templates/learn-more.omelet', outputDir + 'learn-more.html');


// dynamic templates get compiled into JS so they can be rendered later
compile('templates/reps-view.omelet', 'repsView');
fs.writeFileSync('public/assets/compiled-templates.js', toWrite.join('\n'), 'UTF-8');

// temporarily, we store a serve a JSON response like this:
const responseJson = require('./public/assets/sample_reps_by_address.json');
const response = "var response1 = '" + JSON.stringify(responseJson).replace('\'', '\\\'') + "';";

fs.writeFileSync('public/assets/temporary-responses.js', response, 'UTF-8');
