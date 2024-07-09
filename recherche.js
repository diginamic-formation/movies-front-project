const API_KEY_Actor = "8c876ad71559ac44edf7af86b9d77927";
const MAX_LENGTH = 25; 

var pictures = null;
var results = null;

window.onload = function() {
    pictures = document.getElementById("pictures");
    results = document.getElementById("results");
}

function newSearch() {

    const message = document.getElementById('message');
    const inputFields = document.getElementById('input-fields');
    const button = document.getElementById('find-button');
    const pictures = document.getElementById('pictures');
    const results = document.getElementById('results');
    const resultMessage = document.getElementById('result-message');
    const newSearchButton = document.getElementById('new-search');
    const selectBox = document.getElementById('search-type');


    // Clear previous results
    pictures.innerHTML = '';
    results.innerHTML = '';
    resultMessage.innerText = '';
    newSearchButton.style.display = 'none'; // Hide new search button
    inputFields.innerHTML = ''
    button.style.display = 'none'
    message.innerText = "";
    selectBox.value = "select";

}
  
function updateMessageAndFields() {
    const type = document.getElementById('search-type').value;
    const message = document.getElementById('message');
    const inputFields = document.getElementById('input-fields');
    const button = document.getElementById('find-button');
    const pictures = document.getElementById('pictures');
    const results = document.getElementById('results');
    const resultMessage = document.getElementById('result-message');
    const newSearchButton = document.getElementById('new-search');

    // Clear previous results
    pictures.innerHTML = '';
    results.innerHTML = '';
    resultMessage.innerText = '';
    newSearchButton.style.display = 'none'; // Hide new search button

    if (type === 'actors' || type === 'films') {
        message.innerText = type === 'actors' ?
            "Trouver les films en commun pour deux acteurs" :
            "Trouver les acteurs en commun pour ces deux films";
        button.innerText = type === 'actors' ?
            "Trouver les films en commun" :
            "Trouver les acteurs en commun";
        button.style.display = 'inline-block'; // Show button
        inputFields.innerHTML = `
            <div>
                <input type="text" class="form-control" id="input1" placeholder="Entrez le premier nom ici">
                <div id="autocomplete-list1" class="autocomplete-items"></div>
            </div>
            <div >
                <input type="text" class="form-control" id="input2" placeholder="Entrez le second nom ici">
                <div id="autocomplete-list2" class="autocomplete-items"></div>
            </div>
        `;
        setupAutocomplete('input1', type);
        setupAutocomplete('input2', type);
    } else {
        message.innerText = "";
        button.style.display = 'none'; // Hide button
        inputFields.innerHTML = ''; // Clear fields
    }
}

async function findCommon() {
    const type = document.getElementById('search-type').value;
    const id1 = document.getElementById('input1').getAttribute('data-id');
    const id2 = document.getElementById('input2').getAttribute('data-id');
    const newSearchButton = document.getElementById('new-search');

    await generatePictures(type, id1, id2);   
    await generateSolutions(type, id1, id2);

    newSearchButton.style.display = 'inline-block'; // Show new search button
}



function setupAutocomplete(inputId, type) {
    const input = document.getElementById(inputId);
    const autocompleteList = document.getElementById('autocomplete-list' + inputId[inputId.length - 1]);
    
    input.addEventListener('input', function () {
        const name = this.value;
        autocompleteList.innerHTML = '';
        if (name.length > 2) {
            fetch(`http://localhost:8080/${type}/auto-complete/${name}`)
                .then(response => response.json())
                .then(data => {
                    data.content.slice(0, 5).forEach(item => {
                        let itemDiv = document.createElement('div');
                        itemDiv.innerHTML = type === "actors" ? item.fullName : item.title;
                        itemDiv.addEventListener('click', function () {
                            input.value = this.innerText;
                            input.setAttribute('data-id', item.id);
                            autocompleteList.innerHTML = '';
                        });
                        autocompleteList.appendChild(itemDiv);
                    });
                });
        }
    });
    
// Hide the list when clicking outside of it
document.addEventListener('click', function (event) {
    if (event.target !== input) {
        autocompleteList.innerHTML = '';
    }
});
}

