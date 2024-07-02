import { getActorPicture } from "../services/actorService.js";

document.getElementById('search-type').addEventListener('change', updateMessageAndFields);

function updateMessageAndFields() {
    const type = document.getElementById('search-type').value;
    const message = document.getElementById('message');
    const inputFields = document.getElementById('input-fields');
    const button = document.querySelector('button');

    if (type === 'actors' || type === 'films') {
        message.innerText = type === 'actors' ?
            "Trouver les films en commun pour deux acteurs" :
            "Trouver les acteurs en commun pour ces deux films";
        button.innerText = type === 'actors' ?
            "Trouver les films en commun" :
            "Trouver les acteurs en commun";
        button.style.display = 'inline-block'; // Show button
        inputFields.innerHTML = `
            <div >
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
                        itemDiv.innerHTML = item.fullName;
                        itemDiv.addEventListener('click', function () {
                            input.value = this.innerText;
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

function findCommon() {
    const type = document.getElementById('search-type').value;
    const name1 = document.getElementById('input1').value;
    const name2 = document.getElementById('input2').value;
    const results = document.getElementById('results');
    printElement(name1, name2);

    console.log(name2)
    results.innerHTML = '';
    const searchType = type === 'actors' ? 'films' : 'actors';

    fetch(`http://localhost:8080/${searchType}/common/${name1}/${name2}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                let card = document.createElement('div');
                card.className = "card";
                card.style.width = "18rem";
                card.innerHTML = `
                    <img src="${item.image}" class="card-img-top" alt="${item.name}">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">${item.detail}</p>
                    </div>
                `;
                results.appendChild(card);
            });
        });
}

function printElement(name1, name2) {
    const firstElement = document.getElementById('firstElement');
    const secondElement = document.getElementById('secondElement');
    const type = document.getElementById('search-type').value;

    fetch(`http://localhost:8080/${type}/name/${name1}`)
        .then(response => response.json())
        .then(data => data.content)
        .then(data => console.log(data))
        .then(element => element.picture = getActorPicture(element.referenceNumber))
    fetch(`http://localhost:8080/${type}/name/${name2}`)
        .then(response => response.json())
        .then(data => data.content)




}