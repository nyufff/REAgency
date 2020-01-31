
class SPA {

	constructor () {

		this.user = {};
		this.logged = false;

		this.templates = {'': 'page_home', 'home': 'page_home', 'about_us': 'page_about_us',
								'services': 'page_services', 'serv_rent': 'page_serv_rent', 'search': 'page_search',
								'serv_owners': 'page_serv_owners', 'owners_prop': 'page_serv_rent', 
								'prop_manag': 'page_prop_manag', 'prop_card': 'page_prop_card',
								'contacts': 'page_contacts', 'login_page': 'page_login_page'};
		this.pagesTitles = {'home': '', '': '', 'about_us': 'About Us', 'services': 'Services',
							'serv_rent': 'Buy/Rent', 'serv_owners': 'Add Propperty', 'owners_prop': 'Your Property', 
							'prop_manag': 'Property Management', 'contacts': 'Contact Us', 'search': 'Search',
							'login_page': "", 'prop_card': '',};
		this.mainFile = 'index.html';
		this.pagPerPage = 10;

		let url = window.location.href;
		if (url.indexOf('?') !== -1) {
			this.path = url.substring(0, url.indexOf('?'));
		} else {
			this.path = url;
		}
		this.setGlobalEvents();
	}

	setGlobalEvents () {
		let app = this;	
		Array.from(document.querySelectorAll("a.innerLink")).forEach(link => {
		    link.addEventListener('click', function(event) {
		    	event.preventDefault();
		    	let url = event.currentTarget.href
		    	let urlParams = app.parseURL(url);
		    	app.changePage(url, urlParams);
		    });
		});
		document.getElementById("searchForm").addEventListener('submit', function(event) {
	    	event.preventDefault();
	    	let searchString = document.getElementById('searchString').value;
	    	let urlParams = {p: 'search', q: searchString};
	    	let url = app.createURL(urlParams);
	    	app.changePage(url, urlParams);
		});
		document.getElementById('site-logout-link').addEventListener('click', function(event) {
			event.preventDefault();
			app.logout();
		});
	}

	logout () {
		let loggedInUsers = JSON.parse(sessionStorage.getItem('users'));
		if (typeof loggedInUsers != 'object' || loggedInUsers == null) {
			loggedInUsers = {};
		}
		for (let u in loggedInUsers) {
			if (this.user['id'] == loggedInUsers[u]) {
				delete loggedInUsers[u];
			}
		}
		sessionStorage.setItem('users', JSON.stringify(loggedInUsers));
    	let urlParams = {p: ''};
    	let url = this.createURL(urlParams);
    	this.changePage(url, urlParams);
	}