async function generatePictures(type, id1, id2){
    firstElement = await getElement(type, id1);
    secondElement = await getElement(type, id2);

    let pictureTitle = type === "films" ? "les films sont :" : "les acteurs sont : ";
    let pictures = document.querySelector("#pictures")
    pictures.innerHTML = ""
    pictures.innerHTML +=
        (`
        <div >
            <article class="col">
                <div class="card shadow p-3 mb-5 rounded " style="width: 45rem;">
                <h5 class="card-title text-truncate" name="titre">${pictureTitle}</h5>
                    <div class="card-body d-flex justify-content-between">
                        <div class="card shadow p-3 mb-5 bg-body-tertiary rounded">
                            <h5>${truncateText(type === "films" ? firstElement.title: firstElement.fullName)}</h5>
                            <img class="card-img-top" src=${firstElement.picture} alt="image ${truncateText(type === "films" ? firstElement.title: firstElement.fullName)}" />
                        </div>
                        <div class="card shadow p-3 mb-5 bg-body-tertiary rounded">
                            <h5>${truncateText(type === "films" ? secondElement.title: secondElement.fullName)}</h5>
                            <img class="card-img-top" src=${secondElement.picture} alt="image ${truncateText(type === "films" ? secondElement.title: secondElement.fullName)}" />
                        </div>
                    </div>
                    <div class="card-footer">
                    </div>
                </div>
            </article>
        </div>`)
    pictures.removeAttribute('hidden')
}
    

async function generateSolutions(type, id1, id2){
    let commonElements = await getSolutions(type, id1,id2)
    commonElements = await addPictures(type, commonElements)
    console.log("results : ", commonElements);
    generatePictureSolutions(type, commonElements)
}


async function addPictures(type, data){
    elements = type === 'actors' ? "films" : "actors";
    for(let d of data){
        d.picture = await getPicture(elements, d.referenceNumber)
    }
    return data
}

async function generatePictureSolutions(type, commonElements) {
    elements = type === 'actors' ? "films" : "actors";
    resultMessage = type === 'actors' ? "les films en commun : " : "les acteurs en commun : ";
    message = document.getElementById("result-message")
    message.innerText = resultMessage ;
    let results = document.querySelector("#results")

    results.innerHTML = `
    <div class="d-flex flex-row overflow-auto">
        ${commonElements.map((commonElement) => {
            return `
                <div class="card mx-2" style="min-width: 150px;">
                    <img class="card-img-top" src=${commonElement.picture} alt="image du film ${type === "actors" ? commonElement.title : commonElement.fullName}" />
                    <div class="card-body">
                        <h5 class="card-title text-truncate">${type === "actors" ? commonElement.title : commonElement.fullName}</h5>
                    </div>
                </div>
            `;
        }).join('')}
    </div>
`;
}
async function getSolutions(type, id1, id2){
    const elements = type === "actors" ? "films" : "actors" 
    return   fetch(`http://localhost:8080/${type}/${id1}/${id2}/${elements}`)
                .then(response => response.json())
    
}
async function getElement(type, id){
    return fetch(`http://localhost:8080/${type}/${id}`)
    .then(response => response.json())
    .then(data => 
        getPicture(type, data.referenceNumber)
        .then(picture => {data.picture = picture
            return data
        })
    )
}

function getPicture(type, imdbId) {
    return fetch(
        `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id&api_key=${API_KEY_Actor}`
    )
        .then((response) => response.json())
        .then((data) => {
            for (i in data) {
                if (type === "films" && data[i][0] && data[i][0].poster_path != null) {
                    return `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${data[i][0].poster_path}`;
                }
                if (type === "actors" && data[i][0] && data[i][0].profile_path != null) {
                    return `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${data[i][0].profile_path}`;
                }   
            }
            return "images/no-poster-available.jpg";
        });
}

function truncateText(text) {
    if (text.length > MAX_LENGTH) {
        return text.substring(0, MAX_LENGTH) + '...';
    }
    return text;
}



