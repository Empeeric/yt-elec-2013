/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path');
var logger = require('./logger');
// add some sugar baby
require('sugar');

var app = module.exports = express();

app.configure(function(){
    app.set('cloudinary', process.env.CLOUDINARY_URL);
    app.set('port', process.env.PORT);
    app.set('mongo', process.env.MONGOLAB_URI);
    app.set('admin', {username: 'admin', password: process.env.ADMIN_PASSWORD});
    app.set('site', 'Ynet Youtube 2013 election');

    app.engine('html', require('consolidate').dust);
    app.set('view engine', 'html');
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.compress());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('magical secret ynet youtube 2013'));
    app.use(express.cookieSession({cookie: { maxAge: (20).minutes() }}));

    app.use(express.static(path.join(__dirname, 'public')));
    app.use(logger.logger_middleware);

    require('./admin')(app);

    app.use(app.router);

    app.use(function(req, res, next){
        res.status(404);
        res.render('404', {title: 'The page cannot be found', content: '<p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p><hr><p>Please try the following:</p><ul><li>Make sure that the Web site address displayed in the address bar of your browser is spelled and formatted correctly.</li><li>If you reached this page by clicking a link, contact the Web site administrator to alert them that the link is incorrectly formatted.</li><li>Click the <a href="javascript:history.back(1)">Back</a> button to try another link.</li></ul><h2>HTTP Error 404 - File or directory not found.</h2><hr>'});
    });

    app.use(logger.catch_all_middleware);
    app.use(logger.domain_wrapper_middleware);
});

logger.register_process_catcher();

app.configure('development', function(){
    app.use(express.errorHandler());
});

require('./dust/helpers');
require('./dust/filters');
require('./mongoose/helpers');
require('./compile_templates.js');

require('mongoose').connect(app.get('mongo'));
require('./news')(app);
require('./routes')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
