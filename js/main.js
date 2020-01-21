
jQuery(document).ready(function($) {

	$(function() {
		$(window).scroll(function() {
			if ($(window).scrollTop() != 0) {
				$('.header').css({"background-color": "rgba(222, 222, 210, 1)", "transition-duration": "1s"});
			}
			else {
				$('.header').css({"background-color": "rgba(222, 222, 210, 0)", "transition-duration": "1s"})
			}
		});

		$('.header').hover(
			function() {
				if ($(window).scrollTop() == 0) {
					$('.header').css({"background-color": "rgba(222, 222, 210, 1)", "transition-duration": "1s"});
				}
			},
			function() {
				if ($(window).scrollTop() == 0) {
					$('.header').css({"background-color": "rgba(222, 222, 210, 0)", "transition-duration": "1s"})
				}
			});
	});

});

	