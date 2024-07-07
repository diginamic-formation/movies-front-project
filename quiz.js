let acteur1 = ""
let acteur2 = ""
let films = [];
let film1 = ""
let film2 = ""
let acteurs = [];
let texte = ""
const MAX_LENGTH = 25; 

correctAnswer = null;
const API_KEY_Actor = "8c876ad71559ac44edf7af86b9d77927";
var quizEnigme = null;
var quizSolution = null;



function getRandomInt(n) {
    return Math.floor(Math.random() * n);
}



window.onload = function() {
    quizEnigme = document.getElementById("quizEnigme");
    quizSolution = document.getElementById("quizSolution");
}
  

function quizStart(event){
    event.preventDefault();
    document.getElementById('quizMessage').style.display = "none";
    document.getElementById('retryButton').style.display = "none";
    quizType = document.getElementById("quiz-type").value;
    quizEnigme.setAttribute("hidden", "true")
    quizSolution.setAttribute("hidden", "true")
    if(quizType == "films"){
        filmQuizz();
    }else if(quizType == "acteurs"){
        actorQuizz();
    }
}

async function actorQuizz(){
        await fetch(`http://localhost:8080/quiz/films/generate`)
        .then((response) => { return response.json() })
        .then(data => {
            affichageActorQuiz(data)}).then(() => {
                quizEnigme.removeAttribute("hidden")
                quizSolution.removeAttribute("hidden")
            }
        )
        .catch(error => console.log(error))
}


async function filmQuizz(){
    fetch(`http://localhost:8080/quiz/actors/generate`)
    .then((response) => { return response.json() })
    .then(data => {
        affichageFilmQuizz(data).then(()=>{
            quizEnigme.removeAttribute("hidden")
            quizSolution.removeAttribute("hidden")
        })
        })
    .catch(error => console.log(error))
}



