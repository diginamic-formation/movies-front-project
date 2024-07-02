document.addEventListener('DOMContentLoaded', function () {
    var navbarHTML = `
    <nav class="navbar navbar-expand-lg bg-dark">
        <div class="navbar navbar-dark bg-dark shadow-sm">
            <div class="container">
                <a href="../index.html" class="navbar-brand d-flex align-items-center">
                    <img src="images/movie2.png" />
                    <strong>Movies</strong>
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarHeader"
                        aria-controls="navbarHeader" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>
        </div>
        <div class="collapse navbar-collapse text-white justify-content-between align-items-center"
             id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 text-white">
                <li class="nav-item ">
                    <a class="nav-link active " aria-current="page" href="../index.html">🏠 Home</a>
                </li>
                <li class="nav-item ">
                    <a class="nav-link text-white " href="genre.html">Genres</a>
                </li>
                <li class="nav-item ">
                    <a class="nav-link text-white " href="actors.html">Acteurs</a>
                </li>
                <li class="nav-item ">
                    <a class="nav-link text-white " href="realisators.html">Réalisateurs</a>
                </li>
                <li class="nav-item text-white">
                    <a class="nav-link text-white" href="films.html">Films</a>
                </li>
                <li class="nav-item text-white">
                    <a class="nav-link text-white" href="quiz.html">Quiz</a>
                </li>
            </ul>
        </div>
    </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
});
