(function($){
        $.countdown.regional['he'] = {
            labels:['שנים', 'חודשים', 'שבועות', 'ימים', 'שעות', 'דקות', 'שניות'],
            labels1:['שנה', 'חודש', 'שבוע', 'יום', 'שעה', 'דקה', 'שנייה'],
            compactLabels:['שנ', 'ח', 'שב', 'י'],
            whichLabels:null,
            digits:['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            timeSeparator:':', isRTL:true};
        $.countdown.setDefaults($.countdown.regional['he']);
        var electionDate = new Date();
        debugger;
        electionDate = new Date(2013, 1, 22, 22, 0, 0, 0);
        $('#timer').countdown({until:electionDate,
            layout: '<div class="month">' +
                '<div class="digit">{dn}</div>' +
                '<br>{dl}' +
                '</div>' +
                '<div>' +
                '<div class="digit">{hn}</div>' +
                '<br>{hl}' +
                '</div>' +
                '<div class="divider">:</div>' +
                '<div>' +
                '<div class="digit">{mn}</div>' +
                '<br>{ml}' +
                '</div>' +
                '<div class="divider">:</div>' +
                '<div class="seconds">' +
                '<div class="digit">{sn}</div>' +
                '<br>{sl}' +
                '</div>'
        });
    })(jQuery);



