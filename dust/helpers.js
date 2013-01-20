var dust = require('dustjs-helpers'),
    youtube = require('youtube-feeds'),
    models = require('../models');

dust.helpers['cloudinary'] = function (chunk, context, bodies, params) {
    context = params && params.path ? context.get(params.path) : context.current();

    if(!(context && context.public_id)) return chunk;

    params.format = params.format || context.format;

    return chunk.write(
        require('cloudinary').url(
            context.public_id, params
        )
    )
};

dust.helpers['landing'] = function(chunk, context, bodies, params){
    return chunk.map(function(chunk) {
    models
        .navigation
        .findOne()
        .where('show', true)
        .where('menu', true)
        .where('parent', context.get('page')._id)
        .sort({order: 1})
        .exec(function(err, sub){
            chunk.write(sub.url);
            chunk.end();
        });
    });
};

dust.helpers['feeds'] = function(chunk, context, bodies, params) {
    return chunk.map(function(chunk) {

        youtube.feeds.videos(params, function(data){
            context = context.push(data);
            chunk.render(bodies.block, context);
            chunk.end();
        });

    })
};

dust.helpers['trends'] = function(chunk, context, bodies) {
    return chunk.map(function(chunk) {
        models
            .trends
            .where('show', 1)
            .sort({order: 1})
            .exec(function(err, trends){
                trends.forEach(function(trend){
                    context = context.push(trend);
                    chunk.render(bodies.block, context)
                });
                chunk.end();
            })
    })
};

dust.helpers['menu'] = function(chunk, context, bodies) {
    var page = context.get('page'),
        crumbs = context.get('crumbs'),
        items = [];

    return chunk.map(function(chunk) {
        models
            .navigation
            .where('show', true)
            .where('menu', true)
            .sort({order: 1, parent: 1})
            .exec(function(err, menu) {
                if (err) throw err;

                menu.forEach(function(item){
                    item = item.toObject();
                    items.push(item);
                });

                //create children tree
                var itemsChild = items.filter(function (item) { return item.parent; });
                itemsChild.forEach(function(item){
                    items.forEach(function(parent){
                        if(parent._id.id == item.parent.id){
                            if(parent.child){
                                parent.child.push(item);
                            } else {
                                parent.child = [];
                                parent.child.push(item);
                            }
                        }
                    });
                });
                var itemsTop = items.filter(function (item) { return !item.parent; });
                itemsTop.forEach(function(item){
                    item.dock = (crumbs[0]._id.toString() === item._id.toString());
                    context = context.push(item);
                    chunk.render(bodies.block, context)
                });

                chunk.end();
            })
    })
};

dust.helpers['content'] = function(chunk, context, bodies, params) {
    params || (params = {});

    var config = context.get('config'),
        page = context.get('page'),
        items = [];

    return chunk.map(function(chunk) {
        var query = models
                .content
                    .where('show', true)
                    .where('navigation', page._id)
                    .sort({order: 1})
                    .populate('url');

        models.content.paginate(query, page.query.page, params.records, function(err, content, count, pages){
            params.records || (params.records = count);

            content.forEach(function(item){
                //rendering custom context from config
                if(item.text) {
                    dust.loadSource(dust.compile(item.text, "content_template"));
                    dust.render('content_template', config, function(err, text){
                        item.text = text;
                        items.push(item);
                    });
                }else{
                    items.push(item);
                }
            });

            context = context.push({pages: pages || 0, count: count, items: items, records: params.records});
            chunk.render(bodies.block, context);

            chunk.end();

        });
    })
};

dust.helpers.truncate = function(chunk, context, bodies, params) {
    var options = {
        length: 20,
        split: true,
        from: 'right',
        ellipsis: '...'
    };
    Object.merge(options, params);

    options.split = (options.split != 'false');

    return chunk.tap(function(data) {
        return data.truncate(options.length, options.split, options.from, options.ellipsis);
    }).render(bodies.block, context).untap();
};

// TODO: it's ugly now
dust.helpers.paging = function(chunk, context, bodies, params){
    params || (params = {});
    var page = context.get('page');

    var count = params.count;
    var display = params.display || 5;
    var records = params.records;
    var current = page.query.page && page.query.page.toNumber().abs() || 1;
    var start, end, pages;
    var old_display = (display % 2 == 0) ? 1 : 0, i, half;
    var result = {
        prelink : params.link || '?page=',
        current : current,
        previous : null,
        next : null,
        first : null,
        last : null,
        range : [],
        from : null,
        to : null,
        total : count,
        pages : null
    };
    /* zero division; negative */
    if(records <= 0) {
        return chunk.render(bodies.block, context.push(result));
    }
    pages = (count / records).ceil();
    result.pages = pages;
    if(pages < 2) {
        result.from = 1;
        result.to = count;
        return chunk.render(bodies.block, context.push(result));
    }

    if(current > pages) {
        current = pages;
        result.current = current;
    }
    half = (display / 2).floor();
    start = current - half;
    end = current + half - old_display;

    if(start < 1) {
        start = 1;
        end = start + display;
        if(end > pages) {
            end = pages;
        }
    }

    if(end > pages) {
        end = pages;
        start = end - display + 1;
        if(start < 1) {
            start = 1;
        }
    }

    for( i = start; i <= end; i++) {
        result.range.push(i);
    }

    if(current > 1) {
        result.first = 1;
        result.previous = current - 1;
    }

    if(current < pages) {
        result.last = pages;
        result.next = current + 1;
    }

    result.from = (current - 1) * records + 1;
    if(current == pages) {
        result.to = count;
    } else {
        result.to = result.from + records - 1;
    }

    return chunk.render(bodies.block, context.push(result));
};



