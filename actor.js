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
