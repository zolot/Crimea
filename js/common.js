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

		function effect(element, up) {

			$sections.css('z-index', 0);
			element.css('z-index', 1);

			// $('.nav').animate({'opacity': 0});
			
			// $(".nav li").eq(0).switchClass("",  $(".nav li").attr('class') + '-animate' , 1000, "easeInOutQuad");
			// $(".nav li").each(function() {
   //  			$(this).switchClass("",  $(this).attr('class') + '-animate' , 1600, "easeInOutQuad");
			// })
			$( window ).off('scroll', scrollHandler);

			$('.active').animate({'opacity': 0}, 1000);

			if (!up) {
				// вверх
				$(".nav li").each(function() {
	    			$(this).switchClass( $(this).attr('class').split(' ')[1], "", 1000, "easeInOutQuad");
				})
				$('.title').animate({'opacity': 1}, 1800);
			}
			element.animate({"opacity": 1}, 1000, function() {
				if (up) {
					$(".nav li").each(function() {
		    			$(this).switchClass("",  $(this).attr('class') + '-animate' , 1000, "easeInOutQuad");
					})
					$('.title').animate({'opacity': 0}, 900);
				} 
				
				// $('.nav').animate({'opacity': 1});

				$sections.removeClass('active');
				element.addClass('active');

				$( window ).on('scroll', scrollHandler);
			});
			
		}

		function scrollHandler(e) {

			var scroll = $(this).scrollTop();  
			var $current_el = $('.active');
			var cur_index = $current_el.index();

			var up = false;
			// var new_index = scroll >= temp_scrooll ? cur_index + 1: cur_index - 1;
			if (scroll >= temp_scrooll) {
				new_index = cur_index + 1;
				up = true;
			} else {
				new_index = cur_index - 1;
			}

			if (new_index < $sections.length && new_index >= 0) {
				var element = $sections.eq(new_index);
				effect(element, up);  
			} 

			temp_scrooll = scroll;		
		}



		$( window ).on('scroll', scrollHandler);


		// SLIDE 2 -> 3
		$('.nav li').on('click', function(e) {
			e.preventDefault();
			$(this).css("z-index","100");

			$(this).switchClass("", "zoom " + 'zoom-' + $(this).attr('class') , 1000, "easeInOutQuad", function(){
				$(this).find('.description').fadeIn()
			});

			// set center text alignment on header to make sure it smoothly moves into center
			$(this).find('h2').css('text-align', 'center');

			var screenHeight = $(window).height();
			var screenWidth = $(window).width();
			var estimatedCategoryWidth = Math.round(screenWidth * 0.8); // 70%
			var estimatedCategoryHeight = Math.round(screenHeight * 0.8); // 80%
			var topOffset = (screenHeight - estimatedCategoryHeight) / 2;
			var leftOffset = (screenWidth - estimatedCategoryWidth) / 2;
			var CategoryPadding = estimatedCategoryHeight * 0.13 //5%;
			$(this).find('.category').animate({ 
				'top' : topOffset + 'px',
				'left' : leftOffset + 'px',
				'width' : estimatedCategoryWidth + 'px',
				'height' : estimatedCategoryHeight + 'px',
				'font-size' : 80 + 'px',
				'padding-top' : CategoryPadding
			}, 1000);
			
		});

		var categoryHeight = $(".title-nav-wrap").height();
		var categoryWidth = $(".title-nav-wrap").width();
		var oldCategoryPadding = $(".category").css("padding");
		// SLIDE 3 -> 2
		$('.nav').on('click', '.zoom', function(e) {
			e.preventDefault();
			$(this).find('.description').fadeOut()
			console.log("zoom " + 'zoom-' + $(this).attr('class').split(' ')[3])
			$(this).switchClass("zoom " + $(this).attr('class').split(' ')[3], '', 1000, "easeInOutQuad", function() {
				$(this).css("z-index","1");
			});

			// $(this).find('.description').switchClass('', 'zoomed', 1000, 'easeInOutQuad');
			// $(this).switchClass("zoom " + $(this).attr('class').split(' ')[3], '', 1000, "easeInOutQuad", function() {
			// 	$(this).css("z-index","1");
			// });
			// $(this).switchClass("zoom " + $(this).attr('class').split(' ')[3], '',  {
			// 	'duration': 1000,
				// 'easing': easeInOutQuad,
				// queue: false,
				// "complete": function(){},
			// })
			var titleWidth = Math.round(categoryWidth * 0.45); // 70%
			var titleHeight = Math.round(categoryHeight * 0.42); // 80%
			$(this).find('.category').animate({ 
				'top' : 0,
				'left' : 0,
				'width' : titleWidth + 'px',
				'height' : titleHeight + 'px',
				'font-size' : 50 + 'px',
				'padding' : oldCategoryPadding
			}, {
				 duration: 1000,
				queue: false,
				complete: function() {
					// when done, move header to the left again
					$(this).find('h2').css('text-align', 'left');
				}
			});
			
		});
	});