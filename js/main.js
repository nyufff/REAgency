
	jQuery(document).ready(function($) {

		$(function() {
			$(main).scroll(function() {
				if ($(main).scrollTop() != 0) {
					$('.hide').css({"display": "block"});
                    $('.footer').css({"display": "none"});
				}
				else {
					$('.footer').css({"display": "flex"});
                    $('.hide').css({"display": "none"});
				}
			});
			$('.hide').click(
				function() {
					$('.footer').css({"display": "flex"});
					$('.hide').css({"display": "none"});
				});
		});	
	});
	
class Router {
	constructor() {
		this._dynamicPages = {'houses': 'houses'};
		this._staticPagesLinks = {'': 'page_home', 'home': 'page_home', 'about_us': 'page_about_us',
								'services': 'page_services', 'serv_rent': 'page_serv_rent',
								'serv_owners': 'page_serv_owners', 'prop_manag': 'page_prop_manag',
								'contacts': 'page_contacts', 'login_page': 'page_login_page'};
		this._pagesTitles = {'page_home': 'Home', 'page_about_us': 'About Us', 'page_services': 'Services',
							'page_serv_rent': 'Buy/Rent', 'page_serv_owners': 'For Owners', 
							'page_prop_manag': 'Property Management', 'page_contacts': 'Contact Us',
							'page_login_page': "Log In"};
							
		let url = window.location.href;
		if (url.indexOf('?') !== -1) {
			this.path = url.substring(0, url.indexOf('?'));
		} else {
			this.path = url;
		}
		this.catchLinks();
	}

}

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
}


	
