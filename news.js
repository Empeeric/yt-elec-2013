var request = require('request'),
    models = require('./models');

module.exports = function(app){
    var rss = function(){
        models
            .config
            .findOne()
            .where('key', 'news_rss')
            .exec(function(err, rss){
                request(rss.value, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        app.set('rss', body);
                    }
                });
            });
    };

    rss();

    setInterval(rss, (1).hours());
};