$(document).ready(function () {

    // setup appropriate section sizing
    resizeAllSectionsToWindowHeight();
    resizePrimaryMenu();

    $(window).resize(function () {
        resizeAllSectionsToWindowHeight();
        resizePrimaryMenu();
    });

    // set default scroll positions
    window.scrollTo(0, 0);
    window.lastScrollPosition = 0;
    $(window).on('scroll', function() {
        setTimeout(function() {
            window.lastScrollPosition = $(window).scrollTop();
        }, 50);
    });

    // animate title appearance
    setTimeout(function () {
        $('.title').fadeIn(1000, function() {
            //and then animate arrow display
            displayDownArrowHelper($('#main'));
        });
    }, 2000);


});

$(function () {
    var titleWidth = $('.category').width();
    var titleHeight = $('.category').height();

    var firstSlide = $('section').eq(0);
    var section_height = firstSlide.height();

    var allSections = $('section');

    $('body').height(10 * section_height); // увеличиваем высоту в 10 раз --> ЗАЧЕМ?

    //window.lastScrollPosition = 0;

    function slide1toSlide2ScrollHandler() {
        console.log('slide 1 scroll handler');
        var currentScrollPosition = $(window).scrollTop();

        // if we scroll down
        if (currentScrollPosition > window.lastScrollPosition) {
            $(window).off('scroll', slide1toSlide2ScrollHandler);
            // animate
            var allSections = $('section');
            allSections.css('z-index', 0);

            var menu = $('#menu');
            menu.addClass('active');
            menu.css('z-index', 1);

            var title = $('#main');

            title.animate({'opacity': 0}, 1200);
            menu.animate({"opacity": 1}, 1500, function () {
                var afterPresent = $.Deferred();
                afterPresent.then(function() {
                    window.lastScrollPosition = $(window).scrollTop();
                    $(window).on('scroll', slide2ToSlide1ScrollHandler);
                });

                presentPrimaryMenu(true, afterPresent);
            });
        }

    }

    function slide2ToSlide1ScrollHandler() {
        console.log('slide 2 scroll handler');
        var currentScrollPosition = $(window).scrollTop();

        // if we scroll up
        if (currentScrollPosition < window.lastScrollPosition) {
            $(window).off('scroll', slide2ToSlide1ScrollHandler);
            // animate
            var allSections = $('section');
            //allSections.css('z-index', 0);

            var menu = $('#menu');
            menu.css('z-index', 1);
            var title = $('#main');

            var afterHide = $.Deferred();
            afterHide.then(function() {
                menu.animate({'opacity': 0}, 1000, function() {
                    title.animate({'opacity' : 1}, 1500, function() {
                        window.lastScrollPosition = $(window).scrollTop();
                        $(window).on('scroll', slide1toSlide2ScrollHandler);
                    });
                });
            });
            hidePrimaryMenu(true, afterHide);
        }

        window.lastScrollPosition = currentScrollPosition;
    }

    function slide2ZoomOut() {
        console.log('slide 2 zoom out scroll handler');
        var currentScrollPosition = $(window).scrollTop();

        // if we scroll up
        if (currentScrollPosition < window.lastScrollPosition) {
            zoomOut($('.opened'));
        }

    }

    function slide2PresentGallery() {
        console.log('slide 2 present gallery handler');
        var currentScrollPosition = $(window).scrollTop();
        console.log(currentScrollPosition + ' vs ' + window.lastScrollPosition);

        // if we scroll up
        if (currentScrollPosition > window.lastScrollPosition) {
            console.log('why not go for it');
            $(window).off('scroll', slide2PresentGallery);
            $(window).off('scroll', slide2ZoomOut);

            var category_active = $('.opened');
            var gallery_active = category_active.find('.gallery');
            $('.menu-line').css({'width': '480px'});
            gallery_active.show(); // показываем галерею
            var photos_wrap = gallery_active.find(".two-photos-wrap, .category-title, .gallery-description");
            if (!get_class(photos_wrap.first()))
                category_active.find('.category').animate({'opacity': 0}, 3000);

            photos_wrap.each(function () {
                if (!get_class(this))
                    $(this).switchClass("", $(this).attr('class') + '-animate', 3000, "easeInOutQuad");
            });

            $(window).on('scroll', slide2HideGallery);
        }

    }

    function slide2HideGallery() {
        console.log('slide 2 present gallery handler');
        var currentScrollPosition = $(window).scrollTop();

        // if we scroll up
        if (currentScrollPosition < window.lastScrollPosition) {
            $(window).off('scroll', slide2HideGallery);

            var category_active = $('.opened');
            var gallery_active = category_active.find('.gallery');
            if (gallery_active.is(':visible')) { // если активная галерея
                $('.menu-line').css({'width': '100%'});
                category_active.find('.category').animate({'opacity': 1}, 3000);
                gallery_active.find(".two-photos-wrap, .category-title, .gallery-description").each(function () {
                    $(this).switchClass(get_class(this), "", 3000, "easeInOutQuad", function () {
                        gallery_active.hide();
                    });
                });
            }

            setTimeout(function() {
                $(window).on('scroll', slide2ZoomOut);
                $(window).on('scroll', slide2PresentGallery);
            }, 3000);
        }

    }

    $(window).on('scroll', slide1toSlide2ScrollHandler);


    // SLIDE 2 -> 3

    function menuClickHandler(e) {
        e.preventDefault();
        $(window).off('scroll', slide2ToSlide1ScrollHandler);
        $(window).on('scroll', slide2ZoomOut);
        $(window).on('scroll', slide2PresentGallery);

        loadRandomPictures($(this).attr('class').split(' ')[0], $(this).find('.gallery'));

        if ($(this).hasClass('opened')) {
            zoomOut(this);
            return
        }

        $(this).css("z-index", "100");
        $(this).addClass('opened');
        var afterBlowup = $.Deferred();
        afterBlowup.then(function() {
            $(this).find('.description').fadeIn();
            $('.nav li').off('click', menuClickHandler);
        });
        fullsizeMenuItem($(this), afterBlowup);


        var screenHeight = $(window).height();
        var screenWidth = $(window).width();
        var estimatedCategoryWidth = Math.round(screenWidth * 0.8);
        var estimatedCategoryHeight = Math.round(screenHeight * 0.8);
        var topOffset = (screenHeight - estimatedCategoryHeight) / 2;
        var leftOffset = (screenWidth - estimatedCategoryWidth) / 2;
        var CategoryPadding = estimatedCategoryHeight * 0.13
        $(this).find('.category').animate({
            'top': topOffset + 'px',
            'left': leftOffset + 'px',
            'width': estimatedCategoryWidth + 'px',
            'height': estimatedCategoryHeight + 'px',
            'font-size': 80 + 'px',
            'padding-top': CategoryPadding
        }, 3000, function() {
            displayDownArrowHelper();
        });
    }

    $('.nav li').on('click', menuClickHandler);

    var oldCategoryPadding = $(".category").css("padding");

    function zoomOut(obj) { // скрытие активной категории
        $(window).off('scroll', slide2ZoomOut);
        $(window).off('scroll', slide2PresentGallery);
        $(obj).find('.description').fadeOut();

        var def = $.Deferred();
        def.then(function() {
            $(obj).removeClass('opened');
            $(window).on('scroll', slide2ToSlide1ScrollHandler);
            $('.nav li').on('click', menuClickHandler);
        });
        downsizeMenuItem($(obj), def);

        $(obj).find('.category').animate({
            'top': 0,
            'left': 0,
            'width': titleWidth,
            'height': titleHeight,
            'font-size': 40 + 'px',
            'padding': oldCategoryPadding
        }, {
            duration: 3000, queue: false
        });
    }

    $('.gallery a').on('click', function(e) {
        e.preventDefault();
    });
});