	setTemplate(urlParams) {
		if (typeof urlParams['p'] == 'undefined') {
			urlParams['p'] = '';
		}
		let template = JSON.parse(localStorage.getItem(this.templates[urlParams['p']]));
		if (typeof template == 'string') {
			document.title = this.pagesTitles[urlParams['p']];
			document.getElementById('main').innerHTML = template;
			document.getElementById('page-title').innerHTML = this.pagesTitles[urlParams['p']];
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


	logRegOff () {
		document.getElementById('menu-link-reg-log').classList.add('hidden');
		document.getElementById('meny-link-profile-logaut').classList.remove('hidden');
	}

	logRegOn () {
		document.getElementById('menu-link-reg-log').classList.remove('hidden');
		document.getElementById('meny-link-profile-logaut').classList.add('hidden');
		this.user = {};
	}

	getUser() {
		let cookies = document.cookie;

		if (!cookies.length) { this.logRegOn(); return false; }
		let c1 = cookies.split(';');
		if (!c1.length) { this.logRegOn(); return false; }

		let hash = false;

		for (let c in c1) {
			let c2 = c1[c].trim().split('=');
			if (c2[0] == 'h') { hash = c2[1]; }
		}

		let user = false;
		let loggedInUsers = JSON.parse(sessionStorage.getItem('users'));

		if (!hash || typeof loggedInUsers != 'object' || loggedInUsers == null || typeof loggedInUsers[hash] == 'undefined') {
			this.logRegOn(); return false;
		} else {
			let users = JSON.parse(localStorage.getItem('users'));

			if (typeof users[loggedInUsers[hash]] != 'undefined') {
				this.logRegOff();
				this.user = users[loggedInUsers[hash]];
			} else {
				delete loggedInUsers[hash];
				sessionStorage.setItem('users', JSON.stringify(loggedInUsers));
		    	let urlParams = {p: ''};
		    	let url = this.createURL(urlParams);
		    	this.changePage(url, urlParams);
			}
			
		}
		

		
	}

	setPage (urlParams) {
		this.getUser();

		if (urlParams['p'] == 'serv_rent') {
			this.setPageHouses(urlParams);
		}
		else if (urlParams['p'] == 'search' && typeof urlParams['q'] != 'undefined' && urlParams['q'] != '') {
			this.setPageSearch(urlParams['q']);
		}
		else if (urlParams['p'] == 'login_page') {
			this.logreg(urlParams);
		}
		else if (urlParams['p'] == 'serv_owners') {
			this.newHouse(urlParams);
		}
		else if (urlParams['p'] == 'owners_prop') {
			this.setPageHouses(urlParams);
		}
		else if (urlParams['p'] == 'prop_card') {
			this.setPageHouseGallery(urlParams);
		}

	}

	setPageHouseGallery(urlParams) {

		let houses = JSON.parse(localStorage.getItem('houses'));
		if (typeof urlParams['houseid'] == 'undefined' || typeof houses[urlParams['houseid']] == 'undefined') { 
			let urlParams = {p: 'serv_rent'};
			let url = this.createURL(urlParams);
			this.changePage(url, urlParams);
			return false;
		}
		let house  = houses[urlParams['houseid']];

		let prop = document.getElementById('house-prop-box');
		let images = JSON.parse(localStorage.getItem('images'));
		let galleryBox = document.getElementById('house-gallery-box');
		for (let im in images) {
			if (images[im]['houseId'] == urlParams['houseid']) {
				let img = galleryBox.querySelector('.img-box').cloneNode(true);
				img.classList.remove('hidden');
				img.querySelector('img').src = images[im]['link'];
				galleryBox.appendChild(img);
			}
		}

		prop.querySelector('.address').innerHTML = house['address'];
		prop.querySelector('.zip').innerHTML = house['zip'];
		prop.querySelector('.bedrooms').innerHTML = house['bedrooms'];
		prop.querySelector('.bathrooms').innerHTML = house['bathrooms'];
		prop.querySelector('.year').innerHTML = house['yearbuilt'];
		prop.querySelector('.floors').innerHTML = house['floors'];
		prop.querySelector('.price').innerHTML = house['price'];
		prop.querySelector('.descr').innerHTML = house['description'];
		if (house['userid'] == this.user['id']) {
			'&origin=' + urlParams['p'];
			prop.querySelector('.houses-delete-property-btn').dataset['id'] = house['id'];
			prop.querySelector('.houses-delete-property-btn').classList.remove('hidden');
			if (typeof urlParams['origin'] != 'undefined') {
				prop.querySelector('.houses-delete-property-btn').dataset['origin'] = urlParams['origin'];
			}
		}

		this.setHouseDeleteEvent();

	}

	newHouse(urlParams) {
		let app = this;
		document.getElementById('add-house-form').addEventListener('submit', function(event) {
			event.preventDefault();
			let newHouse = {};

			let validation = [];
			Array.from(document.querySelectorAll('#add-house-form .add-house-param')).forEach(function(el) {
				if (el.value.replace(/[^a-zA-Z0-9.\-_@#$\"\'\\\/\: ]/g, '') != el.value || (el.attributes.required && el.value.length < 1)) {
					validation.push(el.name);
				} else {
					newHouse[el.name] = el.value;
				}
			});

			if (validation.length) {
				document.getElementById('page-info').innerHTML = "Wrong data. Fix and try again";
				return false;
			}

			newHouse['userid'] = app.user['id'];
			let houses = JSON.parse(localStorage.getItem('houses'));
			let lastId = 0;
			for (let i in houses) { if (lastId < houses[i]['id']) { lastId = houses[i]['id']; } }
			newHouse['id'] = ++lastId;
			houses[lastId] = newHouse;
			localStorage.setItem('houses', JSON.stringify(houses));
			document.getElementById('page-info').insertAdjacentHTML('beforeend', "new house is added");

			let pics = [];
			Array.from(document.querySelectorAll('#add-house-form .add-pic-param')).forEach(function(el) {
				if (el.value.length < 1) {
					validation.push(el.name);
				} else {
					pics.push(decodeURI(el.value));
				}
			});
			if (pics.length) {
				let images = JSON.parse(localStorage.getItem('images'));
				lastId = 0;
				for (let i in images) { if (lastId < images[i]['id']) { lastId = images[i]['id']; } }
				pics.forEach(function(pic) {
					images[++lastId] = {id: lastId, houseId: newHouse['id'], link: pic};
				});
				localStorage.setItem('images', JSON.stringify(images));
				document.getElementById('page-info').insertAdjacentHTML('beforeend', "<br>new images added for the house");
			}
		});

		app.newPickEvent();

	}


	newPickEvent() {
		let app = this;
		Array.from(document.querySelectorAll('.addpic')).forEach(el => {
			el.addEventListener('change', function(event) {
				let allFilled = Array.from(document.querySelectorAll('.addpic')).every(function(el2) {
					return el2.value != '';
				})
				if (allFilled) {
					let picInput = document.querySelector('.add-house-new-pic').innerHTML;
					let newPic = document.querySelector('.add-house-new-pic').cloneNode();
					newPic.innerHTML = picInput;
					newPic.insertAdjacentHTML('beforeend', "<span class='add-house-delete-pic delete-cross link'> x</span>");
					document.getElementById('add-house-pics').appendChild(newPic);
					app.newPickEvent();
				}
			});
		});

		Array.from(document.querySelectorAll('.add-house-delete-pic')).forEach(el => {
			el.addEventListener('click', function(event) {
				event.currentTarget.parentNode.remove();
			});
		});


	}

	logreg (urlParams) {

		let app = this;
		//registration
		document.getElementById('registration-form').addEventListener('submit', function(event) {
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
			let url = app.createURL(urlParams);
			app.changePage(url, urlParams);
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
			if (typeof user != 'object' || user == null) {
				document.getElementById('reg-login-info').innerHTML = "Wrong login or password. Fix and try again";
				return false;
			}

			let loggedInUsers = JSON.parse(sessionStorage.getItem('users'));
			if (typeof loggedInUsers != 'object' || loggedInUsers == null) {
				loggedInUsers = {};
			}
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
			document.cookie = "h=" + hash;

			urlParams['p'] = 'owners_prop';
			let url = app.createURL(urlParams);
			app.changePage(url, urlParams);
		});
	}

	setHomesEvents (urlParams) {
		let app = this;
		document.getElementById('housesSortPrice').addEventListener('change', function(event){
			urlParams['sortv'] = 'price';
			urlParams['sortd'] = event.currentTarget.value;
			let url = app.createURL(urlParams);
			app.changePage(url, urlParams);
		});

		document.getElementById('houses-filters-form').addEventListener('submit', function(event){
			event.preventDefault();
			urlParams = {p: urlParams['p']};
			Array.from(document.querySelectorAll('#houses-filters-form input, #houses-filters-form select')).forEach(function(el){
				urlParams[el.name] = el.value;
			});
			let url = app.createURL(urlParams);
			app.changePage(url, urlParams);
		});

		document.getElementById('houses-filters-clear').addEventListener('click', function(event){
			event.preventDefault();
			urlParams = {p: urlParams['p']};
			let url = app.createURL(urlParams);
			app.changePage(url, urlParams);
		});

		Array.from(document.querySelectorAll("#pagination-box a")).forEach(link => {
		    link.addEventListener('click', function(event) {
		    	event.preventDefault();
		    	let url = event.currentTarget.href
		    	let urlParams = app.parseURL(url);
		    	app.changePage(url, urlParams);
		    });
		});

	}

	setHouseDeleteEvent() {
		let app = this;
		Array.from(document.querySelectorAll(".houses-delete-property-btn")).forEach(link => {
		    link.addEventListener('click', function(event) {
		    	let t = confirm("Are you sure? After clicking yes you will not be able to recover this property.")
		    	if (!t) { return false; }
		    	if (typeof event.currentTarget.dataset['id'] == 'undefined' || event.currentTarget.dataset['id'] == '') { return false; }
		    	let houseId = event.currentTarget.dataset['id'];
		    	let houses = JSON.parse(localStorage.getItem('houses'));
		    	if (typeof houses[houseId] == 'undefined' || houses[houseId]['userid'] != app.user['id']) { return false; }
		    	
		    	delete houses[houseId];
		    	localStorage.setItem('houses', JSON.stringify(houses));
		    	let images = JSON.parse(localStorage.getItem('images'));
		    	for (let im in images) {
		    		if (images[im]['houseId'] == houseId) {
		    			delete images[im];
		    		}
		    	}
		    	localStorage.setItem('images', JSON.stringify(images));

		    	let url = window.location.href;
		    	let urlParams = app.parseURL(url);
				if (typeof event.currentTarget.dataset['origin'] != 'undefined' &&  event.currentTarget.dataset['origin'] != '') {
					urlParams['p'] = event.currentTarget.dataset['origin'];
					url = app.createURL(urlParams);
				}

		    	app.changePage(url, urlParams);
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
							title: this.pagesTitles[p]
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
		let ownerId = false;
		if (typeof this.user['id'] != 'undefined') {
			ownerId = this.user['id'];
		}
		let housesForPage = [];
		let sortv = 'id';
		if (typeof urlParams['sortv'] != 'undefined') { sortv = urlParams['sortv']; }
		let sortasc = true;
		if (typeof urlParams['sortd'] != 'undefined' && urlParams['sortd'] == 'desc') { sortasc = false; }
		document.getElementById('housesSortPrice').value = (typeof urlParams['sortd'] != 'undefined' ? urlParams['sortd'] : "");

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
				&&	(typeof urlParams['dealtype'] == 'undefined' || urlParams['dealtype'] == '' || houses[h]['dealtype'] == urlParams['dealtype'])
				&&	(!ownerId || houses[h]['userid'] == ownerId) ) {
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
				let prop = document.querySelector('#propTemplateCandidate');
				if (typeof houseImages[housesForPage[i][0]['id']] != 'undefined' && typeof houseImages[housesForPage[i][0]['id']][0] != 'undefined') {
					prop.querySelector('.img-prop').src = houseImages[housesForPage[i][0]['id']][0]['link'];
				}
				let href = prop.querySelector('.house-gallery-link').href;
				href = href + housesForPage[i][0]['id'] + '&origin=' + urlParams['p'];

				Array.from(prop.querySelectorAll('.house-gallery-link')).forEach(el => {el.href = href;});
				prop.querySelector('.address').innerHTML = housesForPage[i][0]['address'];
				prop.querySelector('.zip').innerHTML = housesForPage[i][0]['zip'];
				prop.querySelector('.bedrooms').innerHTML = housesForPage[i][0]['bedrooms'];
				prop.querySelector('.bathrooms').innerHTML = housesForPage[i][0]['bathrooms'];
				prop.querySelector('.year').innerHTML = housesForPage[i][0]['yearbuilt'];
				prop.querySelector('.floors').innerHTML = housesForPage[i][0]['floors'];
				prop.querySelector('.price').innerHTML = housesForPage[i][0]['price'];
				prop.querySelector('.descr').innerHTML = housesForPage[i][0]['description'];
				if (housesForPage[i][0]['userid'] == ownerId) {
					prop.querySelector('.houses-delete-property-btn').dataset['id'] = housesForPage[i][0]['id'];
					prop.querySelector('.houses-delete-property-btn').dataset['origin'] = urlParams['p'];
					prop.querySelector('.houses-delete-property-btn').classList.remove('hidden');
				}
				prop.classList.remove('hidden');
				prop.removeAttribute('id');
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
			this.setHouseDeleteEvent();
		}

		for(let par in urlParams) {
			if(document.getElementById('houses-filter-' + par)) {
				document.getElementById('houses-filter-' + par).value = urlParams[par];
			}
		}
		this.setHomesEvents(urlParams);
	}


}


window.onload = function() {
	let app = new SPA();
	let urlParams = app.parseURL(window.location.href);
	app.changePage(window.location.href, urlParams);
}
