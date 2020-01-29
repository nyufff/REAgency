
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
								'services': 'page_services', 
								'serv_owners': 'page_serv_owners', 'prop_manag': 'page_prop_manag',
								'contacts': 'page_contacts', 'login_page': 'page_login_page'};
		this._pagesTitles = {'page_home': 'Home', 'page_about_us': 'About Us', 'page_services': 'Services',
							'page_serv_rent': 'Buy/Rent', 'page_serv_owners': 'For Owners', 
							'page_prop_manag': 'Property Management', 'page_contacts': 'Contact Us',
							'page_login_page': "Log In"};
		this.mainFile = 'index.html';					

		let url = window.location.href;
		if (url.indexOf('?') !== -1) {
			this.path = url.substring(0, url.indexOf('?'));
		} else {
			this.path = url;
		}
		this.setGlobalEvents();
	}

	get staticPages() {
		return this._staticPagesLinks;
	}

	get dynamicPages() {
		return this._dynamicPages;
	}

	setGlobalEvents() {
		let router = this;	
		Array.from(document.querySelectorAll("a.innerLink")).forEach(link => {
		    link.addEventListener('click', function(event) {
		    	event.preventDefault();
		    	let page = router.getPage(event.currentTarget.href);
	    		document.getElementById('main').innerHTML = page['content'];
	    		document.title = page['title'];
				window.history.replaceState({}, "Title", event.currentTarget.href);
				console.log(page['p']);
				router.setPagesEvents(page['p']);
		    });
		});
		document.getElementById("searchForm").addEventListener('submit', function(event) {
	    	event.preventDefault();
	    	let searchString = document.getElementById('searchString').value;
	    	if (!searchString.length) { return false; }
	    	let link = router.createURL({p: 'search', q: searchString});
	    	let page = router.getPage(link);
    		document.getElementById('main').innerHTML = page['content'];
    		document.title = page['title'];
			window.history.replaceState({}, "Title", link);
			router.setPagesEvents(page['p']);
		});
	}

	setPagesEvents (p) {
		let router = this;
		if (p == 'serv_rent') {
			document.getElementById('housesSortPrice').addEventListener('change', function(event){
				let params = router.parseURL(window.location.href);
				params['sortv'] = 'price';
				params['sortd'] = event.currentTarget.value;
				let link = router.createURL(params);
		    	let page = router.getPage(link);
	    		document.getElementById('main').innerHTML = page['content'];
	    		document.title = page['title'];
				window.history.replaceState({}, "Title", link);
				router.setPagesEvents(page['p']);
			});
		}
	}


	getPage(url) {
		let params = this.parseURL(url);
		let title = 'Page Not Found';
		let content = '404. Page is not found';

		if (typeof params['p'] == 'undefined') {
			params['p'] = '';
		}

		if (typeof this._staticPagesLinks[params['p']] != 'undefined') {
			content = JSON.parse(window.localStorage.getItem(this._staticPagesLinks[params['p']]));
			title = this._pagesTitles[this._staticPagesLinks[params['p']]];
		}
		else if (params['p'] == 'serv_rent') {
			content = this.getHouses(params);
			title = 'Houses for sale';
		}
		else if (params['p'] == 'search' && typeof params['q'] != 'undefined' && params['q'] != '') {
			content = this.search(params['q']);
			title = 'Search';
		}
		else {
			content = JSON.parse(window.localStorage.getItem('page_404'));
		}
		return {content: content, title: title, p: params['p']};
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

	createURL(params) {
		let url = this.mainFile;
		if (typeof params == 'object') {
			url = url + '?';
			for (let key in params) {
				url = url + key + '=' + params[key] + '&';
			}
			url = url.slice(0, -1);
		}
		return url;
	}

	search(searchString) {
		let searchResult = [];
		if (searchString != '') {
			for (let p in this._staticPagesLinks) {
				if (p != '') {
					let pcontent = JSON.parse(window.localStorage.getItem(this._staticPagesLinks[p])).replace(/<\/?[^>]+>/gi, '');
					if (pcontent.indexOf(searchString) != -1) {
						searchResult.push({
							link: this.createURL({p: p}), 
							title: this._pagesTitles[this._staticPagesLinks[p]]
						});
					}
				}
			}
		}

		let doc = document.implementation.createHTMLDocument('tmp');
		let el = doc.createElement('div');
		doc.body.appendChild(el);
		let content = JSON.parse(window.localStorage.getItem('page_search'));
		el.innerHTML = content;

		if (searchResult.length) {
			
			let searchUL = doc.getElementById('search-results');
			for (let res in searchResult) {
				let link = doc.querySelector('#search-results-row-template a').cloneNode();
				link.setAttribute('href', searchResult[res]['link']);
				link.innerHTML = searchResult[res]['title'];
				let ul = searchUL.appendChild(document.createElement('li'));
				ul.appendChild(link);
			}
		} else {
			doc.getElementById('search-row-no-results').classList.remove("hidden");
		}
		
		return el.innerHTML;

	}

	getHouses(params) {

		let houses = JSON.parse(window.localStorage.getItem('houses'));
		let housesForPage = [];
		let content = JSON.parse(window.localStorage.getItem('page_serv_rent'));
		let sortv = 'id';
		if (typeof params['sortv'] != 'undefined') { sortv = params['sortv']; }

		// filter and prepare to sort
		for (let h in houses) {
			if (
					(typeof params['pricemin'] == 'undefined' || params['pricemin'] == '' || houses[h]['price'] >= params['pricemin'])
				&&	(typeof params['pricemax'] == 'undefined' || params['pricemax'] == '' || houses[h]['price'] <= params['pricemax'])
				&&	(typeof params['florsmin'] == 'undefined' || params['florsmin'] == '' || houses[h]['floors'] >= params['floorsmin'])
				&&	(typeof params['florsmax'] == 'undefined' || params['florsmax'] == '' || houses[h]['floors'] <= params['floorsmax'])
				&&	(typeof params['bedrmmin'] == 'undefined' || params['bedrmmin'] == '' || houses[h]['bedrooms'] >= params['bedrmmin'])
				&&	(typeof params['bedrmmax'] == 'undefined' || params['bedrmmax'] == '' || houses[h]['bedrooms'] <= params['bedrmmax'])
				&&	(typeof params['bathrmin'] == 'undefined' || params['bathrmin'] == '' || houses[h]['bathrooms'] >= params['bathrmin'])
				&&	(typeof params['bathrmax'] == 'undefined' || params['bathrmax'] == '' || houses[h]['bathrooms'] <= params['bathrmax'])
				&&	(typeof params['yearbmin'] == 'undefined' || params['yearbmin'] == '' || houses[h]['yearbuilt'] >= params['yearbmin'])
				&&	(typeof params['yearbmax'] == 'undefined' || params['yearbmax'] == '' || houses[h]['yearbuilt'] <= params['yearbmax'])
				&&	(typeof params['dealtype'] == 'undefined' || params['dealtype'] == '' || houses[h]['dealtype'] == params['dealtype']) ) {
					housesForPage.push([houses[h], houses[h][sortv]]);
			}
		}
		console.log(housesForPage);
		//sort
		let asc = true;
		if (typeof params['sortd'] != 'undefined' && params['sortd'] == 'desc') { asc = false; }
		housesForPage.sort(function(a, b) {
			return ((asc) ? (a[1] - b[1]) : (b[1] - a[1]));
		})
		let totalFilteredHouses = housesForPage.length;
		let perPage = 3;
		if (typeof params['page'] == 'undefined') { params['page'] = 1; }
		params['page'] = parseInt(params['page']);
		housesForPage = housesForPage.slice(perPage * (params['page'] - 1), perPage * params['page']);

		let paginationNums = [], paginationPrev = false, paginationNext = false;
		if (housesForPage.length) {
			let doc = document.implementation.createHTMLDocument('tmp');
			let el = doc.createElement('div');
			doc.body.appendChild(el);
			el.innerHTML = content;
			// doc.getElementById('housesSortPrice').value = ((asc) ? 'asc' : 'desc');
			doc.getElementById('housesSortPrice').value = 'asc';
			console.log(doc.getElementById('housesSortPrice').value);
			// doc.getElementById('housesSortPrice').options[((asc) ? 'asc' : 'desc')].setAttribute('selected');
			//  houses
			let wrapper = doc.getElementById("housesIndexWrapper");
			for (let i in housesForPage) {
				let propTemplate = doc.getElementById("propTemplate").cloneNode(true);
				propTemplate.setAttribute('id', 'propTemplateCandidate');
				wrapper.appendChild(propTemplate);
				doc.querySelector('#propTemplateCandidate .address').innerHTML = housesForPage[i][0]['address'];
				doc.querySelector('#propTemplateCandidate .zip').innerHTML = housesForPage[i][0]['zip'];
				doc.querySelector('#propTemplateCandidate .bedrooms').innerHTML = housesForPage[i][0]['bedrooms'];
				doc.querySelector('#propTemplateCandidate .bathrooms').innerHTML = housesForPage[i][0]['bathrooms'];
				doc.querySelector('#propTemplateCandidate .year').innerHTML = housesForPage[i][0]['yearbuilt'];
				doc.querySelector('#propTemplateCandidate .price').innerHTML = housesForPage[i][0]['price'];
				doc.querySelector('#propTemplateCandidate .descr').innerHTML = housesForPage[i][0]['description'];
				doc.querySelector('#propTemplateCandidate').classList.remove('hidden');
				doc.querySelector('#propTemplateCandidate').removeAttribute('id');
			}

			// pagination buttons
			
			let nextParams = JSON.parse(JSON.stringify(params));
			console.log(params['page'], totalFilteredHouses);
			doc.getElementById('houses-pag-num-self').innerHTML = params['page'];
			for (let i = -2; i < 3; i++) {
				let pageCandidate = params['page'] + i;
				console.log(i, pageCandidate, (totalFilteredHouses / perPage + 1));
				if (pageCandidate != params['page'] && pageCandidate > 0 && pageCandidate <= Math.ceil(totalFilteredHouses / perPage)) {
					nextParams['page'] = pageCandidate;
					let link = this.createURL(nextParams);
					if (i == -1) {
						doc.querySelector('#houses-pag-prev a').setAttribute('href', link);
						doc.querySelector('#houses-pag-prev a').classList.add('active-pag-link');
						doc.getElementById('houses-pag-prev').classList.remove('hidden');
					}
					if (i == 1) {
						doc.querySelector('#houses-pag-next a').setAttribute('href', link);
						doc.querySelector('#houses-pag-next a').classList.add('active-pag-link');
						doc.getElementById('houses-pag-next').classList.remove('hidden');
					}
					doc.querySelector('#houses-pag-num-' + (i + 3) + ' a').setAttribute('href', link);
					doc.querySelector('#houses-pag-num-' + (i + 3) + ' a').innerHTML = pageCandidate;
					doc.querySelector('#houses-pag-num-' + (i + 3) + ' a').classList.add('active-pag-link');
					doc.getElementById('houses-pag-num-' + (i + 3)).classList.remove('hidden');
				}
			}
			content = el.innerHTML;
		}

		return content;
	}

}


window.onload = function() {
	let router = new Router();
	let page = router.getPage(window.location.href);
	document.getElementById('main').innerHTML = page['content'];
	document.title = page['title'];
	router.setPagesEvents(page['p']);
}


	
