$(document).ready(function() {

	function wResize() {
		$("section").css("height", $(window).height());

	};
	wResize();
	$(window).resize(function() {
		wResize()
	});

	
});
$(function () {
		var titleWidth = $('.category').width(); 
		var titleHeight = $('.category').height(); 

		var section_heigth = $('section').eq(0).height();

		var $sections = $('section');

		$('body').height(10 * section_heigth);

		var temp_scrooll = 0;

		function effect(element, up) {

			$sections.css('z-index', 0);
			element.css('z-index', 1);

			$( window ).off('scroll', scrollHandler);

			$('.active').animate({'opacity': 0}, 1200);

			if (up) {
				// вверх
				$(".nav li").each(function() {
	    			$(this).switchClass( $(this).attr('class').split(' ')[1], "", 1300, "easeInOutQuad");
				})
				$('.title').animate({'opacity': 1}, 2000);
			}

			element.animate({"opacity": 1}, 1500, function() {
				if (!up) {
					$(".nav li").each(function() {
		    			$(this).switchClass("",  $(this).attr('class') + '-animate' , 1300, "easeInOutQuad");
					})
					$('.title').animate({'opacity': 0}, 1500);
					
				} 
				
				$sections.removeClass('active');
				element.addClass('active');

			});
			$( window ).on('scroll', scrollHandler);
		}

		function scrollHandler(e) {

			var scroll = $(this).scrollTop();  // позиция скрола 
			var section_active = $('section.active'); // активная секция
			var cur_index = section_active.index(); // 

			var up = false;

			if (scroll >= temp_scrooll) { // сколл вниз
				new_index = cur_index + 1;
				
			} else { // если вверх
				new_index = cur_index - 1;
				up = true;
				
			}

			var category_active = $('.zoom');
			var gallery_active = category_active.find('.gallery');

			if (category_active.length && up) { // если активна категория и скролл вверх
				if (gallery_active.is(':visible')) { // если активная галерея $().css('opacity') == 0
					category_active.find('.category').animate({'opacity': 1}, 1500);
					gallery_active.find(".two-photos-wrap").each(function() {
			    			$(this).switchClass(get_class(this), "", 3000, "easeInOutQuad", function() {
				    			gallery_active.hide();
			    			});
						})

				} else { // иначе скрываем активную категорию
					zoomOut($('.zoom'));
					
				}

			} else if (category_active.length && !up ){ // если активна категория и скролл вниз
				
				gallery_active.show(); // показываем галерею
				var photos_wrap = gallery_active.find(".two-photos-wrap");
				if (!get_class(photos_wrap.first()))
					category_active.find('.category').animate({'opacity': 0}, 1800);

				photos_wrap.each(function() {
					if (!get_class(this))
	    				$(this).switchClass("",  $(this).attr('class') + '-animate' , 3000, "easeInOutQuad");
				})

			} else if (new_index < $sections.length && new_index >= 0) { // анимация секций
				var element = $sections.eq(new_index); // текущая секция(слайд)
				effect(element, up);  
			}

			temp_scrooll = scroll; // записываем предыдущее состояние скрола		

		}



		$( window ).on('scroll', scrollHandler);


		// SLIDE 2 -> 3
		$('.nav li').on('click', function(e) { 
			e.preventDefault();
			if ($('.gallery').is(':visible')) {
				return 
			}
			if ($(this).hasClass('zoom')) {
				zoomOut(this);
				return 
			}

			$(this).css("z-index","100");
			$(this).switchClass("", "zoom " + 'zoom-' + $(this).attr('class') , 2000, "easeInOutQuad", function(){
				$(this).find('.description').fadeIn()
			});



			var screenHeight = $(window).height();
			var screenWidth = $(window).width();
			var estimatedCategoryWidth = Math.round(screenWidth * 0.8); 
			var estimatedCategoryHeight = Math.round(screenHeight * 0.8); 
			var topOffset = (screenHeight - estimatedCategoryHeight) / 2;
			var leftOffset = (screenWidth - estimatedCategoryWidth) / 2;
			var CategoryPadding = estimatedCategoryHeight * 0.13 
			$(this).find('.category').animate({ 
				'top' : topOffset + 'px',
				'left' : leftOffset + 'px',
				'width' : estimatedCategoryWidth + 'px',
				'height' : estimatedCategoryHeight + 'px',
				'font-size' : 80 + 'px',
				'padding-top' : CategoryPadding
			}, 2000);
			
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
			$(obj).find('.description').fadeOut()
			$(obj).switchClass("zoom " + $(obj).attr('class').split(' ')[3], '', 2000, "easeInOutQuad", function() {
				$(obj).css("z-index","1");
			});


			$(obj).find('.category').animate({ 
				'top' : 0,
				'left' : 0,
				'width' : titleWidth,
				'height' : titleHeight ,
				'font-size' : 40 + 'px',
				'padding' : oldCategoryPadding
			}, {
				 duration: 2000, queue: false 
			});
		}

/*		$('.photo-wrap').click(function(e) {
			e.preventDefault();
			console.log('click img')
			return false;
		})*/
});


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

    var result = { width: 0, height: 0, fScaleToTargetWidth: true };

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
function get_class(obj, str) {
	str = str || 'animate';
	cls = $(obj).attr('class').split(' ');
	class_name = '';
	$.each(cls, function(index, value){
		if (value.indexOf(str) > -1) {
			class_name = class_name + ' ' + value;
		}
	});
	return class_name;
}