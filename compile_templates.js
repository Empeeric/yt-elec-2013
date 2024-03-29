var dust = require('dustjs-linkedin'),
    path = require('path'),
    fs = require('fs');

var dir = path.join(__dirname, 'templates');

var writer = fs.createWriteStream(path.join(__dirname, 'public', 'resources', 'js', 'compiled_templates.js')),
    files = fs.readdirSync(dir);

for (var i = 0; i < files.length; i++) {
    var str = fs.readFileSync(path.join(dir, files[i]), 'utf8'),
        name = path.basename(files[i], '.html');

    writer.write(dust.compile(str, name));
}

console.log('%d dust templates compiled.', files.length);

writer.end();