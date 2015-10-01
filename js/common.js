$(document).ready(function () {
    resizeAllSectionsToWindowHeight();

    $(window).resize(function () {
        resizeAllSectionsToWindowHeight()
    });

    resizePrimaryMenu();
    setTimeout(function () {
        $('.title').fadeIn(1000, function() {
            displayDownArrowHelper();
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

    window.lastScrollPosition = 0;

    function effect(element, up) {
        allSections.css('z-index', 0);
        element.css('z-index', 1);

        $('.active').animate({'opacity': 0}, 1200);

        if (up) {
            // вверх
            var afterHide = $.Deferred();
            afterHide.then(function() {
                $('.title').animate({'opacity': 1}, 3000, function() {
                    window.lastScrollPosition = $(window).scrollTop();
                    $(window).on('scroll', scrollHandler);
                });
            });
            hidePrimaryMenu(true, afterHide);
        }

        element.animate({"opacity": 1}, 1500, function () {

            if (!up) {
                var afterPresent = $.Deferred();
                afterPresent.then(function() {
                    window.lastScrollPosition = $(window).scrollTop();
                    $(window).on('scroll', scrollHandler);
                });

                presentPrimaryMenu(true, afterPresent);
                $('.title').animate({'opacity': 0}, 2000);
            }

            allSections.removeClass('active');
            element.addClass('active');
        });
    }

    function scrollHandler() {
        console.log('consolling');
        $(window).off('scroll', scrollHandler);
        removeDownArrowHelper();

        var currentScrollPosition = $(this).scrollTop();
        var section_active = $('section.active');
        var cur_index = section_active.index();

        var up = false;


        if (currentScrollPosition >= window.lastScrollPosition) { // сколл вниз
            new_index = cur_index + 1;
        } else { // если вверх
            new_index = cur_index - 1;
            up = true;
        }
        window.lastScrollPosition = currentScrollPosition; // записываем предыдущее состояние скрола

        //new_index < allSections.length && new_index >= 0
        console.log('new index ' + new_index);
        console.log('all sections ' + allSections.length);


        var category_active = $('.zoom');
        var gallery_active = category_active.find('.gallery');

        if (category_active.length && up) { // если активна категория и скролл вверх
            console.log('scenario 1');
            if (gallery_active.is(':visible')) { // если активная галерея
                console.log('scenario 2');
                $('.menu-line').css({'width': '100%'});
                category_active.find('.category').animate({'opacity': 1}, 3000);
                gallery_active.find(".two-photos-wrap, .category-title, .gallery-description").each(function () {
                    $(this).switchClass(get_class(this), "", 3000, "easeInOutQuad", function () {
                        gallery_active.hide();
                    });

                })

            } else { // иначе скрываем активную категорию
                console.log('scenario 3');
                zoomOut($('.zoom'));
            }
        } else if (category_active.length && !up) { // если активна категория и скролл вниз
            console.log('scenario 4');
            $('.menu-line').css({'width': '480px'});
            console.log("480");
            gallery_active.show(); // показываем галерею
            var photos_wrap = gallery_active.find(".two-photos-wrap, .category-title, .gallery-description");
            if (!get_class(photos_wrap.first()))
                category_active.find('.category').animate({'opacity': 0}, 3000);

            photos_wrap.each(function () {
                if (!get_class(this))
                    $(this).switchClass("", $(this).attr('class') + '-animate', 3000, "easeInOutQuad");
            })

        } else if (new_index < allSections.length && new_index >= 0) { // анимация секций
            console.log('gonna show dat effect');
            var element = allSections.eq(new_index); // текущая секция(слайд)
            effect(element, up);
        } else {
            $(window).on('scroll', scrollHandler);
        }
    }


    $(window).on('scroll', scrollHandler);


    // SLIDE 2 -> 3
    $('.nav li').on('click', function (e) {
        e.preventDefault();

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

    });

    var categoryHeight = $(".title-nav-wrap").height();
    var categoryWidth = $(".title-nav-wrap").width();
    var oldCategoryPadding = $(".category").css("padding");

    // SLIDE 3 -> 2
    // $('.nav').on('click', '.zoom', function (e) {
    // 	console.log('zoom')
    // 	e.preventDefault();
    // 	zoomOut(this);
    // });


    function zoomOut(obj) { // скрытие активной категории
        $(obj).find('.description').fadeOut();

        var def = $.Deferred();
        def.then(function() {
            $(obj).removeClass('opened');
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

function displayDownArrowHelper()  {
    // i was not sure whether modifying HTML structure of page will affect its behaviour, that's why
    // i have to put this code here
    var html = '<div id="arrow_helper">'
            + '<p>Для просмотра, пожалуйста, прокрутите вниз</p>'
            + '<img src="/img/down.png" />'
            + '</div>';
    var helper = $(html);
    $('section.active').append(helper);
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

    var currentElement = $(this);

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


/**
 Image resizing functionality, 3rd party
 */
function OnImageLoad(evt) {
    var img = evt.currentTarget;

    // what's the size of this image and it's parent
    var w = $(img).width();
    var h = $(img).height();
    var tw = $(img).parent().width();
    var th = $(img).parent().height();

    // compute the new size and offsets
    var result = ScaleImage(w, h, tw, th, false);

    // adjust the image coordinates and size
    img.width = result.width;
    img.height = result.height;

    $(img).css("left", result.targetleft);
    $(img).css("top", result.targettop);
}

function ScaleImage(srcwidth, srcheight, targetwidth, targetheight, fLetterBox) {

    var result = {width: 0, height: 0, fScaleToTargetWidth: true};

    if ((srcwidth <= 0) || (srcheight <= 0) || (targetwidth <= 0) || (targetheight <= 0)) {
        return result;
    }

    // scale to the target width
    var scaleX1 = targetwidth;
    var scaleY1 = (srcheight * targetwidth) / srcwidth;

    // scale to the target height
    var scaleX2 = (srcwidth * targetheight) / srcheight;
    var scaleY2 = targetheight;

    // now figure out which one we should use
    var fScaleOnWidth = (scaleX2 > targetwidth);
    if (fScaleOnWidth) {
        fScaleOnWidth = fLetterBox;
    }
    else {
        fScaleOnWidth = !fLetterBox;
    }

    if (fScaleOnWidth) {
        result.width = Math.floor(scaleX1);
        result.height = Math.floor(scaleY1);
        result.fScaleToTargetWidth = true;
    }
    else {
        result.width = Math.floor(scaleX2);
        result.height = Math.floor(scaleY2);
        result.fScaleToTargetWidth = false;
    }
    result.targetleft = Math.floor((targetwidth - result.width) / 2);
    result.targettop = Math.floor((targetheight - result.height) / 2);

    return result;
}