function get_class(obj, str) {
    str = str || 'animate';
    cls = $(obj).attr('class').split(' ');
    class_name = '';
    $.each(cls, function (index, value) {
        if (value.indexOf(str) > -1) {
            class_name = class_name + ' ' + value;
        }
    });
    return class_name;
}

/* DIFFERENT POSSIBLE SCROLLS */


/* CHECKED FUNCTIONS */
function resizeAllSectionsToWindowHeight() {
    $("section, #about-project").css("height", $(window).height());
};

function loadRandomPictures(folderName, placeholderElement) {
    $.ajax('/photos.php?folder=' + folderName, {
        success: function(data) {
            data = JSON.parse(data);
            $(placeholderElement).find('img').each(function(index) {
                if (data.length > index) {
                    console.log('setting up ' + data[index] + ' at index ' + index);
                    $(this).attr('src', data[index]);
                }
            });
            $(placeholderElement).find('a').each(function(index) {
                if (data.length > index) {
                    console.log('setting up ' + data[index] + ' at index ' + index);
                    $(this).attr('href', data[index].replace('.small.jpg', '.jpg'));
                }
            });
        }
    });
}

function displayDownArrowHelper(element)  {
    // i was not sure whether modifying HTML structure of page will affect its behaviour, that's why
    // i have to put this code here
    var html = '<div id="arrow_helper">'
            + '<p>Для просмотра, пожалуйста, прокрутите вниз</p>'
            + '<img src="/img/down.png" />'
            + '</div>';
    var helper = $(html);
    $(element).append(helper);
    $(helper).animate({
        'bottom' : '50px'
    });
}

function removeDownArrowHelper() {
    $('#arrow_helper').animate({
        'bottom' : '-200px'
    }, 800, function() {
        $('#arrow_helper').remove();
    })
}

