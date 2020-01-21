let properties = [
{id:1, address: 'Lake street', floors: '2', rooms: '5', price: "210000 $", description: "Ygjhdihkjfkvjkbhkjjbkjg"},
{id:2, address: 'Main street', floors: '1', rooms: '8', price: "285000 $", description: "gbbgfhgjgjkkvjkbhkjjbkjg"},
{id:3, address: 'Happy street', floors: '1', rooms: '15', price: "2105500 $", description: "Ygjhdihfghjgyjukkjjbkjg"},
{id:4, address: 'Huge avenue', floors: '3', rooms: '4', price: "205000 $", description: "ghfthgjpp'pbhkjjbkjg"},
{id:5, address: 'Ninth avenue', floors: '1', rooms: '10', price: "189000000 $", description: "Hkjhdfkjdlfjkdhvklbkjg"},
];

window.localStorage.setItem('properties', JSON.stringify(properties));
const addProp = document.getElementById('addProp');

window.onload = function() {

    addProp.onclick = function() {
    /*
        let addressP = document.getElementById('address').value;
        let zipP = document.getElementById('zip').value;
        let floorsP = document.getElementById('floors').value;
        let roomsP = document.getElementById('rooms').value;
        let priceP = document.getElementById('price').value;
        let areaP = document.getElementById('area').value;
        let descriptionP = document.getElementById('descr').value;
        properties.push({
            address: addressP,
            zip: zipP,
            floors: floorsP,
            rooms: roomsP,
            price: priceP,
            area: areaP,
            description: descriptionP
        });
    */
    }

    showProp();
 }

 function showProp() {
    let prop = JSON.parse(window.localStorage.getItem('properties'));
    let templ = document.getElementById('propTempl');
    let add
    let table = templates.getElementsByClassName('users_table')[0].cloneNode(true);
    let row = templates.getElementsByClassName('user_row')[0];
    let content = document.getElementById('content');
    for (const [id, user] of Object.entries(users)) {
        let userRow = row.cloneNode(true);
        userRow.querySelector('.user_name').innerText = user.name;
        userRow.querySelector('.user_status').innerText = ((loggedInUsers.indexOf(parseInt(id)) != -1) ? 'logged in' : 'afk');
        table.append(userRow);
    }
    content.append(table);
}