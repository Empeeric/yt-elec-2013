(function($){
    $(function () {
        var v = new Videos();
        $.each(channel, function (key, value) {
            if (value === null) delete channel[key];
        });

        v.json = channel;

        var render_gallery = function (select) {
            dust.render('spinner', {}, function (err, html) {
                $('.gallery-container').append(html);
            });

            v.feeds().done(function () {
                dust.render('gallery', v.data, function (err, html) {
                    $('#circularG').remove();
                    $('.gallery').html(html);
                    if (select)
                        $('.gallery li:first a').click();
                })
            })
        };

        $('.gallery').on('click', 'a', function (e) {
            e.preventDefault();

            $('.gallery a.active').removeClass('active');
            $(this).addClass('active');

            $('.player').html('<iframe width="640" height="370" src="http://www.youtube.com/embed/' + $(this).data('id') + '" frameborder="0" allowfullscreen></iframe>')
        });

        $('.gallery-prev').on('click', function (e) {
            e.preventDefault();

            v.prev();
            render_gallery();
        });

        $('.gallery-next').on('click', function (e) {
            e.preventDefault();

            v.next();
            render_gallery();
        });

        render_gallery(true);
    })
})(jQuery);