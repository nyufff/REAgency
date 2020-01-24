
// Header fade
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
	showProp();
}

function showProp() {
    let prop = JSON.parse(window.localStorage.getItem('houses'));
	let propTempl = document.getElementById('propTempl');
    for (let item in prop) {
		let elem = document.createElement('div');
        elem.classList.add("container");
        elem.classList.add("container-prop");
        let parent = document.querySelector('.prop');
        elem.append(propTempl.content.cloneNode(true));
		parent.append(elem);
			document.querySelectorAll(".address")[i].innerHTML = prop[item].address;
			//document.querySelectorAll(".zip")[i].innerHTML = prop[item].itemszip;
			document.querySelectorAll(".floors")[i].innerHTML = prop[item].floors;
			document.querySelectorAll(".bedrooms")[i].innerHTML = prop[item].bedrooms;
			document.querySelectorAll(".bathrooms")[i].innerHTML = prop[item].bathrooms;
			//document.querySelectorAll(".area")[i].innerHTML = prop[item].area;
			document.querySelectorAll(".price")[i].innerHTML = prop[item].price;
			document.querySelectorAll(".year")[i].innerHTML = prop[item].yearbuilt;
			document.querySelectorAll(".descr")[i].innerHTML = prop[item].description;
		}
	}

	
