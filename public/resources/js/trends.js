(function ($) {
    setTimeout(function() {
        $('.trends-container ul li:first a').click()
    }, 0);

    $('.trends-container ul li a').on('click', function (e) {
        e.preventDefault();

        $('.trends-container a.active').removeClass('active');
        $(this).addClass('active');

        $('.trend').html('<img src="' + $(this).attr('href') + '" />')
    });

    $('.gallery-prev').on('click', function (e) {
        e.preventDefault();
    });

    $('.gallery-next').on('click', function (e) {
        e.preventDefault();
    });
})(jQuery);