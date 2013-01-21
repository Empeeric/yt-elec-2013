var models = require('../models');
var youtube = require('youtube-feeds');
var cache = require('../cache');
youtube.timeout = 5000;

/*
 middle-wares
 */
var config_middleware = function(req, res, next){
    models
        .config
        .find()
        .exec(function(err, config){
            var o = {};
            config.forEach(function(con){
                o[con.key] = con.value;
            });

            req.config = o;
            next(err);
        })
};


var page = function(req, res, next){
    var id = req.query.id;
    var params = req.params[0];
    var query = models.navigation.findOne();

    if(id)
        query
            .or([{'_id': id}]);
    else
        query
            .or([{'url': params}]);

    query
        .where('show', true)
        .populate('template')
        .exec(function(err, page){
            if(page) req.page = page.toObject();
            next(err);
        })
};


var crumbs = function(req, res, next){
    var crumbs = [];

    var parent = function(id){
        models
            .navigation
            .findOne()
            .where('_id', id)
            .exec(function(err, page){
                if(page) {
                    crumbs.push(page.toObject());
                    parent(page.parent);
                }else{
                    req.crumbs = crumbs.reverse();
                    next()
                }

            })
    };

    if(req.page){
        req.page.last = true;
        crumbs.push(req.page);
        parent(req.page.parent);
    }
    else next();
};


var channel = function(req, res, next){
    if (!req.page) {
        next();
        return;
    }

    models.channels.findOne({'navigation': req.page._id}, function (err, channel) {
        if (channel) req.channel = channel;
        next();
    });
};


module.exports = function setup_module(app){
    // Register ReWrite rules.
    models.redirect.find({}, function (err, rewrite) {
        if (err) return;

        rewrite.forEach(function (rule) {
            var url = encodeURI(rule.route);
            app.get(url, function (_, res) {
                res.redirect(rule.status, rule.redirect);
            })
        });
    });


    app.get('/contacts', function(req, res){
        models.contact.find({}, function (err, contacts) {
            res.json(err || contacts)
        })
    });


    app.post('/thank-you', [config_middleware], function(req, res){
        var o = req.body;
        var to_save = Object.any(o, function(key, value){
            o[key] = value.stripTags().trim();
            return (o[key].length);
        });

        if (!to_save) {
            res.json({
                success: true,
                message: req.config.contact_success
            });
            return;
        }

        o.req = {
            headers: req.headers,
            session: req.session,
            ip: req.ip,
            date: Date.now()
        };
        var contact = new models.contact(o);
        contact.save(function (err) {
            res.json({
                success: !err,
                message: req.config[(err ? 'contact_fail' : 'contact_success')]
            });
        });
    });


    app.all('/youtube/playlist', function(req, res){
        var vars = req.body;
        var playlistid = vars.playlist;
        var cache_key = JSON.stringify(vars);
        var cached_data = cache.get(cache_key);
        if (cached_data) {
            console.log('/youtube/playlist cache hit');
            res.json(cached_data);
            return
        }
        youtube.feeds.playlist(playlistid, vars, function(err, data){
            if (err) {
                console.log('error - failed laoding playlins');
                res.json({});
            }
            cache.put(cache_key, data, 2 * 60 * 1000);
            res.json(data);
        });
    });


    app.all('/youtube/feeds', function(req, res){
        var original_size = req.body['max-results'];
        req.body['max-results'] = original_size + 4;
        youtube.feeds.videos(req.body, function(err, data) {
            data.items = data.items.filter(function(obj) {return obj.title != 'test1';}).slice(0, original_size);
            res.json(data);
        });
    });


    app.post('/users/content', function(req, res){
        req.body['start-index'] || (req.body['start-index'] = 1);
        req.body['max-results'] || (req.body['max-results'] = 12);

        var query = models
            .users_content
            .where('show', 1)
            .sort({order: -1});

        query.skip(req.body['start-index'] - 1)
            .limit(req.body['max-results'])
            .exec(function(err, content){

                query.count(function(err, count){
                    res.json({totalItems: count, items: content});
                });
            });
    });


    app.post('/trends', function(req, res){
        req.body['start-index'] || (req.body['start-index'] = 1);
        req.body['max-results'] || (req.body['max-results'] = 6);

        var query = models
            .trends
            .where('show', 1)
            .sort({order: -1});

        query.skip(req.body['start-index'] - 1)
            .limit(req.body['max-results'])
            .exec(function(err, trends){

                query.count(function(err, count){
                    res.json({totalItems: count, items: trends});
                });
            });
    });


    app.get('/google/news', function(req, res){
        res.type('xml');
        res.send(app.get('rss'));
    });


    //cms rules
    app.get('*', [config_middleware, page, crumbs, channel], function (req, res, next) {
        if(req.query.x) {
            res.redirect(req.query.x);
            return;
        }

        if (!req.page) {
            next();
            return;
        }

        var o = {};
        o.page = req.page;
        o.page.query = req.query;
        o.config = req.config || {};
        o.crumbs = req.crumbs || {};
        o.channel = req.channel || {};

        res.locals.development = app.get('env') == "development";
        res.render(req.page.template.title, o);
    });
};