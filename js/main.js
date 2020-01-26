
// Header-footer fade

	jQuery(document).ready(function($) {

		$(function() {
			$(main).scroll(function() {
				if ($(main).scrollTop() != 0) {
					$('.header').css({"background-color": "rgba(222, 222, 210, 1)", "transition-duration": "1s"});
					$('.hide').css({"display": "block"});
                    $('.footer').css({"display": "none"});
				}
				else {
					$('.header').css({"background-color": "rgba(222, 222, 210, 0)", "transition-duration": "1s"});
					$('.footer').css({"display": "flex"});
                    $('.hide').css({"display": "none"});
				}
			});
	
			$('.header').hover(
				function() {
					if ($(window).scrollTop() == 0) {
						$('.header').css({"background-color": "rgba(222, 222, 210, 1)", "transition-duration": "1s"});
					}
				},
				function() {
					if ($(main).scrollTop() == 0) {
						$('.header').css({"background-color": "rgba(222, 222, 210, 0)", "transition-duration": "1s"})
					}
				});
				$('.hide').click(
					function() {
						$('.footer').css({"display": "flex"});
						$('.hide').css({"display": "none"});
					});
			});	
	});
	

window.onload = function() {

	// Router
	let home =  JSON.parse(window.localStorage.getItem('page_home'));
	document.getElementById('main').innerHTML = home;

	Array.from(document.querySelectorAll("nav a")).forEach(link => {
	    link.addEventListener('click', function(event) {
	        event.preventDefault();
	        let content = '404 Page not found';
	        if (typeof event.target.dataset.content != 'undefined') {
	        	try {
	        		content = JSON.parse(window.localStorage.getItem(event.target.dataset.content));
	        	} catch (e) {
	        		//do nothing
	        	}
	        } 
	    document.getElementById('main').innerHTML = content;
	    });
	});

	// Fill templates with property

	// Fill reviews

}


	
