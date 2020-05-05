// set up MCW components
const drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
            
const listEl = document.querySelector('.mdc-drawer .mdc-list');
const mainContentEl = document.querySelector('.main-content');
const button = document.querySelector('.mdc-top-app-bar__navigation-icon');

button.addEventListener('click', (event) => {
  if (drawer.open)
      drawer.open = false;
  else {
      drawer.open = true;
  }
});

// Lets fill in the datalist with states

fetch("https://covidtracking.com/api/v1/states/info.json")
    .then(response => response.json())
    .then(data => {
        for (x of data) {
            // console.log(x["state"]);
            let states = document.createElement("option");
            states.value = x["state"];
            document.querySelector("#states").appendChild(states);
        }
});

// keep an array of states selected and type of data selected
var selected_states = [];
var dtype_selected = [];
const urls = [];

// event listener for the add buttons
document.querySelector('#add_states').addEventListener('click', () => {
    let state = document.querySelector('#input_states').value;
    let select_list = document.querySelector('#states_selected');
    if (state != '') {
        selected_states.push(state);
        let node = document.createTextNode('|' + state + '| ');
        select_list.appendChild(node);
        urls.push("https://covidtracking.com/api/v1/states/" + state + "/daily.json");
    }
});

document.querySelector('#add_dtype').addEventListener('click', () => {
    let dtype = document.querySelector('#data_type').value;
    let select_list = document.querySelector('#dtype_selected');
    if (dtype != '') {
        dtype_selected.push(dtype);
        let node = document.createTextNode('|' + dtype + '| ');
        select_list.appendChild(node);
    }
});

console.log(urls);

const fetchData = (urlArray) => {
    const allRequests = urls.map(url =>
        fetch(url).then(response => response.json())
    );
    
    return Promise.all(allRequests);
};

// event listener for the create chart data
document.querySelector('#create_data').addEventListener('click', () => {
    var dtable = document.querySelector('#dtable');
    var header = dtable.createTHead();
    var hrow = header.insertRow();
    var dcell = hrow.insertCell();
    dcell.innerHTML = "Date"
    fetchData(urls).then (responses => {
        // insert dates from the cell with the biggest array length
        let largestArray = responses[0];
        console.log(largestArray);
        for (var i = 0; i < responses.length; i++) {
                if (largestArray.length < responses[i])
                    largestArray = responses[i];
        }
        for (var j = largestArray.length - 1; j > 0; j--) {
            var insRow = dtable.insertRow();
            insRow.insertCell().innerHTML =  largestArray[j]['date'];
        }
        for (var r = 1, row; row = dtable.rows[r];) {
            for (var k = 0; k < responses.length; k++) {
                for (var d = responses[k].length - 1; d > 0; d--) {
                    if (responses[k][d]['date'] == row['firstChild'].innerHTML )
                        row.insertCell().innerHTML = responses[k][d]['positive'];
                    r++;
                }
            r = 1;
            }
        }
    });
});
