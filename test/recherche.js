
var pictures = null;
var results = null;

window.onload = function() {
    pictures = document.getElementById("pictures");
    results = document.getElementById("results");
}
  

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

async function printPictures(idActor1, idActor2) {
    await fetch(`http://localhost:8080/quiz/films/generate`)
    .then((response) => { return response.json() })
    .then(data => {
        generatePictures(data)}).then(() => {
            pictures.removeAttribute("hidden")
            results.removeAttribute("hidden")
        }
    )
    .catch(error => console.log(error))
}

async function generatePictures(data){
    film1 = data.film1;
    film2 = data.film2;
    acteurs = data.actors;
    wrongActors = data.wrongActors;
    let index  = getRandomInt(acteurs.length)
    correctAnswer = acteurs[index].id
    acteurs = [acteurs[index], ...wrongActors]    

    texteQuiz = `Qui est l'acteur ou l'actrice commun(e) aux films :`
    texteSolution = "L'acteur ou l'actrice est "
    film1.picture = await getPictMovie(film1.referenceNumber);
    film2.picture = await getPictMovie(film2.referenceNumber);
    let affQuiz = document.querySelector("#quizEnigme")
    affQuiz.innerHTML = ""
    affQuiz.innerHTML +=
        (`
        <div >
            <article class="col">
                <div class="card shadow p-3 mb-5 rounded " style="width: 45rem;">
                <h5 class="card-title text-truncate" name="titre">${texteQuiz}</h5>
                    <div class="card-body d-flex justify-content-between">
                        <div class="card shadow p-3 mb-5 bg-body-tertiary rounded">
                            <h5>${truncateText(film1.title)}</h5>
                            <img class="card-img-top" src=${film1.picture} alt="image ${truncateText(film1.title)}" />
                        </div>
                        <div class="card shadow p-3 mb-5 bg-body-tertiary rounded">
                            <h5>${truncateText(film2.title)}</h5>
                            <img class="card-img-top" src=${film2.picture} alt="image ${truncateText(film2.title)}" />
                        </div>
                    </div>
                    <div class="card-footer">
                    </div>
                </div>
            </article>
        </div>`)

    affichageActorSolution(acteurs);
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


function getPictMovie(imdbId) {
    return fetch(
        `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id&api_key=${API_KEY_Actor}`
    )
        .then((response) => response.json())
        .then((data) => {
            for (i in data) {
                if (data[i][0] && data[i][0].poster_path != null) {
                    return `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${data[i][0].poster_path}`;
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

function getPictActeur(imdbId) {
    // Effectue une requête pour récupérer les informations de l'acteur à partir de l'API The Movie Database
    return fetch(
        `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id&api_key=${API_KEY_Actor}`
    )
        .then((response) => response.json()) // Convertit la réponse en JSON
        .then((data) => {
            // Parcourt les résultats de la réponse JSON
            for (i in data) {
                // Vérifie si le premier élément du tableau existe et a un chemin de profil d'image
                if (data[i][0] && data[i][0].profile_path != null) {
                    // Retourne l'URL de l'image de l'acteur
                    return `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${data[i][0].profile_path}`;
                }
            }
            // Retourne une URL d'image par défaut si aucune image n'est trouvée
            return "images/no-poster-available.jpg";
        });
}