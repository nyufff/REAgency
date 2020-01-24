import Router from './router.js';
import Route from './route.js';
var router = new Router([
    new Route('home', 'home.html', true),
    new Route('about_us', 'about_us.html'),
    new Route('services', 'services.html'),
    new Route('buy_rent', 'buy_rent.html'),
    new Route('for_owners', 'for_owners.html'),
    new Route('contacts', 'contacts.html'),
    new Route('login', 'login.html')
]);