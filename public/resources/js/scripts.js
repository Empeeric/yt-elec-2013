(function($){
    var electionDate = new Date("Tue, 22 Jan 2013 22:00:00 GMT");

    $(function(){
        //init the timer
        $('#timer').countdown({until:electionDate,
            layout: '<div class="month">' +
                '<div class="digit">{dn}</div>' +
                '<br>{dl}' +
                '</div>' +
                '<div>' +
                '<div class="digit">{hnn}</div>' +
                '<br>{hl}' +
                '</div>' +
                '<div class="divider">:</div>' +
                '<div>' +
                '<div class="digit">{mnn}</div>' +
                '<br>{ml}' +
                '</div>' +
                '<div class="divider">:</div>' +
                '<div class="seconds">' +
                '<div class="digit">{snn}</div>' +
                '<br>{sl}' +
                '</div>'
        });

        var $sub_menu = $('.menu ul ul li'),
            top_zindex = $sub_menu.length;

        $sub_menu.each(function(){
           $(this).css('z-index', top_zindex--);
        });

        $('.parties ul').roundabout({
            shape: 'lazySusan'
        }, function(){
            $('.party_text').html($('.parties li:first').find('div').html());
        });

        $('.parties li').bind('focus', function(e){
            $('.party_text').html($(this).find('div').html());
        });

        var trends = $('.trends li').clone();

        $('.trend').append(
            $('<img/>').attr('src', $('.trends li:first').data('picture'))
        );

        $('.trends li:first').remove();

        $('.trends li').each(function(){
            var self = this;
            $(self).append(
                $('<img/>').attr('src', $(self).data('history'))
            );
        });

        var v = new Videos();

        v.json = {author: 'ynet'};

        var render_gallery = function(select){
            v.feeds().done(function(){
                console.log(v.data);
                dust.render('gallery', v.data, function(err, html){
                    $('.gallery').html(html);
                    if(select)
                        $('.gallery li:first a').click();
                })
            })
        };

        $('.gallery').on('click', 'a', function(e){
            e.preventDefault();

            $('.gallery a.active').removeClass('active');
            $(this).addClass('active');

            $('.player').html('<iframe width="640" height="370" src="http://www.youtube.com/embed/'+ $(this).data('id') +'" frameborder="0" allowfullscreen></iframe>')
        });

        $('.gallery-prev').on('click', function(e){
            e.preventDefault();

            v.prev();
            render_gallery();
        });

        $('.gallery-next').on('click', function(e){
            e.preventDefault();

            v.next();
            render_gallery();
        });

        render_gallery(true);
    })
})(jQuery);

(function($){
    var Videos = window.Videos = function(){
        this.data = {};
        this.json = {};
        this.page = 1;
        this.pages = 0;
        this.items_per_page = 12;
        this.total_items = 0;
    };

    Videos.prototype.feeds = function(){
        var self = this;

        var json = $.extend(self.json, {'max-results': self.items_per_page, 'start-index': ((self.page - 1) * self.items_per_page) + 1});

        return $.postJSON('/youtube/feeds', json , function(data){
            self.total_items = data.totalItems;
            self.pages = Math.ceil(self.total_items / self.items_per_page);

            self.data = data;
        });
    };

    Videos.prototype.next = function(){
        this.page++;
        if(this.page > this.pages) this.page = 1;
    };

    Videos.prototype.prev = function(){
        this.page--;
        if(this.page <= 0) this.page = this.pages;
    };
})(jQuery);



