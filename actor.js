const urlAppActors = "http://localhost:8080/persons/all";
const urlAppActor = "http://localhost:8080/persons/";
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
    console.error("Error fetching Actors:", error);
    throw error;
  }
}

async function getActorById(id) {
  try {
    const response = await fetch(`${urlAppActor}${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Actor:", error);
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
        if (data[i][0]) {
          return `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${data[i][0].poster_path}`;
        }
      }
      throw new Error("Poster Not Found");
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const movies = [
    {
      id: 1,
      title: "Heat",
      year: "2020",
      genre: "Action",
      poster: "img-actor/smith.png",
      summary:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias incidunt possimus ipsam necessitatibus eius animi corporis eos quisquam debitis, est, reprehenderit in, ab perspiciatis? Delectus sequi veniam itaque adipisci assumenda.Autem accusamus vitae eos blanditiis nobis dolorem iusto facere voluptatem eum impedit aliquid quas cumque placeat, inventore recusandae porro quo sint eaque. Officiis suscipit magnam laboriosam molestiae quae facere mollitia",
    },
    {
      id: 2,
      title: "Troie",
      year: "2019",
      genre: "Drama",
      poster: "img-actor/troie.png",
      summary:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias incidunt possimus ipsam necessitatibus eius animi corporis eos quisquam debitis, est, reprehenderit in, ab perspiciatis? Delectus sequi veniam itaque adipisci assumenda.Autem accusamus vitae eos blanditiis nobis dolorem iusto facere voluptatem eum impedit aliquid quas cumque placeat, inventore recusandae porro quo sint eaque. Officiis suscipit magnam laboriosam molestiae quae facere mollitia",
    },
    {
      id: 3,
      title: "Hollywood",
      year: "2022",
      genre: "Action",
      poster: "img-actor/hollywood.png",
      summary:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias incidunt possimus ipsam necessitatibus eius animi corporis eos quisquam debitis, est, reprehenderit in, ab perspiciatis? Delectus sequi veniam itaque adipisci assumenda.Autem accusamus vitae eos blanditiis nobis dolorem iusto facere voluptatem eum impedit aliquid quas cumque placeat, inventore recusandae porro quo sint eaque. Officiis suscipit magnam laboriosam molestiae quae facere mollitia",
    },
    {
      id: 4,
      title: "Heat",
      year: "2019",
      genre: "Drama",
      poster: "img-actor/smith.png",
      summary:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias incidunt possimus ipsam necessitatibus eius animi corporis eos quisquam debitis, est, reprehenderit in, ab perspiciatis? Delectus sequi veniam itaque adipisci assumenda.Autem accusamus vitae eos blanditiis nobis dolorem iusto facere voluptatem eum impedit aliquid quas cumque placeat, inventore recusandae porro quo sint eaque. Officiis suscipit magnam laboriosam molestiae quae facere mollitia",
    },
  ];
  // Affichage de la liste des films
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

// document.addEventListener("DOMContentLoaded", function () {
//   const editIcon = document.getElementById("edit-icon");
//   editIcon.onclick = function () {
//     showEditForm();
//   };
// });

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