async function affichageActorQuiz(data){
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



async function affichageFilmQuizz(data){
        acteur1 = data.actor1
        acteur2 = data.actor2
        films = data.films
        let index  = getRandomInt(films.length)
        correctAnswer = films[index].id
        wrongFilms = data.wrongFilms
        films = [films[index], ...wrongFilms]
        texteQuiz = `Dans quel film ont-ils joué ensemble ?`
        texteSolution = `Le film est :`
        acteur2.picture = await getPictActeur(acteur2.referenceNumber);
        acteur1.picture = await getPictActeur(acteur1.referenceNumber);
        let affQuiz = document.querySelector("#quizEnigme")
        affQuiz.innerHTML = ""
        affQuiz.innerHTML +=
            (`
            <div >
                <article class="col">
                    <div class="card shadow p-3 mb-5 bg-body-tertiary rounded " style="width: 45rem;">
                    <h5 class="card-title text-truncate" name="titre">${texteQuiz}</h5>
                        <div class="card-body d-flex justify-content-between">    
                            <div class="card shadow p-3 mb-5 bg-body-tertiary rounded">
                                <h5>${truncateText(acteur1.fullName)}</h5>
                                <img class="card-img-top" src=${acteur1.picture} alt="image ${truncateText(acteur1.fullName)}" />
                            </div>
                            <div class="card shadow p-3 mb-5 bg-body-tertiary rounded justify-content-center">
                                <h5>${truncateText(acteur2.fullName)}</h5>
                                <img class="card-img-top" src=${acteur2.picture} alt="image ${truncateText(acteur2.fullName)}" />
                            </div>
                        </div>
                        <div class="card-footer">
                        </div>
                    </div>
                </article>
            </div>
            
        `)
        affichageFilmSolution(films)
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }


  async function affichageActorSolution(acteurs) {
    const shuffledActeurs = shuffleArray([...acteurs]);
    let htmlContent = '';    
    console.log(shuffledActeurs.length)
    for (let i = 0; i < shuffledActeurs.length; i += 2) {
        shuffledActeurs[i].picture  = await getPictActeur(shuffledActeurs[i].referenceNumber)
        shuffledActeurs[i+1].picture  = await getPictActeur(shuffledActeurs[i+1].referenceNumber)
        htmlContent += `
            <div class="row" style="border: 1px solid black; margin-bottom: 10px;">
                ${generateActeurCard(shuffledActeurs[i])}
                ${shuffledActeurs[i + 1] ? generateActeurCard(shuffledActeurs[i + 1]) : ''}
            </div>
        `;
    }

    document.querySelector("#quizSolution").innerHTML = htmlContent;
    const filmCards = document.querySelectorAll('.film-card');
    filmCards.forEach(card => {
      card.addEventListener('click', (event) => {
        event.preventDefault();
        cardClick(event);
      });
    });

    
}


function  generateActeurCard(acteur) {
    console.log(acteur.picture)

    return `
        <article class="col" >
            <div class="card shadow p-3 mb-3 bg-body-tertiary rounded film-card" data-film-id="${acteur.id}">
                <div class="d-flex flex-column justify-content-center align-items-center">
                    <img class="card-img-top" src=${acteur.picture} alt="image du film ${truncateText(acteur.fullName)}" />
                    <div class="card-body">
                        <h5 class="card-title text-truncate">${truncateText(acteur.fullName)}</h5>
                    </div>
                </div>
            </div>
        </article>
    `;
}



async function affichageFilmSolution(films) {
    const shuffledFilms = shuffleArray([...films]);
    let htmlContent = '';    
    for (let i = 0; i < shuffledFilms.length; i += 2) {
        shuffledFilms[i].picture  = await getPictMovie(shuffledFilms[i].referenceNumber)
        shuffledFilms[i+1].picture  = await getPictMovie(shuffledFilms[i+1].referenceNumber)
        htmlContent += `
            <div class="row" style="border: 1px solid black; margin-bottom: 10px;">
                ${generateFilmCard(shuffledFilms[i])}
                ${shuffledFilms[i + 1] ? generateFilmCard(shuffledFilms[i + 1]) : ''}
            </div>
        `;
    }

    document.querySelector("#quizSolution").innerHTML = htmlContent;
    const filmCards = document.querySelectorAll('.film-card');
    filmCards.forEach(card => {
      card.addEventListener('click', (event) => {
        event.preventDefault();
        cardClick(event);
      });
    });

    
}

function cardClick(event) {
    const filmId = event.currentTarget.dataset.filmId;
    const card = document.querySelector(`.film-card[data-film-id='${filmId}']`);
    const quizMessage = document.getElementById('quizMessage');
    const retryButton = document.getElementById('retryButton');

    if (filmId == correctAnswer) {
        card.style.backgroundColor = "green";
        quizMessage.textContent = "Bonne réponse!";
        quizMessage.classList.remove('alert-danger');
        quizMessage.classList.add('alert-success');
        quizMessage.style.display = "block";
    } else {
        card.style.backgroundColor = "red";
        quizMessage.textContent = "Mauvaise réponse! La bonne réponse est indiquée en vert.";
        quizMessage.classList.remove('alert-success');
        quizMessage.classList.add('alert-danger');
        quizMessage.style.display = "block";

        // Colorier la bonne réponse en vert
        const correctCard = document.querySelector(`.film-card[data-film-id='${correctAnswer}']`);
        correctCard.style.backgroundColor = "green";
    }

    // Désactiver le clic sur toutes les cartes
    const filmCards = document.querySelectorAll('.film-card');
    filmCards.forEach(card => {
        card.style.pointerEvents = "none";
    });

    // Afficher le bouton pour relancer le quiz
    retryButton.style.display = "block";
}


function  generateFilmCard(film) {
    return `
        <article class="col" >
            <div class="card shadow p-3 mb-3 bg-body-tertiary rounded film-card" data-film-id="${film.id}">
                <div class="d-flex flex-column justify-content-center align-items-center">
                    <img class="card-img-top" src=${film.picture} alt="image du film ${truncateText(film.title)}" />
                    <div class="card-body">
                        <h5 class="card-title text-truncate">${truncateText(film.title)}</h5>
                    </div>
                </div>
            </div>
        </article>
    `;
}


/**
 * Récupère l'URL de l'image de l'acteur à partir de son identifiant IMDb.
 *
 * @param {string} imdbId - L'identifiant IMDb de l'acteur.
 * @returns {Promise<string>} Une promesse qui se résout en l'URL de l'image de l'acteur ou une URL d'image par défaut si non disponible.
 */
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