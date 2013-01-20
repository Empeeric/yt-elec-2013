(function($){
    $(function () {
        $.cloudinary.config("cloud_name", "hkf5hrwto");

        var v = new Users();
        var render_content_gallery = function (select) {
            dust.render('spinner', {}, function (err, html) {
                $('.gallery-container').append(html);
            });

            v.content().done(function () {
                $.each(v.data.items, function(i, item){
                    item.picture && (item.picture.url = $.cloudinary.url(item.picture.public_id + '.' + item.picture.format,
                        { width: 120, height: 90,
                            crop: 'thumb'}));
                });

                dust.render('users', v.data, function (err, html) {
                    $('#circularG').remove();

                    $('.gallery').fadeOut('fast', function(){
                        $('.gallery').html(html).fadeIn('fast', function(){
                            if (select)
                                $('.gallery li:first a').click();
                        });
                    });
                })
            })
        };

        $('.gallery').on('click', 'a', function (e) {
            e.preventDefault();

            $('.gallery a.active').removeClass('active');
            $(this).addClass('active');

            if($(this).data('youtube')) $('.player').html('<iframe width="640" height="370" src="http://www.youtube.com/embed/' + $(this).data('youtube') + '?autoplay=1" frameborder="0" allowfullscreen></iframe>');
            if($(this).data('picture')) $('.player').html('<img src="' + $.cloudinary.url($(this).data('picture'), { width: 640, height: 370, crop: 'limit'}) + '">');
        });


        $('.gallery').on('click', 'li b', function(e){
            e.preventDefault();
            e.stopPropagation();

            window.open($(this).closest('a').attr("href"));
        });

        $('.gallery-prev').on('click', function (e) {
            e.preventDefault();

            v.prev();
            render_content_gallery();
        });

        $('.gallery-next').on('click', function (e) {
            e.preventDefault();

            v.next();
            render_content_gallery();
        });

        render_content_gallery(true);
    })
})(jQuery);