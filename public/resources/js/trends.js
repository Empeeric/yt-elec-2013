(function($){
    $(function () {
        $.cloudinary.config("cloud_name", "hkf5hrwto");

        var v = new Trends();

        var render_trends_gallery = function (select) {
            dust.render('spinner', {}, function (err, html) {
                $('.trends-container').append(html);
            });

            v.content().done(function () {
                $.each(v.data.items, function(i, item){
                    item.picture && (item.picture.url = $.cloudinary.url(item.picture.public_id + '.' + item.picture.format,
                        { width: 120, height: 90,
                            crop: 'thumb'}));
                });

                dust.render('trends', v.data, function (err, html) {
                    $('#circularG').remove();

                    $('.trends ul').fadeOut('fast', function(){
                        $('.trends ul').html(html).fadeIn('fast', function(){
                            if (select)
                                $('.trends li:first a').click();
                        });
                    });
                })
            })
        };

        $('.trends ul').on('click', 'a', function (e) {
            e.preventDefault();

            $('.trends a.active').removeClass('active');
            $(this).addClass('active');

            if($(this).data('picture')) $('.trend').html('<img src="' + $.cloudinary.url($(this).data('picture'), { width: 640, height: 480, crop: 'limit'}) + '">');
        });

        $('.trends-prev').on('click', function (e) {
            e.preventDefault();

            v.prev();
            render_trends_gallery();
        });

        $('.trends-next').on('click', function (e) {
            e.preventDefault();

            v.next();
            render_trends_gallery();
        });

        render_trends_gallery(true);
    })
})(jQuery);