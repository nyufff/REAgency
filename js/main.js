
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

	constructor () {

		this.templates = {'': 'page_home', 'home': 'page_home', 'about_us': 'page_about_us',
								'services': 'page_services', 'serv_rent': 'page_serv_rent', 'search': 'page_search',
								'serv_owners': 'page_serv_owners', 'prop_manag': 'page_prop_manag',
								'contacts': 'page_contacts', 'login_page': 'page_login_page'};
		this.pagesTitles = {'page_home': 'Home', 'page_about_us': 'About Us', 'page_services': 'Services',
							'page_serv_rent': 'Buy/Rent', 'page_serv_owners': 'For Owners', 
							'page_prop_manag': 'Property Management', 'page_contacts': 'Contact Us',
							'page_login_page': "Log In"};
		this.mainFile = 'index.html';
		this.pagPerPage = 3;

		let url = window.location.href;
		if (url.indexOf('?') !== -1) {
			this.path = url.substring(0, url.indexOf('?'));
		} else {
			this.path = url;
		}
		this.setGlobalEvents();
	}

	setGlobalEvents () {
		let router = this;	
		Array.from(document.querySelectorAll("a.innerLink")).forEach(link => {
		    link.addEventListener('click', function(event) {
		    	event.preventDefault();
		    	let url = event.currentTarget.href
		    	let urlParams = router.parseURL(url);
		    	router.changePage(url, urlParams);
		    });
		});
		document.getElementById("searchForm").addEventListener('submit', function(event) {
	    	event.preventDefault();
	    	let searchString = document.getElementById('searchString').value;
	    	let urlParams = {p: 'search', q: searchString};
	    	let url = router.createURL(urlParams);
	    	router.changePage(url, urlParams);
		});
	}

	setTemplate(urlParams) {
		if (typeof urlParams['p'] == 'undefined') {
			urlParams['p'] = '';
		}
		let template = JSON.parse(localStorage.getItem(this.templates[urlParams['p']]));
		if (typeof template == 'string') {
			document.title = this.pagesTitles[this.templates[urlParams['p']]];
			document.getElementById('main').innerHTML = template;
			return true;
		}

		template = JSON.parse(localStorage.getItem('page_404'));
		document.title = 'Page Not Found';
		document.getElementById('main').innerHTML = template;
		return false;
	}

	changePage(url, urlParams) {
		window.history.replaceState({}, "Title", url);
    	if (this.setTemplate(urlParams)) {
    		this.setPage(urlParams);
    	}
	}

	getUser() {
		let cookies = document.cookie;
		if (!cookies.length) { return false; }
		let c1 = cookies.split(';');
		if (!c1.length) { return false; }

		let hash = false;

		for (let c in c1) {
			let c2 = c1[c].trim().split('=');
			if (c2[0] == 'h') { hash = c2[1]; }
		}

		let user = false;
		let loggedInUsers = JSON.parse(sessionStorage.getItem('users'));
		if (typeof loggedInUsers[hash] == 'undefined') {
			document.getElementById('menu-link-registration').classList.remove('hidden');
			return false;
		} else {
			document.getElementById('menu-link-registration').classList.add('hidden');
			let users = JSON.parse(localStorage.getItem('users'));
			if (typeof users[loggedInUsers[hash]] != 'undefined') {
				return users[loggedInUsers[hash]];
			}
		}
		

		
	}

	setPage (urlParams) {
		let user = this.getUser();

		if (urlParams['p'] == 'serv_rent') {
			this.setPageHouses(urlParams);
		}
		else if (urlParams['p'] == 'search' && typeof urlParams['q'] != 'undefined' && urlParams['q'] != '') {
			this.setPageSearch(urlParams['q']);
		}
		else if (urlParams['p'] == 'login_page') {
			this.logreg(urlParams);
		}

	}

	logreg (urlParams) {

		let router = this;
		//registration
		document.getElementById('registration-form').addEventListener('submit', function(event){
			event.preventDefault();
			let users = JSON.parse(localStorage.getItem('users'));
			let name = document.getElementById('registration-form-name').value;
			let email = document.getElementById('registration-form-email').value;
			let pass = document.getElementById('registration-form-pass').value;
			if (name != name.replace(/[^a-zA-Z0-9.-]/g, '') || name.length < 5 || email != email.replace(/[^a-zA-Z0-9.-@]/g, '') || pass.length < 7) {
				document.getElementById('reg-login-info').innerHTML = "Wrong credentials. Fix and try again";
				return false;
			} else {
				document.getElementById('reg-login-info').innerHTML = "";
				let nextId = 0; 
				let dup = false;
				for (let u in users) { 
					if (parseInt(users[u]['id']) > nextId) { 
						nextId = parseInt(users[u]['id']); 
					}
					if (users[u]['login'] == email) {
						dup = true;
					}
				}
				if (dup == true) {
					document.getElementById('reg-login-info').innerHTML = "This user is already registered. Fix and try again";
					return false;
				}
				users[nextId + 1] = {id:nextId + 1, name: name, login: email, pass: pass};
				localStorage.setItem('users', JSON.stringify(users));
			}
			let url = router.createURL(urlParams);
			router.changePage(url, urlParams);
		});

		//login
		document.getElementById('login-form').addEventListener('submit', function(event){
			event.preventDefault();
			let users = JSON.parse(localStorage.getItem('users'));
			let email = document.getElementById('login-login').value;
			let pass = document.getElementById('login-pass').value;
			let user = null;
			for (let u in users) { 
				if (users[u]['login'] == email && users[u]['pass'] == pass) { 
					user = users[u]; 
				}
			}
			if (typeof user != 'object') {
				document.getElementById('reg-login-info').innerHTML = "Wrong login or password. Fix and try again";
				return false;
			}

			let loggedInUsers = JSON.parse(sessionStorage.getItem('users'));
			let hash = ''; 
			do {
				hash = '';
				for (let i=0; i<11; i++) {
					let r = Math.random().toString(36).substring(10);
					hash += r;
				}
			} while (typeof loggedInUsers[hash] != 'undefined');
			
			loggedInUsers[hash] = user['id'];
			sessionStorage.setItem('users', JSON.stringify(loggedInUsers));
			document.cookie = "h=" + hash + "; max-age=3600";

			urlParams['p'] = '';
			let url = router.createURL(urlParams);
			router.changePage(url, urlParams);
		});
	}

	setHomesEvents (urlParams) {
		let router = this;
		document.getElementById('housesSortPrice').addEventListener('change', function(event){
			urlParams['sortv'] = 'price';
			urlParams['sortd'] = event.currentTarget.value;
			let url = router.createURL(urlParams);
			router.changePage(url, urlParams);
		});

		document.getElementById('houses-filters-form').addEventListener('submit', function(event){
			event.preventDefault();
			urlParams = {};
			Array.from(document.querySelectorAll('#houses-filters-form input, #houses-filters-form select')).forEach(function(el){
				urlParams[el.name] = el.value;
			});
			let url = router.createURL(urlParams);
			router.changePage(url, urlParams);
		});

		document.getElementById('houses-filters-clear').addEventListener('click', function(event){
			event.preventDefault();
			urlParams = {p: urlParams['p']};
			let url = router.createURL(urlParams);
			router.changePage(url, urlParams);
		});

		Array.from(document.querySelectorAll("#pagination-box a")).forEach(link => {
		    link.addEventListener('click', function(event) {
		    	event.preventDefault();
		    	let url = event.currentTarget.href
		    	let urlParams = router.parseURL(url);
		    	router.changePage(url, urlParams);
		    });
		});
	}

	parseURL (url) {
		let urlParams = {};
		if (url.indexOf('?') !== -1 && url.indexOf('=') !== -1) {
			let urlParamsString = url.substring(url.indexOf('?') + 1);
			let pairs = urlParamsString.split('&');
			pairs.forEach (function(el) {
				let kv = el.split('=');
				urlParams[kv[0]] = kv[1];
			});
		}
		return urlParams;
	}

	createURL (urlParams) {
		let url = this.mainFile;
		if (typeof urlParams == 'object') {
			url = url + '?';
			for (let key in urlParams) {
				url = url + key + '=' + urlParams[key] + '&';
			}
			url = url.slice(0, -1);
		}
		return url;
	}

	setPageSearch (searchString) {
		let searchResult = [];
		if (searchString != '') {
			for (let p in this.templates) {
				if (p != '') {
					let pcontent = JSON.parse(localStorage.getItem(this.templates[p])).replace(/<\/?[^>]+>/gi, '');
					if (pcontent.indexOf(searchString) != -1) {
						searchResult.push({
							link: this.createURL({p: p}), 
							title: this.pagesTitles[this.templates[p]]
						});
					}
				}
			}
		}

		if (searchResult.length) {
			
			let searchUL = document.getElementById('search-results');
			for (let res in searchResult) {
				let link = document.querySelector('#search-results-row-template a').cloneNode();
				link.setAttribute('href', searchResult[res]['link']);
				link.innerHTML = searchResult[res]['title'];
				let ul = searchUL.appendChild(document.createElement('li'));
				ul.appendChild(link);
			}
		} else {
			document.getElementById('search-row-no-results').classList.remove("hidden");
		}

	}




	setPageHouses (urlParams) {

		let houses = JSON.parse(localStorage.getItem('houses'));
		let housesForPage = [];
		let sortv = 'id';
		if (typeof urlParams['sortv'] != 'undefined') { sortv = urlParams['sortv']; }
		let sortasc = true;
		if (typeof urlParams['sortd'] != 'undefined' && urlParams['sortd'] == 'desc') { sortasc = false; }
		document.getElementById('housesSortPrice').value =  ((sortasc) ? 'asc' : 'desc');

		// filter and prepare to sort
		for (let h in houses) {
			if (
					(typeof urlParams['pricemin'] == 'undefined' || urlParams['pricemin'] == '' || houses[h]['price'] >= urlParams['pricemin'])
				&&	(typeof urlParams['pricemax'] == 'undefined' || urlParams['pricemax'] == '' || houses[h]['price'] <= urlParams['pricemax'])
				&&	(typeof urlParams['floorsmin'] == 'undefined' || urlParams['floorsmin'] == '' || houses[h]['floors'] >= urlParams['floorsmin'])
				&&	(typeof urlParams['floorsmax'] == 'undefined' || urlParams['floorsmax'] == '' || houses[h]['floors'] <= urlParams['floorsmax'])
				&&	(typeof urlParams['bedrmmin'] == 'undefined' || urlParams['bedrmmin'] == '' || houses[h]['bedrooms'] >= urlParams['bedrmmin'])
				&&	(typeof urlParams['bedrmmax'] == 'undefined' || urlParams['bedrmmax'] == '' || houses[h]['bedrooms'] <= urlParams['bedrmmax'])
				&&	(typeof urlParams['bathrmin'] == 'undefined' || urlParams['bathrmin'] == '' || houses[h]['bathrooms'] >= urlParams['bathrmin'])
				&&	(typeof urlParams['bathrmax'] == 'undefined' || urlParams['bathrmax'] == '' || houses[h]['bathrooms'] <= urlParams['bathrmax'])
				&&	(typeof urlParams['yearbmin'] == 'undefined' || urlParams['yearbmin'] == '' || houses[h]['yearbuilt'] >= urlParams['yearbmin'])
				&&	(typeof urlParams['yearbmax'] == 'undefined' || urlParams['yearbmax'] == '' || houses[h]['yearbuilt'] <= urlParams['yearbmax'])
				&&	(typeof urlParams['dealtype'] == 'undefined' || urlParams['dealtype'] == '' || houses[h]['dealtype'] == urlParams['dealtype']) ) {
					housesForPage.push([houses[h], houses[h][sortv]]);
			}
		}
		//sort
		housesForPage.sort(function(a, b) {
			return ((sortasc) ? (a[1] - b[1]) : (b[1] - a[1]));
		})

		let totalFilteredHouses = housesForPage.length;
		document.getElementById('houses-found-counter').innerHTML = totalFilteredHouses;
		if (typeof urlParams['page'] == 'undefined') { urlParams['page'] = 1; }
		urlParams['page'] = parseInt(urlParams['page']);
		housesForPage = housesForPage.slice(this.pagPerPage * (urlParams['page'] - 1), this.pagPerPage * urlParams['page']);

		let paginationNums = [], paginationPrev = false, paginationNext = false;
		if (housesForPage.length) {
			let images = JSON.parse(localStorage.getItem('images'));
			let houseImages = {};
			for (let im in images) {
				if (typeof houseImages[images[im]['houseId']] == 'undefined') {
					houseImages[images[im]['houseId']] = [];
				}
				houseImages[images[im]['houseId']].push(images[im]);
			}

			let wrapper = document.getElementById("housesIndexWrapper");
			for (let i in housesForPage) {
				let propTemplate = document.getElementById("propTemplate").cloneNode(true);
				propTemplate.setAttribute('id', 'propTemplateCandidate');
				wrapper.appendChild(propTemplate);
				if (typeof houseImages[housesForPage[i][0]['id']] != 'undefined' && typeof houseImages[housesForPage[i][0]['id']][0] != 'undefined') {
					document.querySelector('#propTemplateCandidate .img-prop').src = houseImages[housesForPage[i][0]['id']][0]['link'];
				}
				document.querySelector('#propTemplateCandidate .address').innerHTML = housesForPage[i][0]['address'];
				document.querySelector('#propTemplateCandidate .address').innerHTML = housesForPage[i][0]['address'];
				document.querySelector('#propTemplateCandidate .zip').innerHTML = housesForPage[i][0]['zip'];
				document.querySelector('#propTemplateCandidate .bedrooms').innerHTML = housesForPage[i][0]['bedrooms'];
				document.querySelector('#propTemplateCandidate .bathrooms').innerHTML = housesForPage[i][0]['bathrooms'];
				document.querySelector('#propTemplateCandidate .year').innerHTML = housesForPage[i][0]['yearbuilt'];
				document.querySelector('#propTemplateCandidate .floors').innerHTML = housesForPage[i][0]['floors'];
				document.querySelector('#propTemplateCandidate .price').innerHTML = housesForPage[i][0]['price'];
				document.querySelector('#propTemplateCandidate .descr').innerHTML = housesForPage[i][0]['description'];
				document.querySelector('#propTemplateCandidate').classList.remove('hidden');
				document.querySelector('#propTemplateCandidate').removeAttribute('id');
			}

			// pagination buttons
			
			let nexturlParams = JSON.parse(JSON.stringify(urlParams));
			document.getElementById('houses-pag-num-self').innerHTML = urlParams['page'];
			for (let i = -2; i < 3; i++) {
				let pageCandidate = urlParams['page'] + i;
				if (pageCandidate != urlParams['page'] && pageCandidate > 0 && pageCandidate <= Math.ceil(totalFilteredHouses / this.pagPerPage)) {
					nexturlParams['page'] = pageCandidate;
					let link = this.createURL(nexturlParams);
					if (i == -1) {
						document.querySelector('#houses-pag-prev a').setAttribute('href', link);
						document.querySelector('#houses-pag-prev a').classList.add('active-pag-link');
						document.getElementById('houses-pag-prev').classList.remove('hidden');
					}
					if (i == 1) {
						document.querySelector('#houses-pag-next a').setAttribute('href', link);
						document.querySelector('#houses-pag-next a').classList.add('active-pag-link');
						document.getElementById('houses-pag-next').classList.remove('hidden');
					}
					document.querySelector('#houses-pag-num-' + (i + 3) + ' a').setAttribute('href', link);
					document.querySelector('#houses-pag-num-' + (i + 3) + ' a').innerHTML = pageCandidate;
					document.querySelector('#houses-pag-num-' + (i + 3) + ' a').classList.add('active-pag-link');
					document.getElementById('houses-pag-num-' + (i + 3)).classList.remove('hidden');
				}
			}
			for(let par in urlParams) {
				if(document.getElementById('houses-filter-' + par)) {
					document.getElementById('houses-filter-' + par).value = urlParams[par];
				}
			}
			this.setHomesEvents(urlParams);
		}
	}


}


window.onload = function() {
	document.cookie = "h2=asdf; max-age=3600";
	document.cookie = "h3=1234; max-age=3600";
	document.cookie = "h4=fdsagdsf; max-age=3600";
	sessionStorage.setItem('users', JSON.stringify({}));
	let router = new Router();
	let urlParams = router.parseURL(window.location.href);
	router.changePage(window.location.href, urlParams);
}


	