function resizePrimaryMenu() {
    var imageOriginalWidth = 1400;
    var imageOriginalHeight = 800;

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var expectedImageWidth = windowWidth * 0.43; // li takes 43% of width.
    var expectedImageHeight = windowHeight * 0.43; // ...and height

    var scaleW = (imageOriginalWidth / expectedImageWidth);
    var scaleH = (imageOriginalHeight / expectedImageHeight);

    var maxScale = (scaleH > scaleW ? scaleH : scaleW);

    var imageHeight = imageOriginalHeight / maxScale;
    var imageWidth = imageOriginalWidth / maxScale;

    $('#menu .nav li').css({
        'height' : imageHeight + 'px',
        'width' : imageWidth + 'px'
    });

    // now, re-position them accordingly
    $('#menu .nav li').each(function() {
        var currentElement = $(this);

        if (currentElement.css('top') != 'auto') {
            currentElement.css({
                top: -imageHeight + 'px'
            });
        }
        if (currentElement.css('bottom')  != 'auto') {
            currentElement.css({
                bottom: -imageHeight + 'px'
            });
        }
        if (currentElement.css('left')  != 'auto') {
            currentElement.css({
                left: -imageWidth + 'px'
            });
        }
        if (currentElement.css('right')  != 'auto') {
            currentElement.css({
                right: -imageWidth + 'px'
            });
        }
    });
}

function presentPrimaryMenu(animated, deffered) {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var animationLength = 3000;


    $('#menu .nav li').each(function() {
        var currentElement = $(this);
        var imageHeight = currentElement.height();
        var imageWidth = currentElement.width();
        var sidePadding = (windowWidth - imageWidth*2) / 2;
        var vPadding = (windowHeight - imageHeight*2) / 2;

        var changes = {
            opacity: 1
        };
        var changeMap = {
            'top' : vPadding,
            'bottom' : vPadding,
            'left' : sidePadding,
            'right' : sidePadding
        };
        var watchables = ['top', 'bottom', 'left', 'right'];
        for (watchable_index in watchables) {
            var watchable = watchables[watchable_index];
            if (currentElement.css(watchable) != 'auto') {
                changes[watchable] = changeMap[watchable] + 'px';
            }
        }
        currentElement.animate(changes, animated ? animationLength : 0, deffered.resolve);
    });
}


function hidePrimaryMenu(animated, deferred) {
    var animationLength = 3000;

    $('#menu .nav li').each(function() {
        var currentElement = $(this);
        var imageHeight = currentElement.height();
        var imageWidth = currentElement.width();

        var changes = {
            opacity: 1
        };
        var changeMap = {
            'top' : imageHeight,
            'bottom' : imageHeight,
            'left' : imageWidth,
            'right' : imageWidth
        };
        var watchables = ['top', 'bottom', 'left', 'right'];
        for (watchable_index in watchables) {
            var watchable = watchables[watchable_index];
            if (currentElement.css(watchable) != 'auto') {
                changes[watchable] = -changeMap[watchable] + 'px';
            }
        }
        currentElement.animate(changes, animated ? animationLength : 0, deferred.resolve);
    });
}

function fullsizeMenuItem(item, deferred) {
    var animationLength = 2000;

    var currentElement = item;
    var imageHeight = $(window).height();
    var imageWidth = $(window).width();

    var changes = {
        'height' : imageHeight,
        'width' : imageWidth
    };

    var watchables = ['top', 'bottom', 'left', 'right'];
    for (watchable_index in watchables) {
        var watchable = watchables[watchable_index];
        if (currentElement.css(watchable) != 'auto') {
            changes[watchable] = 0 + 'px';
        }
    }
    currentElement.animate(changes, animationLength, deferred.resolve);
}

function downsizeMenuItem(item, deferred) {
    var animationLength = 2000;

    var currentElement = $(item);

    var imageOriginalWidth = 1400;
    var imageOriginalHeight = 800;

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var expectedImageWidth = windowWidth * 0.43; // li takes 43% of width.
    var expectedImageHeight = windowHeight * 0.43; // ...and height

    var scaleW = (imageOriginalWidth / expectedImageWidth);
    var scaleH = (imageOriginalHeight / expectedImageHeight);

    var maxScale = (scaleH > scaleW ? scaleH : scaleW);

    var imageHeight = imageOriginalHeight / maxScale;
    var imageWidth = imageOriginalWidth / maxScale;

    var sidePadding = (windowWidth - imageWidth*2) / 2;
    var vPadding = (windowHeight - imageHeight*2) / 2;

    var changes = {
        'height' : imageHeight,
        'width' : imageWidth
    };
    var changeMap = {
        'top' : vPadding,
        'bottom' : vPadding,
        'left' : sidePadding,
        'right' : sidePadding
    };
    var watchables = ['top', 'bottom', 'left', 'right'];
    for (watchable_index in watchables) {
        var watchable = watchables[watchable_index];
        if (currentElement.css(watchable) != 'auto') {
            changes[watchable] = changeMap[watchable] + 'px';
        }
    }
    currentElement.animate(changes, animationLength, deferred.resolve);
}
