const urlAppActors = "http://localhost:8080/actors";
const API_KEY = "8c876ad71559ac44edf7af86b9d77927";

const pageSize = 12;
let totalPageCount = 332; // Nombre total de pages
let currentPage = 0;
var selectedActorId = null;

async function getActors(pageNumber) {
  try {
    const response = await fetch(
      `${urlAppActors}?page=${pageNumber}&size=${pageSize}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching actors:", error);
    throw error;
  }
}

function getPictures(imdbId) {
  return fetch(
    `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id&api_key=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      for (i in data) {
        if (data[i][0] && data[i][0].profile_path) {
          return `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${data[i][0].profile_path}`;
        }
      }
      throw new Error("Poster Not Found");
    });
}

function getPictureFromOmDbApi(imdbId) {
  return fetch(`https://www.omdbapi.com/?i=${imdbId}&plot=full&apikey=218f3e08`)
    .then((response) => response.json())
    .then((data) => {
      if (data?.Poster && data.Poster !== "N/A") {
        return data.Poster;
      } else {
        throw new Error("Picture Not Found");
      }
    });
}

async function actorDisplay(pageNumber) {
  try {
    if (pageNumber < 0 || pageNumber > totalPageCount) {
      return; // Ne rien faire si la page demandée est en dehors des limites
    }

    const actorData = await getActors(pageNumber);
    for (actor of actorData.content) {
      const picture = await Promise.any([
        getPictureFromOmDbApi(actor.referenceNumber),
        getPictures(actor.referenceNumber),
      ])
        .then((picture) => picture)
        .catch((e) => "images/no-poster-available.jpg");
      actor.picture = picture;
    }

    
    document.querySelector(".actors").innerHTML = actorData.content
      .map(
        (actor) =>
          `
            <article class="col">
                <div class="card">
                <div class="card-body">
                    <img class="card-img-top" src=${actor.picture} alt="" />
                      <h5 class="card-title">${actor.fullName}</h5>
                      <h6 class="card-subtitle mb-2 text-muted">${actor.birthday}</h6>
                      <a href="actor.html?id=${actor.id}" class="card-link">Voir Profile</a>
                    </div>
                </div>
            </article>
        `
      )
      .join("");

      document.querySelector("#pagination-counter").innerHTML=`
        <li class="page-item enabled"><a class="page-link">${actorData.pageable.pageNumber+1} / ${actorData.totalPages}</a></li>`


        document.querySelector("#actors-size").innerHTML=`
        <p class="font-weight-bold">Résultat : ${actorData.totalElements} films</p>
        `
    currentPage = pageNumber;
    return actorData;
  } catch (error) {
    console.error("Error displaying actors:", error);
    throw error;
  }
}


function searchActorByName(){
  if (selectedActorId) {
    window.location.href = `/actor.html?id=${selectedActorId}`;  // Redirection vers la page de l'acteur
} else {
    alert("Veuillez sélectionner un acteur dans la liste des suggestions.");
}
}


function autocompleteActor() {
  var input = document.getElementById('actor-name').value;
  if (input.length > 2) {  // Suggérer à partir de 3 caractères saisis
      fetch(`http://localhost:8080/actors/auto-complete/${input}`)
      .then(response => response.json())
      .then(data => {
          let autocompleteList = document.getElementById('actors-autocomplete-list');
          autocompleteList.innerHTML = '';  // Effacer les suggestions précédentes
          console.log(data)
          if (data.content) {
              data.content.slice(0,5).forEach(actor => {
                  let listItem = document.createElement('a');
                  listItem.classList.add('list-group-item', 'list-group-item-action');
                  listItem.innerText = actor.fullName;
                  listItem.href = '#';  // Modifier pour rediriger vers une page de détails
                  listItem.addEventListener('click', function() {
                      document.getElementById('actor-name').value = actor.fullName;  // Sélection de l'acteur
                      selectedActorId = actor.id
                      autocompleteList.innerHTML = '';  // Effacer les suggestions après la sélection
                  });
                  autocompleteList.appendChild(listItem);
              });
          }
      });
  } else {
      document.getElementById('actors-autocomplete-list').innerHTML = '';
  }}




document
  .getElementById("prev")
  .addEventListener("click", () => actorDisplay(currentPage - 1));
document
  .getElementById("next")
  .addEventListener("click", () => actorDisplay(currentPage + 1));

// Initial display
actorDisplay(currentPage);