$(document).ready(function () {

    var INDEX = 0;
    var INDEX_CURRENT = 0;

    var $sliderWrap = $('.mt-slider-wrap');
    var $listIndicator = $('.mt-slider-indicator li a');
    var $listWrap = $('.mt-slider-wrap li');

    var _listItemWidth = $listWrap.eq(0).width();
    var _listItemHeight = $listWrap.eq(0).height();


    function init() {

        $('.mt-slider-wrap').css({
            'width': _listItemWidth * $listWrap.length + 'px',
            'height': _listItemHeight + 'px'
        });
        $('.mt-slider').css({
            'width': _listItemWidth + 'px',
            'height': _listItemHeight + 'px'
        });
    }

    function reset() {

        if (INDEX_CURRENT === 0) {
            $listWrap.eq(0).css({
                'position': 'static'
            });

            $sliderWrap.css({
                'left': '0'
            });

            INDEX = 0;

        }

    }

    function run() {

        if (INDEX_CURRENT === ($listWrap.length - 1)) {

            $listWrap.eq(0).css({
                'position': 'relative',
                'left': _listItemWidth * $listWrap.length + 'px'
            });

            INDEX_CURRENT = 0;

        } else {

            INDEX_CURRENT++;
        }

        INDEX++;
                
        // set indicator
        $listIndicator.each(function (i) {
            $listIndicator.eq(i).removeClass('active');
        });

        $listIndicator.eq(INDEX_CURRENT).addClass('active');
        
                
        // move
        var offset = -_listItemWidth * INDEX + 'px';
        move('#slider .mt-slider-wrap').set('left', offset).then(reset).end();

    };

    (function () {
        init();
        setInterval(run, 3000);
    })();


});