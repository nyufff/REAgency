
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

	get staticPages() {
		return this._staticPagesLinks;
	}

	get dynamicPages() {
		return this._dynamicPages;
	}

	catchLinks() {

	}

	getPage() {

	}
	
	parseURL(url) {
		let params = {};
		if (url.indexOf('?') !== -1 && url.indexOf('=') !== -1) {
			let paramsString = url.substring(url.indexOf('?') + 1);
			let pairs = paramsString.split('&');
			pairs.forEach (function(el) {
				let kv = el.split('=');
				params[kv[0]] = kv[1];
			});
		}
		return params;
	}
	
}


window.onload = function() {
	let router = new Router();
}


	
