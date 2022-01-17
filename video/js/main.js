/*
 * Third party
 */



/*
 * Custom
 */
(function ($) {


    function menuFixed(){  // scroll fixed main menu to top
        var scroll = $(window).scrollTop();
        if ( scroll >= 50){
            $('#header').addClass('scroll');
        }else{
            $('#header').removeClass('scroll');
        }
    }
    function counter(block,count,time){
        var count = parseInt(count),
            time = parseInt(time),
            step = Math.ceil( count / (time / 100) );
        block.text(0);
        var interval = setInterval(function(){
            var n = parseInt(block.text().replace(/\D+/g,"")) + step;
            if( n >= count ){
                block.text(count.toLocaleString());
                clearInterval(interval);
            }else{
                block.text(n.toLocaleString());
            }
        },100);
    }
    function SiteCookie(){
        if(Cookies.get('agree') ){
            $('.cookie-block').remove();
        }else{
            $('.cookie-block .cookie-link').on('click', function(){
                Cookies.set('agree','1');
                $('.cookie-block').addClass('closed');
                setTimeout(function(){
                    $('.cookie-block').remove();
                },1000);
                return false;
            });
        }
    }

    $(document).ready(function () {

        SiteCookie();

        var timeCount = $('.count').attr('data-time'),
            countValue = $('.count').attr('data-value');
        counter($('.count'),countValue,timeCount);

        $('.counter-link').on('click', function(){
            $.ajax({
                type: 'GET',
                cache: false,
                url: 'https://soutenir.pasteur.fr/immunotherapie/video/count.php',
                data: {count:1},
                success:
                    function(count) {
                        $('.count').html(count);
                    }
            });
            var count = parseInt($('.count').text().replace(/\D+/g,"")) + 1;
            $('.count').text(count.toLocaleString());
        });

        $('.block-05 .numb-block').on('click', function(){
            $(this).closest('li').addClass('checked');
        });
        if( $('.block-05 ul').length ){

            $('.block-05 ul').slick({
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 1,
                arrows: false,
                dots: false,
                //cssEase: 'linear',
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            infinite: false,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            arrows: false,
                            dots: true,
                            fade: true,
                            adaptiveHeight: true
                        }
                    }
                ]
            });

            $('.slider-block').append('<div class="nav-wrapper"></div>');
            $('.slider-block .slick-dots').appendTo('.slider-block .nav-wrapper');
            $('.slider-block .slick-next').insertAfter('.slider-block .slick-dots');
            $('.slider-block .slick-prev').insertBefore('.slider-block .slick-dots');
            //$('.slider-block').on('breakpoint', function(event, slick, breakpoint){
            //    if( $(window).width() < 768 ){
            //        $('.slider-block').slick('unslick');
            //        $('.nav-wrapper').remove();
            //        $('.slider-block').slick({
            //            infinite: true,
            //            slidesToShow: 1,
            //            slidesToScroll: 1,
            //            arrows: true,
            //            dots: true,
            //            fade: false,
            //            cssEase: 'linear'
            //        });
            //        $('.slider-block').append('<div class="nav-wrapper"></div>');
            //        $('.slider-block .slick-dots').appendTo('.slider-block .nav-wrapper');
            //        $('.slider-block .slick-next').insertAfter('.slider-block .slick-dots');
            //        $('.slider-block .slick-prev').insertBefore('.slider-block .slick-dots');
            //    }else{
            //        $('.slider-block').slick('unslick');
            //        $('.nav-wrapper').remove();
            //        $('.slider-block').slick({
            //            infinite: true,
            //            slidesToShow: 1,
            //            slidesToScroll: 1,
            //            arrows: true,
            //            dots: true,
            //            fade: true,
            //            cssEase: 'linear'
            //        });
            //        $('.slider-block').append('<div class="nav-wrapper"></div>');
            //        $('.slider-block .slick-dots').appendTo('.slider-block .nav-wrapper');
            //        $('.slider-block .slick-next').insertAfter('.slider-block .slick-dots');
            //        $('.slider-block .slick-prev').insertBefore('.slider-block .slick-dots');
            //    }
            //});


            $('.more-view').on('click', function(){
                $(this).closest('.text-preview').hide();
                $(this).closest('.text-block').find('.text').show();
                return false;
            });

        }

        $('.play-btn').on('click', function(){
            $('.video-block').addClass('open');
            //$('.popup-wrapper').fadeIn(500);
            //$('html').addClass('overflow');
            player.playVideo();
        });

        $('.video-block .close').on('click', function(){
            $('.video-block').removeClass('open');
            //$('.popup-wrapper').fadeOut(500);
            //$('html').removeClass('overflow');
            player.pauseVideo();
        });

        $('.bars-block .bars').on('click', function(){
            $('.menu-block').addClass('open');
        });
        $('.menu-block .close').on('click', function(){
            $('.menu-block').removeClass('open');
        });

        $('.anchor').on('click', function(){
            var then = $(this),
                target = then.attr('href'),
                headerH = $('header').outerHeight();
            $('.menu-block').removeClass('open');
            $('html, body').animate({ scrollTop: $(target).offset().top - headerH }, 500);
            return false;
        });

        $('.fb_link').on('click', function(){
            if( $(window).width() < 1024 ){
                window.location.href = $(this).attr('href');
                setTimeout(function(){
                    window.open($('.fb_link_app').attr('href'));
                },100);
                return false;
            }
        });

        //function share() {
        //    FB.ui({
        //        app_id: 184683071273,
        //        method: 'share',
        //        href: 'https://soutenir.pasteur.fr/immunotherapie/video/#video',
        //    }, function(response){});
        //}
        //
        //$('.facebook-link').on('click', function(){
        //    share();
        //    return false;
        //});



        //-----------------old

        //$('.block-02 .donate-block form .wrap-input').on('click', function(){
        //    if ( $(window).width() < 768 ){
        //        window.location.href = 'https://association-gregorylemarchal.org/faire-un-don/';
        //    }
        //});
        //
        //function addCommas(nStr) {
        //    nStr += '';
        //    x = nStr.split('.');
        //    x1 = x[0];
        //    x2 = x.length > 1 ? '.' + x[1] : '';
        //    var rgx = /(\d+)(\d{3})/;
        //    while (rgx.test(x1)) {
        //        x1 = x1.replace(rgx, '$1' + ' ' + '$2');
        //    }
        //    return x1;
        //}
        //$('.donate-block #d-custom').on('input', function(e){
        //    if($(this).val() != ''){
        //        if( isNaN($(this).val()) && $(this).val().length == 1  ){
        //            return $(this).val('');
        //        }
        //        if( !$(this).hasClass('is-value') ){
        //            $(this).addClass('is-value');
        //        }
        //        $('.donate-block input[type="radio"]').removeAttr('checked');
        //        var val = parseInt($(this).val().replace(' ', '')),
        //            p = (val * 0.34).toFixed(2);
        //       var label = $(this).closest('.wrap-input').find('label');
        //        label.find('.numb span').text(val.toLocaleString());
        //        label.find('.article span').text(addCommas(p));
        //        //numericFormat(val);
        //        val = addCommas(val);
        //        $(this).val(val);
        //    }else{
        //        if( $(this).hasClass('is-value') && $(this).val() == '') {
        //            $(this).removeClass('is-value');
        //            $('.donate-block input[type="radio"]').first().prop("checked", true);
        //        }
        //    }
        //});


    });

    $(window).on('load', function(){
        var pageUrl = window.location.href;
        if( !pageUrl.indexOf('#video') + 1 ){
            $('html, body').animate({scrollTop: $('.block-01 .first-title-block').offset().top - 100 },300);
        }
    });

})(jQuery);
