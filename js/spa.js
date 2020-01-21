import Router from './router.js';
import Route from './route.js';
var router = new Router([
    new Route('home', 'home.html', true),
    new Route('about', 'about_us.html'),
    new Route('contacts', 'contacts.html'),
    new Route('for_owners', 'for_owners.html'),
    new Route('services', 'services.html'),
    new Route('buy_rent', 'buy_rent.html')
]);