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
		var section_heigth = $('section').eq(0).height();

		var $sections = $('section');

		$('body').height($('section').length * section_heigth);

		var temp_scrooll = 0;

		function effect(element) {

			$sections.css('z-index', 0);
			element.css('z-index', 1);
			$('.nav').animate({'opacity': 0});

			$( window ).off('scroll', scrollHandler);

			element.animate({right: 0, opacity: "1"}, 1500, function() {

				$('.active').css({'opacity': 0, 'right': "-100%" });
				$('.nav').animate({'opacity': 1});

				$sections.removeClass('active');
				element.addClass('active');

				$( window ).on('scroll', scrollHandler);
			});
			
		}

		function scrollHandler(e) {

			var scroll = $(this).scrollTop();  
			var $current_el = $('.active');
			var cur_index = $current_el.index();

			// var new_index = scroll >= temp_scrooll ? cur_index + 1: cur_index - 1;
			if (scroll >= temp_scrooll) {
				new_index = cur_index + 1;
			} else {
				new_index = cur_index - 1;
			}

			if (new_index < $sections.length && new_index >= 0) {
				var element = $sections.eq(new_index);
				effect(element);  
			} 

			temp_scrooll = scroll;		
		}

		$( window ).on('scroll', scrollHandler);

		$('.nav li').on('click', function(e) {
			e.preventDefault();
			$(this).css("z-index","100");

			$(this).switchClass("", "zoom " + 'zoom-' + $(this).attr('class') , 1000, "easeInOutQuad", function(){
				$(this).find('.description').fadeIn()
			});
			
		});
		$('.nav').on('click', '.zoom', function(e) {
			e.preventDefault();
			$(this).find('.description').fadeOut()
			$(this).switchClass("zoom " + 'zoom-' + $(this).attr('class'), '', 1000, "easeInOutQuad", function() {
				$(this).css("z-index","1");
			});
			
		});
	});