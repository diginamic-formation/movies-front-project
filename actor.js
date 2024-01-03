const urlAppActor = "http://localhost:8080/persons/imdb/";
const API_KEY = "8c876ad71559ac44edf7af86b9d77927";

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

document.addEventListener("DOMContentLoaded", function () {
  const actorId = getQueryParam("id");
  console.log(actorId);
  ActorDisplay(actorId);
});

async function getActorById(actorId) {
  try {
    const response = await fetch(`${urlAppActor}${actorId}`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching Actor:", error);
    throw error;
  }
}

function getActorPicture(imdbId) {
  return fetch(
    `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id&api_key=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      for (i in data) {
        if (data[i][0] && data[i][0].profile_path) {
          return `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${data[i][0].profile_path}`;
        }
      }
      return "images/no-poster-available.jpg";
    });
}

function getActorFilmsPictures(actorId) {
  filmsPicturesList = getActorById(actorId.films.referenceNumber);
  console.log(filmsPicturesList);
  return fetch(
    `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${filmsPicturesList}.poster_path}`
  ).then((response) => response.json());
  console.log(response);
}

// function getActorFilmsPictures(actorId) {
//   return fetch(
//     `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${data[i][0].poster_path}`
//   )
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(imdbId);
//       console.log(data);
//       console.log(actorId);
//       for (i in data) {
//         if (data[i][0]) {
//           return `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${data[i][0].poster_path}`;
//         }
//       }
//       throw new Error("Poster Not Found");
//     });
// }

// Affichage de la liste des films
document.addEventListener("DOMContentLoaded", function () {
  const movies = getActorFilmsPictures(imdbId);

  const moviesList = document.getElementById("movies-list");
  movies.forEach((movie) => {
    const movieItem = document.createElement("div");
    movieItem.className = "movie-item";
    movieItem.id = `movie-item-${movie.id}`;
    movieItem.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-genre">${movie.genre}</p>
                <p class="movie-year">${movie.year}</p>
            </div>
            <div class="movie-info">
                <p class="movie-summary">${movie.summary}</p>
            </div>
            
        `;
    moviesList.appendChild(movieItem);
  });
});

// Affichage du formulaire pour modifier info acteur
document.addEventListener("DOMContentLoaded", function () {
  const editIcon = document.getElementById("edit-icon");
  const modal = document.getElementById("edit-modal");
  const closeModal = document.getElementsByClassName("close")[0];

  editIcon.onclick = function () {
    modal.style.display = "block";
  };

  closeModal.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
});

async function ActorDisplay(actorId) {
  actorData = await getActorById(actorId);
  console.log(actorData);
  const actorPicture = await getActorPicture(actorData.referenceNumber);
  document.querySelector(".actor-details").innerHTML = `
                  <article class="col">
                    <ul class="list-group">
                      <li class="list-group-item">${actorData.fullName}</li>
                      <li class="list-group-item">${actorData.birthday}</li>
                      <li class="list-group-item">${actorData.placeName}</li>
                      <li class="list-group-item">${actorData.country}</li>
                    </ul>
                  </article>
              `;

  document.querySelector(".actor-image").innerHTML = `
                      <img class="actor-image" src=${actorPicture} alt="" />
              `;

  actorFilmsPictures = await getActorFilmsPictures(
    actorData.films.referenceNumber
  );
}

async function ActorFilmsDisplay(id) {
  try {
    const filmData = await getActorFilmsPictures(imdbId);

    for (film of filmData.content) {
      console.log(film);
      const picture = await Promise.any([
        getPictureFromOmDbApi(film.referenceNumber),
        getPictures(film.referenceNumber),
      ])
        .then((picture) => picture)
        .catch((e) => "images/no-poster-available.jpg");
      film.picture = picture;
    }

    // console.log(filmData);
    document.querySelector(".movies-list").innerHTML = filmData.content
      .map(
        (film) => `
            <article class="col">
                <div class="card">
                    <img class="card-img-top" src=${film.picture} alt="image du film ${film.title}" />
                    <div class="card-body">
                        <h5 class="card-title text-truncate">${film.title}</h5>
                        <p class="card-text text-truncate">${film.genres}</p>
                    </div>
                    <div class="card-footer">
                        <a href="cart-film.html" class="btn btn-outline-dark detail-film" id=${film.id}>Voir</a>
                    </div>
                </div>
            </article>
        `
      )
      .join("");

    currentPage = pageNumber;
    return filmData;
  } catch (error) {
    console.error("Error displaying films:", error);
    throw error;
  }
}

// ActorDisplay();

// {
//   id: 1,
//   title: "Heat",
//   year: "2020",
//   genre: "Action",
//   poster: "img-actor/smith.png",
//   summary:
//     "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias incidunt possimus ipsam necessitatibus eius animi corporis eos quisquam debitis, est, reprehenderit in, ab perspiciatis? Delectus sequi veniam itaque adipisci assumenda.Autem accusamus vitae eos blanditiis nobis dolorem iusto facere voluptatem eum impedit aliquid quas cumque placeat, inventore recusandae porro quo sint eaque. Officiis suscipit magnam laboriosam molestiae quae facere mollitia",
// },
// {
//   id: 2,
//   title: "Troie",
//   year: "2019",
//   genre: "Drama",
//   poster: "img-actor/troie.png",
//   summary:
//     "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias incidunt possimus ipsam necessitatibus eius animi corporis eos quisquam debitis, est, reprehenderit in, ab perspiciatis? Delectus sequi veniam itaque adipisci assumenda.Autem accusamus vitae eos blanditiis nobis dolorem iusto facere voluptatem eum impedit aliquid quas cumque placeat, inventore recusandae porro quo sint eaque. Officiis suscipit magnam laboriosam molestiae quae facere mollitia",
// },
// {
//   id: 3,
//   title: "Hollywood",
//   year: "2022",
//   genre: "Action",
//   poster: "img-actor/hollywood.png",
//   summary:
//     "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias incidunt possimus ipsam necessitatibus eius animi corporis eos quisquam debitis, est, reprehenderit in, ab perspiciatis? Delectus sequi veniam itaque adipisci assumenda.Autem accusamus vitae eos blanditiis nobis dolorem iusto facere voluptatem eum impedit aliquid quas cumque placeat, inventore recusandae porro quo sint eaque. Officiis suscipit magnam laboriosam molestiae quae facere mollitia",
// },
// {
//   id: 4,
//   title: "Heat",
//   year: "2019",
//   genre: "Drama",
//   poster: "img-actor/smith.png",
//   summary:
//     "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias incidunt possimus ipsam necessitatibus eius animi corporis eos quisquam debitis, est, reprehenderit in, ab perspiciatis? Delectus sequi veniam itaque adipisci assumenda.Autem accusamus vitae eos blanditiis nobis dolorem iusto facere voluptatem eum impedit aliquid quas cumque placeat, inventore recusandae porro quo sint eaque. Officiis suscipit magnam laboriosam molestiae quae facere mollitia",
// },
