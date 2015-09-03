$(document).ready(function () {

    function mtSlider(options) {
        
        // scope
        var scope = this;

        // varialbes                
        var INDEX = 0;
        var INDEX_MAX = 0;
        var INDEX_CURRENT = 0;

        // flag
        var INTERACTIVING_USER = false;
        var INTERACTIVING_INTERVAL = false;

        // timeintercal
        var timeInterval = {};

        // jquery
        var $sliderWrap = $('.mt-slider-wrap');
        var $listIndicator = $('.mt-slider-indicator a');
        var $listWrap = $('.mt-slider-wrap li');

        // props
        var _listItemWidth = $listWrap.eq(0).width();
        var _listItemHeight = $listWrap.eq(0).height();
        
        // options
        
        var defaultOptions = {
            autoLoop: false
        };

        var currentOptions = $.extend(defaultOptions, options);
        
        /**
         * prepare
         *      prepare dom & set size & so on.
         * 
         * @{retrun}:       void;
         */
        function prepare() {

            INDEX_MAX = $listWrap.length - 1;

            $('.mt-slider-wrap').css({
                'width': _listItemWidth * $listWrap.length + 'px',
                'height': _listItemHeight + 'px'
            });
            $('.mt-slider').css({
                'width': _listItemWidth + 'px',
                'height': _listItemHeight + 'px'
            });

            $listIndicator.each(function (index) {
                $listIndicator.eq(index).attr('data-mt-slider-index', index);
            })

        }

        /**
         * activeIndicator
         *      set indicator
         * 
         * @{retrun}:       void;
         */
        function activeIndicator() {
            $listIndicator.each(function (i) {
                $listIndicator.eq(i).removeClass('active');
            });

            $listIndicator.eq(INDEX_CURRENT).addClass('active');
        }

        /**
         * moveSlider
         *      move slider to left or right
         * @{direction}:    left|right {string}
         * @{retrun}:       void;
         */
        function moveSlider(direction, targetIndex) {
           
            //  if action not complete, reutrn
            if (INTERACTIVING_USER) {
                return;
            }
            
            // set protection;
            INTERACTIVING_USER = true;

            // reset position
            function reset() {

                if (direction === 'left') {

                    if (INDEX_CURRENT === INDEX_MAX) {
                        $listWrap.eq(INDEX_MAX).css({
                            'position': 'static'
                        });

                        $sliderWrap.css({
                            'left': -_listItemWidth * INDEX_MAX + 'px'
                        });

                        INDEX = INDEX_MAX;
                    }
                    return;
                }

                if (direction === 'right') {

                    if (INDEX_CURRENT === 0) {
                        $listWrap.eq(0).css({
                            'position': 'static'
                        });

                        $sliderWrap.css({
                            'left': '0'
                        });

                        INDEX = 0;

                    }
                    return;
                }

            }
            
            // run the move
            function run() {

                console.log(INDEX, INDEX_CURRENT);
          
                // active indicator
                activeIndicator();
            
                // move slider
                var offset = -_listItemWidth * INDEX + 'px';

                move('#slider .mt-slider-wrap')
                    .set('left', offset)
                    .then(reset)
                    .then(function () {
                        // remove protection
                        INTERACTIVING_USER = false;
                        
                        // 
                        if (currentOptions.autoLoop && INTERACTIVING_INTERVAL && !!setTimeInterval && (typeof setTimeInterval === 'function')) {
                            setTimeInterval();
                            INTERACTIVING_INTERVAL = false;
                        }
                    })
                    .end();
            }
                
            // conditions for slide direction
            switch (direction) {

                case 'left':

                    // for special target
                    if (typeof targetIndex !== 'undefined') {

                        switch (targetIndex) {

                            case INDEX_MAX:

                                INDEX_CURRENT = 0;
                                INDEX = INDEX_MAX + 1;
                                reset();
                                break;

                            default:
                                INDEX_CURRENT = INDEX = targetIndex + 1;
                                break;
                        }

                    }  
                    
                    // left
                    if (INDEX_CURRENT === 0) {

                        $listWrap.eq(INDEX_MAX).css({
                            'position': 'relative',
                            'left': -_listItemWidth * $listWrap.length + 'px'
                        });

                        INDEX_CURRENT = INDEX_MAX;

                    } else {
                        --INDEX_CURRENT;
                    }

                    --INDEX;
                    run();

                    break;

                case 'right':
                
                    // for special target
                    if (typeof targetIndex !== 'undefined') {

                        switch (targetIndex) {
                            case 0:

                                INDEX_CURRENT = INDEX = INDEX_MAX;
                                break;

                            case 1:

                                INDEX_CURRENT = 0;
                                INDEX = INDEX_MAX + 1;
                                reset();
                                break;

                            default:
                                INDEX_CURRENT = INDEX = targetIndex - 1;
                                break;
                        }

                    }  
            
                    // right
                    if (INDEX_CURRENT === ($listWrap.length - 1)) {
                        $listWrap.eq(0).css({
                            'position': 'relative',
                            'left': _listItemWidth * $listWrap.length + 'px'
                        });

                        INDEX_CURRENT = 0;

                    } else {
                        ++INDEX_CURRENT;
                    }

                    ++INDEX;
                    run();

                    break;

                default:
                    console.log('default');
                    break;
            }

        }
        
        /**
         * setTimeInterval 
         *      set interval to auto slide
         * 
         * @{return}:       void; 
         */
        function setTimeInterval() {
            if (currentOptions.autoLoop) {
                timeInterval = setInterval(function () {
                    moveSlider('right');
                }, 10000);
            }
        }
        
        /**
         * clearTimeInterval 
         *      clear auto slide interval
         * 
         * @{return}:       void; 
         */
        function clearTimeInterval() {
            clearInterval(timeInterval);
            INTERACTIVING_INTERVAL = true;
        }

        function init() {
            // prev & next link
            $('.mt-slider-prev').click(function (ev) {
                ev.preventDefault();
                moveSlider('left');
                clearTimeInterval();
            });

            $('.mt-slider-next').click(function (ev) {
                ev.preventDefault();
                moveSlider('right');
                clearTimeInterval();
            });

            $listIndicator.each(function (index) {
                $listIndicator.eq(index).click(function (ev) {
                    ev.preventDefault();

                    clearTimeInterval();

                    var _index = parseInt($(this).attr('data-mt-slider-index'));

                    if (_index > INDEX_CURRENT) {
                        moveSlider('right', _index);
                        return;
                    }

                    if (_index === INDEX_CURRENT) {
                        return;
                    }

                    if (_index < INDEX_CURRENT) {
                        moveSlider('left', _index);
                    }
                });
            });
        }
        
        // autorun
        (function () {
            prepare();
            init();
            setTimeInterval();
        })();
    }

    // active slider
    mtSlider({
        autoLoop: true
    });

});