export default
    class Router {
    constructor(routes) {
        this.routes = routes;
        this.rootElem = document.getElementById('main');
        window.addEventListener('hashchange', () => this.hasChanged(this));
        if (window.location.hash) {
            this.hasChanged(this);
        }
        routes.filter(route => route.default).forEach(route => this.goToRoute(route.htmlName));
    }

    hasChanged(scope) {
        console.log(window.location.hash);
        scope.goToRoute(scope.routes.filter(route => '#' + route.name == window.location.hash)[0].htmlName);
    }

    goToRoute(htmlName) {
        const url = 'pages/' + htmlName;

        fetch(url)
            .then(response => response.text())
            .then(text => this.rootElem.innerHTML = text);
    }
}