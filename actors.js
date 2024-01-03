const urlAppActors = "http://localhost:8080/persons/all";
const API_KEY = "8c876ad71559ac44edf7af86b9d77927";

const pageSize = 12;
let totalPageCount = 332; // Nombre total de pages
let currentPage = 0;

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
          console.log(data);
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

    console.log(actorData);
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
                      <a href="actor.html?id=${actor.referenceNumber}" class="card-link">Voir Profile</a>
                    </div>
                </div>
            </article>
        `
      )
      .join("");

    currentPage = pageNumber;
    return actorData;
  } catch (error) {
    console.error("Error displaying actors:", error);
    throw error;
  }
}

document
  .getElementById("prev")
  .addEventListener("click", () => actorDisplay(currentPage - 1));
document
  .getElementById("next")
  .addEventListener("click", () => actorDisplay(currentPage + 1));

// Initial display
actorDisplay(currentPage);
