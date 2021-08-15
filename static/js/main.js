let nextPage;
let previousPage;
let actualPage = 'https://swapi.dev/api/planets/';

document.querySelector('#next_page').addEventListener('click', loadNextPage);
document.querySelector('#prev_page').addEventListener('click', loadPrevPage);

loadPage();

function loadPage() {
    document.querySelector('.container').innerHTML = "";
    document.querySelector('#planet-table').innerHTML = "";
    fetch(actualPage)
    .then((response) => response.json())
        .then((data) => {
            nextPage = (data.next === null ?actualPage:data.next);
            previousPage = (data.previous === null ?actualPage:data.previous);
            for ( let planet of data.results) {
                document.querySelector('#planet-table').innerHTML += createTableRows(planet);
            }

        })
}

function getResidentInfo(residents, planet) {
    if (residents.length === 0) {
        return 'No known residents'
    } else {
        getPlanetResidents(residents, planet)
        return `<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#${replaceSpaces(planet)}Modal">${residents.length} resident(s)</button>`
    }
}

function getWaterPercent(water_data) {
    if (!(water_data === 'unknown')) {
        return `${water_data}%`
    }
    else{
        return water_data
    }
}

function getPopulationData(population) {
    if (population === 'unknown') {
        return population;
    }
    else {
        return `${(parseInt(population)).toLocaleString()} people`;
    }
}

function createTableRows(planet) {
    let residentsData = getResidentInfo(planet.residents, planet.name);
    let waterPercent = getWaterPercent(planet.surface_water);
    let population = getPopulationData(planet.population);
    return `<tr>
            <td>${planet.name}</td>
            <td>${parseInt(planet.diameter).toLocaleString()} km</td>
            <td>${planet.climate}</td>
            <td>${planet.terrain}</td>
            <td>${waterPercent}</td>
            <td>${population}</td>
            <td>${residentsData}</td>
            <td><button type="button">Vote</button> </td>
            </tr>`
}

function loadNextPage() {
    actualPage = nextPage;
    loadPage();
}

function loadPrevPage() {
    actualPage = previousPage;
    loadPage();
}

function getPlanetResidents(list, planet) {
    document.querySelector('.container').innerHTML += `
        <div class="modal fade" id="${replaceSpaces(planet)}Modal">
        <div class="modal-dialog">
        <div class="modal-content" style="width: 1000px; left: -50%">
    
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Resident(s) of ${planet}</h4>
          <button type="button" class="close" data-dismiss="modal">×</button>
        </div>
        
        <!-- Modal body -->
        <div class="modal-body">
        <table class="table table-bordered table-striped">
            <thead class="thead-dark">
                <tr>
                    <th>Name</th>
                    <th>Height</th>
                    <th>Mass</th>
                    <th>Hair color</th>
                    <th>Skin color</th>
                    <th>Eye color</th>
                    <th>Birth year</th>
                    <th>Gender</th>
                </tr>
            </thead>
            <tbody id="${replaceSpaces(planet)}ResidentTable"></tbody>
        
        </table>
        </div>
        
        <!-- Modal footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-dark" data-dismiss="modal">Close</button>
        </div>`

    for (let link of list) {
        fetch(link)
            .then((response) => response.json())
            .then((data) => {
                document.querySelector(`#${replaceSpaces(planet)}ResidentTable`).innerHTML += `
                <tr>
                    <td>${data.name}</td>
                    <td>${data.height}</td>
                    <td>${data.mass}</td>
                    <td>${data.hair_color}</td>
                    <td>${data.skin_color}</td>
                    <td>${data.eye_color}</td>
                    <td>${data.birth_year}</td>
                    <td>${data.gender}</td>
                </tr>`
        })
    }
}

function replaceSpaces(name) {
    return name.replace(" ", "")
}