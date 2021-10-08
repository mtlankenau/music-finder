// global variables
const searchInputEl = document.querySelector("#artist-name");
const searchButtonEl = document.querySelector("#search-button");
const albumCheckboxEl = document.querySelector("#album");

// event listener for search button click
searchButtonEl.addEventListener("click", musicTermFinder);

// function run after clicking the search button
function musicTermFinder(event) {
    // text entered into input is now 'searchedMusicTerm' variable
    var searchedMusicTerm = searchInputEl.value.toLowerCase();
    console.log(searchedMusicTerm);
    if (albumCheckboxEl.checked === true) {
        var albumEntity = "&entity=album";
    } else {
        albumEntity = "";
    }

    // on button click, fetch API for searched music term
    fetch("https://itunes.apple.com/search?term=" + searchedMusicTerm + albumEntity + "&attribute=artistTerm&limit=10")
        .then(function(response) {
        return response.json();
        })
        .then(function(data) {
            console.log(data);
            // if album checkbox is checked, return an object with relevant data to all 10 albums
            if (albumCheckboxEl.checked === true) {
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
            // if album checkbox isn't checked, return an object with information related to the artist
            } else {
                showAlert();
            }
        });
    // prevents browser from refreshing after clicking on search button
    event.preventDefault();
};

function showAlert(){
    var notificationDivEl = document.querySelector("#notification");
    var notificationAlert = document.createElement("p");
    notificationAlert.textContent = "Please select at least 1 checkbox before clicking the 'Search' button";
    notificationDivEl.appendChild(notificationAlert);
};


fetch("https://app.ticketmaster.com/discovery/v2/events.json?keyword=drake&apikey=ff5u94LXWXFZZinXI0G9v1Y5GICPDiG5")
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
    })


// fetch("http://www.songsterr.com/a/ra/songs/byartists.json?artists=Metallica")
//     .then(function(response){
//         return response.json();
//     })
//     .then(function(data){
//         console.log(data);
//     })