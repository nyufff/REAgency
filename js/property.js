
/*
window.onload = function() {

    let addProp = document.getElementById('addP');
    addProp.onclick = function(event) {
        let prop = JSON.parse(window.localStorage.getItem('property'));
        let setAddress = document.getElementById('address').value;
        //let setZip = document.getElementById('zip').value;
        let setFloors = document.getElementById('floors').value;
        let setRooms = document.getElementById('rooms').value;
        let setPrice = document.getElementById('price').value;
        //let setArea = document.getElementById('area').value;
        let setDescr = document.getElementById('descr').value;
        prop.push({
            address: setAddress,
            //zip: setZip,
            floors: setFloors,
            rooms: setRooms,
            price: setPrice + ' $',
            //area: setArea,
            description: setDescr
        });
        window.localStorage.setItem('property', JSON.stringify(prop));
    }
}
*/
