(function($){
    $('a[href="'+ decodeURIComponent(location.pathname) +'"]').addClass('active');

    var electionDate = new Date("Tue, 22 Jan 2013 05:00:00 GMT");

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

        var $sub_menu_tree = $('.menu ul ul'),
            $sub_menu_copy =$sub_menu_tree.clone(),
            $sub_menu = $sub_menu_copy.find('li');
            top_zindex = $sub_menu.length;

        $sub_menu_tree.remove();
        $('.menu').append($sub_menu_copy);

        $sub_menu.each(function(){
           $(this).css('z-index', top_zindex--);
        });

        $sub_menu_copy.show();

        $('.parties ul').roundabout({
            tilt: -4,
            duration: 400,
            btnNext: '.parties-next',
            btnPrev: '.parties-prev'
        }, function(){
            $('.parties').show();
            $('.party_text').html($('.parties li:first').find('div').html());
        });

        $('.parties li').bind('focus', function(e){
            $('.party_text').html($(this).find('div').html());
        });
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

        var json = $.extend({'max-results': self.items_per_page, 'start-index': ((self.page - 1) * self.items_per_page) + 1}, self.json);

        console.log('JSON', json);

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


(function($){

    $.get('/google/news', function(doc, status){
        var news = [];
        $(doc).find('item').each(function(){
            var o = {
                title: $(this).find('title').text(),
                url: $(this).find('link').text()
            };

            news.push(o);
        });

        $(function(){

            dust.render('news', news, function(err, html){
                $('.news-ticker div').append(html);
            });

            //news ticker
            setInterval(function(){
                $('.news-ticker li:first').slideUp( function () { $(this).appendTo($('.news-ticker ul')).slideDown(); });
            }, 5000);
        });

    })
})(jQuery);



