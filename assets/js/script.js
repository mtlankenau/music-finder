// global variables
const searchInputEl = document.querySelector("#artist-name");
const searchButtonEl = document.querySelector("#search-button");
const albumCheckboxEl = document.querySelector("#album");
const concertsCheckboxEl = document.querySelector("#concerts");

// event listener for search button click
searchButtonEl.addEventListener("click", musicTermFinder);

// function run after clicking the search button
function musicTermFinder(event) {
    // if 'I want to see their albums' checkbox is checked,
    if (albumCheckboxEl.checked === true) {
        albumApiFunction();
    } else if (concertsCheckboxEl.checked === true) {
        concertsApiFunction();
    } else {
        showAlert();
    }
};

function albumApiFunction() {
    // text entered into input is now 'searchedMusicTerm' variable, converted to lowercase
    var searchedMusicTerm = searchInputEl.value.toLowerCase();
    // sets album entity query parameter as a variable
    var albumEntity = "&entity=album";
    // fetch API for searched music term
    fetch("https://itunes.apple.com/search?term=" + searchedMusicTerm + albumEntity + "&attribute=artistTerm&limit=10")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            // loops through each album, index 0 - 9
            for (var i = 0; i < data.results.length; i++) {
                console.log(searchedMusicTerm + data.results[i].artistName.toLowerCase());
                if (searchedMusicTerm.includes(data.results[i].artistName.toLowerCase())) {
                    // object with album name, genre, release date, and url
                    var albumDataObject = {
                        albumNames: data.results[i].collectionName,
                        albumGenre: data.results[i].primaryGenreName,
                        albumReleaseDate: data.results[i].releaseDate,
                        albumUrl: data.results[i].collectionViewUrl,
                        albumArt: data.results[i].artworkUrl60
                    }
                    // logs object with information
                    console.log(albumDataObject)
                }
            };
        })
};

function concertsApiFunction() {
    // text entered into input is now 'searchedMusicTerm' variable, converted to lowercase
    var searchedMusicTerm = searchInputEl.value.toLowerCase();

    fetch("https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + searchedMusicTerm + "&apikey=ff5u94LXWXFZZinXI0G9v1Y5GICPDiG5")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
        })
}