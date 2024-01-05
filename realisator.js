const urlAppActor = "http://localhost:8080/realisators/";
const urlActor = "http://localhost:8080/realisators/";
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
      for (i in data) {
        if (data[i][0] && data[i][0].profile_path) {
          return `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${data[i][0].profile_path}`;
        }
      }
      return "images/no-poster-available.jpg";
    });
}

function getMoviePicture(imdbId) {
  return fetch(
    `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id&api_key=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      for (i in data) {
        if (data[i][0] && data[i][0].poster_path) {
          return `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${data[i][0].poster_path}`;
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

// Affichage du formulaire pour modifier info acteur
document.addEventListener("DOMContentLoaded", function () {
  const editIcon = document.getElementById("edit-icon");
  const modal = document.getElementById("edit-modal");
  const closeModal = document.getElementsByClassName("close")[1];

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
  ActorFilmsDisplay(actorData);

  // Get form elements
  const form = document.getElementById("edit-movie-form");
  console.log(form);
  const nameInput = form.elements["name"];
  const dateBirthInput = form.elements["dateBirth"];
  const placeBirthInput = form.elements["placeBirth"];
  const citizenshipInput = form.elements["citizenship"];
  const heightInput = form.elements["height"];

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    actorData = await getActorById(actorId);
    console.log(actorData);
    try {
      const updatedData = {
        fullName: nameInput.value,
        birthday: dateBirthInput.value,
        height: heightInput.value,
        country: citizenshipInput.value,
        placeName: placeBirthInput.value,
      };

      await updateActor(actorId, updatedData);
      console.log("Actor updated successfully");
    } catch (error) {
      console.error("Error updating movie:", error);
    }
  });

  async function updateActor(actorId, updatedData) {
    console.log(`${urlActor}${actorId}`);
    const response = await fetch(`${urlActor}${actorId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.text();
    return responseData;
  }
}

async function ActorFilmsDisplay(id) {
  const moviesList = document.getElementById("movies-list");
  for (movie of actorData.films) {
    picture = await getMoviePicture(movie.referenceNumber);
    const movieItem = document.createElement("div");
    movieItem.className = "movie-item";
    movieItem.id = `movie-item-${movie.id}`;
    movieItem.dataset.year = movie.year;
    movieItem.innerHTML = `
            <img src="${picture}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-genre">${movie.genres}</p>
                <p class="movie-year">${movie.year}</p>
            </div>
            <div class="movie-info">
                <p class="movie-summary">${movie.summary}</p>
            </div>
            
        `;
    moviesList.appendChild(movieItem);
  }
}

document
  .getElementById("year-filter-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const startYear = parseInt(document.getElementById("start-year").value);
    const endYear = parseInt(document.getElementById("end-year").value);

    const movieItems = document.querySelectorAll(".movie-item");

    movieItems.forEach((movieItem) => {
      const movieYear = parseInt(movieItem.dataset.year);
      if (
        (!startYear && !endYear) || // Both fields blank
        (startYear !== null &&
          endYear !== null &&
          movieYear >= startYear &&
          movieYear <= endYear) || // Both fields have values
        (startYear !== null && !endYear && movieYear >= startYear) || // Only start year filled
        (!startYear && endYear !== null && movieYear <= endYear)
      ) {
        // Only end year filled
        console.log(startYear);
        movieItem.style.display = ""; // Show the movie
      } else {
        movieItem.style.display = "none"; // Hide the movie
      }
    });
  });

// Set the values of form inputs
// nameInput.value = actorData.fullName;
// dateBirthInput.value = actorData.birthday;
// placeBirthInput.value = actorData.placeName;
// citizenshipInput.value = actorData.country;
// heightInput.value = actorData.height;
