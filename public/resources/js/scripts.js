(function($){
    var electionDate = new Date(2013, 1, 22, 22, 0, 0, 0);

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

        $('.gallery a').on('click', function(e){
            e.preventDefault();

            $('.player').html('<iframe width="640" height="370" src="http://www.youtube.com/embed/'+ $(this).data('id') +'" frameborder="0" allowfullscreen></iframe>')

        });

        if($('.gallery')) $('.gallery li:first a').click();

    })
})(jQuery);



