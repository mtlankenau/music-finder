// global variables
let savedAlbumsArray = [];
let savedVenuesArray = [];
const searchInputEl = document.querySelector("#artist-name");
const searchButtonEl = document.querySelector("#search-button");
const albumSelectorEl = document.querySelector("#album");
const albumIconEl = document.querySelector("#album-icon");
const concertsSelectorEl = document.querySelector("#concerts");
const concertsIconEl = document.querySelector("#concerts-icon");
const favoriteAlbumButtonEl = document.getElementsByClassName("favorite-album");
const favoriteAlbumIconEl = document.getElementsByClassName("favorite-album-icon");
const favoriteVenueButtonEl = document.getElementsByClassName("favorite-venue");
const favoriteVenueIconEl = document.getElementsByClassName("favorite-venue-icon");
const albumCardsContainerEl = document.querySelector("#album-cards-container");
const venueCardsContainerEl = document.querySelector("#venue-cards-container");
const loadFavoriteAlbumsButtonEl = document.getElementById("favorite-albums-reload-button");
const loadFavoriteConcertsButtonEl = document.getElementById("favorite-concerts-reload-button");
const loadFavoriteAlbumsButtonSidenavEl = document.getElementById("favorite-albums-reload-button-sidenav");
const loadFavoriteConcertsButtonSidenavEl = document.getElementById("favorite-concerts-reload-button-sidenav");

// event listener for search button click
albumSelectorEl.addEventListener("click", albumIconAdjuster);
concertsSelectorEl.addEventListener("click", concertsIconAdjuster);
searchButtonEl.addEventListener("click", musicTermFinder);
loadFavoriteAlbumsButtonEl.addEventListener("click", reloadSavedAlbumCards);
loadFavoriteAlbumsButtonSidenavEl.addEventListener("click", reloadSavedAlbumCards);
loadFavoriteConcertsButtonEl.addEventListener("click", reloadSavedVenueCards);
loadFavoriteConcertsButtonSidenavEl.addEventListener("click", reloadSavedVenueCards);

function albumIconAdjuster() {
    if (albumIconEl.textContent === "add") {
        albumIconEl.textContent = "";
        albumIconEl.textContent = "album";
        albumSelectorEl.classList.add("pulse")
        return;
    }
    if (albumIconEl.textContent === "album") {
        albumIconEl.textContent = "";
        albumIconEl.textContent = "add";
        albumSelectorEl.classList.remove("pulse")
        return;
    }
};

function concertsIconAdjuster() {
    if (concertsIconEl.textContent === "add") {
        concertsIconEl.textContent = "";
        concertsIconEl.textContent = "event";
        concertsSelectorEl.classList.add("pulse");
        return;
    }
    if (concertsIconEl.textContent === "event") {
        concertsIconEl.textContent = "";
        concertsIconEl.textContent = "add";
        concertsSelectorEl.classList.remove("pulse");
        return;
    }
};

function selectFavoriteAlbum(albumDataObject) {
	for (var i = 0; i < favoriteAlbumIconEl.length; i++) {
		if (favoriteAlbumIconEl[i].textContent === "favorite_border" && albumDataObject.albumName === favoriteAlbumIconEl[i].id) {
				favoriteAlbumIconEl[i].textContent = "";
				favoriteAlbumIconEl[i].textContent = "favorite";
				favoriteAlbumButtonEl[i].classList.add("pulse");
				for (var i = 0; i <savedAlbumsArray.length; i++) {
					if (savedAlbumsArray[i].albumName === albumDataObject.albumName) {
						return;
					}
				}
				savedAlbumsArray.push(albumDataObject);
				localStorage.setItem("saved-albums", JSON.stringify(savedAlbumsArray));
				return;
		}
		else if (favoriteAlbumIconEl[i].textContent === "favorite" && albumDataObject.albumName === favoriteAlbumIconEl[i].id) {
				favoriteAlbumIconEl[i].textContent = "";
				favoriteAlbumIconEl[i].textContent = "favorite_border";
				favoriteAlbumButtonEl[i].classList.remove("pulse");
				for (var i = 0; i < savedAlbumsArray.length; i++) {
					if (savedAlbumsArray[i].albumName === albumDataObject.albumName) {
						savedAlbumsArray.splice(i, 1);
					}
				};
				localStorage.clear("saved-albums");
				localStorage.setItem("saved-albums", JSON.stringify(savedAlbumsArray));
				return;
		}
	};
};

function selectFavoriteConcert(venueDataObject) {
	for (var i = 0; i < favoriteVenueIconEl.length; i++) {
		if (favoriteVenueIconEl[i].textContent === "favorite_border" && (venueDataObject.venueName + venueDataObject.eventStartDate) === favoriteVenueIconEl[i].id) {
				favoriteVenueIconEl[i].textContent = "";
				favoriteVenueIconEl[i].textContent = "favorite";
				favoriteVenueButtonEl[i].classList.add("pulse");
				for (var i = 0; i <savedVenuesArray.length; i++) {
					if ((savedVenuesArray[i].venueName + savedVenuesArray[i].eventStartDate) === (venueDataObject.venueName + venueDataObject.eventStartDate)) {
						return;
					}
				}
				savedVenuesArray.push(venueDataObject);
				localStorage.setItem("saved-venues", JSON.stringify(savedVenuesArray));
				return;
		}
		else if (favoriteVenueIconEl[i].textContent === "favorite" && venueDataObject.venueName === favoriteVenueIconEl[i].id) {
				favoriteVenueIconEl[i].textContent = "";
				favoriteVenueIconEl[i].textContent = "favorite_border";
				favoriteVenueButtonEl[i].classList.remove("pulse");
				for (var i = 0; i < favoriteVenueIconEl.length; i++) {
					if (savedVenuesArray[i].venueName == venueDataObject.venueName) {
						savedVenuesArray.splice(i, 1);
					}
				};
				localStorage.clear("saved-venues");
				localStorage.setItem("saved-venues", JSON.stringify(savedVenuesArray));
				return;
		}
	};
};
// function run after clicking the search button
function musicTermFinder(event) {
  event.preventDefault();
  // if 'I want to see their albums' checkbox is checked,
  if (albumIconEl.textContent === "album") {
    albumApiFunction();
  } if (concertsIconEl.textContent === "event") {
    concertsApiFunction();
  } else if (albumIconEl.textContent === "add" && concertsIconEl.textContent === "add") {
  	showAlert();
  }
};

function albumApiFunction() {
	// clears out previous album cards in container div
	albumCardsContainerEl.innerHTML = "";
  // // text entered into input is now 'searchedMusicTerm' variable, converted to lowercase
  var searchedMusicTerm = searchInputEl.value.toLowerCase();
  // sets album entity query parameter as a variable
  var albumEntity = "&entity=album";
  // fetch API for searched music term
  fetch("https://itunes.apple.com/search?term=" + searchedMusicTerm + albumEntity + "&attribute=artistTerm&limit=8")
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
			if (data.resultCount !== 0) {
				// loops through each album, index 0 - 9
				for (var i = 0; i < data.results.length; i++) {
					if (data.results[i].artistName.toLowerCase().includes(searchedMusicTerm)) {
						// object with album name, genre, release date, and url
						var albumDataObject = {
								albumArtistName: data.results[i].artistName,
								albumName: data.results[i].collectionName,
								albumGenre: data.results[i].primaryGenreName,
								albumReleaseDate: data.results[i].releaseDate,
								albumTrackCount: data.results[i].trackCount,
								albumCopyright: data.results[i].copyright,
								albumUrl: data.results[i].collectionViewUrl,
								albumArt: data.results[i].artworkUrl100
						}
						// run create album cards function, passing through albumDataObject
						createAlbumCards(albumDataObject);
					}
					if (data.results.length === 0) {
						albumCardsContainerEl.innerHTML = "";
						var warningMessage = document.createElement("h2");
						warningMessage.textContent = "There were no albums found for this artist!";
						albumCardsContainerEl.appendChild(warningMessage);
					}
				}
			} else if (data.resultCount === 0) {
				albumCardsContainerEl.innerHTML = "";
				var warningMessage = document.createElement("h2");
				warningMessage.textContent = "There were no albums found for this artist!";
				albumCardsContainerEl.appendChild(warningMessage);
			}
		})			
};

function concertsApiFunction() {
	// clears out previous album cards in container div
	venueCardsContainerEl.innerHTML = "";
  // text entered into input is now 'searchedMusicTerm' variable, converted to lowercase
  var searchedMusicTerm = searchInputEl.value.toLowerCase();
	// fetch API for searched music term
  fetch("https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + searchedMusicTerm + "&apikey=ff5u94LXWXFZZinXI0G9v1Y5GICPDiG5")
  	.then(function(response) {
    	return response.json();
    })
    .then(function(data) {
			if (data.page.totalElements !== 0) {
				for (var i = 0; i < data._embedded.events.length; i++) {
					if (searchedMusicTerm.includes(data._embedded.events[i].name.toLowerCase()) && data._embedded.events[i].dates.status.code == "onsale") {
						// object with venue name, artist name, venue address, event start date, ticket availability, ticketmaster url, and card image
						var venueDataObject = {
								venueName: data._embedded.events[i]._embedded.venues[0].name,
								artistName: data._embedded.events[i].name,
								venueAddress: data._embedded.events[i]._embedded.venues[0].address.line1 + ", " + data._embedded.events[i]._embedded.venues[0].city.name + ", " + data._embedded.events[i]._embedded.venues[0].state.stateCode + " " + data._embedded.events[i]._embedded.venues[0].postalCode,
								eventStartDate: data._embedded.events[i].dates.start.localDate + " at " + data._embedded.events[i].dates.start.localTime,
								ticketAvailability: data._embedded.events[i].dates.status.code,
								buyTicketsUrl: data._embedded.events[i].url,
								cardImage: data._embedded.events[i].images[0].url
						}
						// run create venue cards function, passing through venueDataObject
						createVenueCards(venueDataObject);
					}
					// alert user if there aren't any concerts for searched artist (finds artist, but no events)
					if (data._embedded.events.length === 0) {
						venueCardsContainerEl.innerHTML = "";
						var warningMessage = document.createElement("h2");
						warningMessage.textContent = "There are no upcoming concerts with tickets available for this artist!";
						venueCardsContainerEl.appendChild(warningMessage);
					}
				}
			// also alert	user if there aren't any concerts for searched artist (can't find artist at all)
			} else if (!venueDataObject) {
					venueCardsContainerEl.innerHTML = "";
					var warningMessage = document.createElement("h2");
					warningMessage.textContent = "There are no upcoming concerts with tickets available for this artist!";
					venueCardsContainerEl.appendChild(warningMessage);
			}	
    })
};

// creates albumCards for each album returned by API for searched artist
function createAlbumCards(albumDataObject) {
	// create elements
	var albumCardDivEl = document.createElement("div");
	var albumCardEl = document.createElement("div");
	var albumCardImageDivEl = document.createElement("div");
	var albumCardImageEl = document.createElement("img");
	var albumCardContent = document.createElement("div");
	var albumCardContentSpanEl = document.createElement("span");
	var albumCardContentSpanIEl = document.createElement("i");
	var albumCardContentAnchorEl = document.createElement("a");
	var albumCardContentAnchorIEl = document.createElement("i");
	var albumCardContentParagraphEl = document.createElement("p");
	var albumCardContentParagraphAnchorEl = document.createElement("a");
	var albumCardRevealDivEl = document.createElement("div");
	var albumCardRevealSpanEl = document.createElement("span");
	var albumCardRevealSpanIEl = document.createElement("i");
	var albumCardRevealUlEl = document.createElement("ul");
	var albumCardRevealLi1El = document.createElement("li");
	var albumCardRevealLi2El = document.createElement("li");
	var albumCardRevealLi3El = document.createElement("li");
	var albumCardRevealLi4El = document.createElement("li");
	var albumCardRevealLi5El = document.createElement("li");

	// add appropriate attributes for materialize.css to use
	albumCardDivEl.setAttribute("class", "col s12 m6 l3 hoverable");
	albumCardEl.setAttribute("class", "card medium");
	albumCardImageDivEl.setAttribute("class", "card-image waves-effect waves-block waves-light");
	albumCardImageEl.setAttribute("class", "activator");
	albumCardImageEl.setAttribute("src", albumDataObject.albumArt.replace("100x100bb", "1000x1000bb"));
	albumCardImageEl.setAttribute("height", "250vh");
	albumCardContent.setAttribute("class", "card-content");
	albumCardContentSpanEl.setAttribute("class", "card-title activator grey-text text-darken-4");
	albumCardContentSpanIEl.setAttribute("class", "material-icons right");
	albumCardContentAnchorEl.setAttribute("id", "favorite-album");
	albumCardContentAnchorEl.setAttribute("class", "btn-floating halfway-fab waves-effect waves-light red accent-3 favorite-album");
	albumCardContentAnchorIEl.setAttribute("id", albumDataObject.albumName);
	albumCardContentAnchorIEl.setAttribute("class", "material-icons favorite-album-icon");
	albumCardContentAnchorIEl.addEventListener("click", function(){selectFavoriteAlbum(albumDataObject)});
	albumCardContentParagraphAnchorEl.setAttribute("href", albumDataObject.albumUrl);
	albumCardContentParagraphAnchorEl.setAttribute("target", "_blank");
	albumCardRevealDivEl.setAttribute("class", "card-reveal");
	albumCardRevealSpanEl.setAttribute("class", "card-title grey-text text-darken-4");
	albumCardRevealSpanIEl.setAttribute("class", "material-icons right");

	// add text content to certain elements
	albumCardContentSpanEl.textContent = albumDataObject.albumName;
	albumCardContentSpanIEl.textContent = "more_vert";
	albumCardContentAnchorIEl.textContent = "favorite_border";
	albumCardContentParagraphAnchorEl.textContent = "Stream this album";
	albumCardRevealSpanEl.textContent = albumDataObject.albumName;
	albumCardRevealSpanIEl.textContent = "close";
	albumCardRevealLi1El.textContent = "Artist: " + albumDataObject.albumArtistName;
	albumCardRevealLi2El.textContent = "Genre: " + albumDataObject.albumGenre;
	albumCardRevealLi3El.textContent = "Release Date: " + albumDataObject.albumReleaseDate;
	albumCardRevealLi4El.textContent = "Tracks: " + albumDataObject.albumTrackCount;
	albumCardRevealLi5El.textContent = albumDataObject.albumCopyright;

	// append elemts together
	albumCardImageDivEl.appendChild(albumCardImageEl);

	albumCardContentSpanEl.appendChild(albumCardContentSpanIEl);
	albumCardContentAnchorEl.appendChild(albumCardContentAnchorIEl);
	albumCardContentParagraphEl.appendChild(albumCardContentParagraphAnchorEl);
	albumCardContent.appendChild(albumCardContentSpanEl);
	albumCardContent.appendChild(albumCardContentAnchorEl);
	albumCardContent.appendChild(albumCardContentParagraphEl);

	albumCardRevealSpanEl.appendChild(albumCardRevealSpanIEl);
	albumCardRevealUlEl.appendChild(albumCardRevealLi1El);
	albumCardRevealUlEl.appendChild(albumCardRevealLi2El);
	albumCardRevealUlEl.appendChild(albumCardRevealLi3El);
	albumCardRevealUlEl.appendChild(albumCardRevealLi4El);
	albumCardRevealUlEl.appendChild(albumCardRevealLi5El);
	albumCardRevealDivEl.appendChild(albumCardRevealSpanEl);
	albumCardRevealDivEl.appendChild(albumCardRevealUlEl);

	albumCardEl.appendChild(albumCardImageDivEl);
	albumCardEl.appendChild(albumCardContent);
	albumCardEl.appendChild(albumCardRevealDivEl);

	albumCardDivEl.appendChild(albumCardEl);
	albumCardsContainerEl.appendChild(albumCardDivEl);
};

// creates venueCards for each album returned by API for searched artist
function createVenueCards(venueDataObject) {
	//elements
	var venueCardDivEl = document.createElement("div");
	var venueCardEl = document.createElement("div");
	var venueCardImageDivEl = document.createElement("div");
	var venueCardImageEl = document.createElement("img");
	var venueCardContentEl = document.createElement("div");
	var venueCardContentSpanEl = document.createElement("span");
	var venueCardContentSpanIEl = document.createElement("i");
	var venueCardContentAnchorEl = document.createElement("a");
	var venueCardContentAnchorIEl = document.createElement("i");
	var venueCardContentParagraphAnchorEl = document.createElement("a");
	var venueCardContentParagraphEl = document.createElement("p");
	var venueCardRevealDivEl = document.createElement("div");
	var venueCardRevealSpanEl = document.createElement("span");
	var venueCardRevealSpanIEl = document.createElement("i");
	var venueCardRevealUlEl = document.createElement("ul");
	var venueCardRevealLi1El = document.createElement("li");
	var venueCardRevealLi2El = document.createElement("li");
	var venueCardRevealLi3El = document.createElement("li");
	var venueCardRevealLi4El = document.createElement("li");
	var venueCardRevealLi4El = document.createElement("li");

	//css attributes
	venueCardDivEl.setAttribute("class", "col s12 m6 l3 hoverable");
	venueCardEl.setAttribute("class", "card medium");
	venueCardImageDivEl.setAttribute("class", "card-image waves-effect waves-block waves-light");
	venueCardImageEl.setAttribute("class", "activator");
	venueCardImageEl.setAttribute("src", venueDataObject.cardImage.replace("RECOMENDATION_16_9.jpg", "RETINA_PORTRAIT_3_2.jpg"));
	venueCardImageEl.setAttribute("height", "250vh");
	venueCardContentEl.setAttribute("class", "card-content");
	venueCardContentSpanEl.setAttribute("class", "card-title activator grey-text text-darken-4");
	venueCardContentSpanIEl.setAttribute("class", "material-icons right");
	venueCardContentAnchorEl.setAttribute("id", "favorite-venue");
	venueCardContentAnchorEl.setAttribute("class", "btn-floating halfway-fab waves-effect waves-light red accent-3 favorite-venue");
	venueCardContentAnchorIEl.setAttribute("id", venueDataObject.venueName + venueDataObject.eventStartDate);
	venueCardContentAnchorIEl.setAttribute("class", "material-icons favorite-venue-icon");
	venueCardContentAnchorIEl.addEventListener("click", function(){selectFavoriteConcert(venueDataObject)});
	venueCardContentParagraphAnchorEl.setAttribute("href", venueDataObject.buyTicketsUrl);
	venueCardContentParagraphAnchorEl.setAttribute("target", "_blank");
	venueCardRevealDivEl.setAttribute("class", "card-reveal");
	venueCardRevealSpanEl.setAttribute("class", "card-title grey-text text-darken-4");
	venueCardRevealSpanIEl.setAttribute("class", "material-icons right");

	//text content
	venueCardContentSpanEl.textContent = venueDataObject.venueName;
	venueCardContentSpanIEl.textContent = "more_vert";
	venueCardContentAnchorIEl.textContent = "favorite_border";
	venueCardContentParagraphAnchorEl.textContent = "Buy tickets";
	venueCardRevealSpanEl.textContent = venueDataObject.venueName;
	venueCardRevealSpanIEl.textContent = "close";
	venueCardRevealLi1El.textContent = "Artist: " + venueDataObject.artistName;
	venueCardRevealLi2El.textContent = "Event Date: " + venueDataObject.eventStartDate;
	venueCardRevealLi3El.textContent = "Ticket Status: " + venueDataObject.ticketAvailability;
	venueCardRevealLi4El.textContent = "Venue Address: " + venueDataObject.venueAddress;

	//append elements
	venueCardImageDivEl.appendChild(venueCardImageEl);

	venueCardContentSpanEl.appendChild(venueCardContentSpanIEl);
	venueCardContentAnchorEl.appendChild(venueCardContentAnchorIEl);
	venueCardContentParagraphEl.appendChild(venueCardContentParagraphAnchorEl);
	venueCardContentEl.appendChild(venueCardContentSpanEl);
	venueCardContentEl.appendChild(venueCardContentAnchorEl);
	venueCardContentEl.appendChild(venueCardContentParagraphEl);

	venueCardRevealSpanEl.appendChild(venueCardRevealSpanIEl);
	venueCardRevealUlEl.appendChild(venueCardRevealLi1El);
	venueCardRevealUlEl.appendChild(venueCardRevealLi2El);
	venueCardRevealUlEl.appendChild(venueCardRevealLi3El);
	venueCardRevealUlEl.appendChild(venueCardRevealLi4El);
	venueCardRevealDivEl.appendChild(venueCardRevealSpanEl);
	venueCardRevealDivEl.appendChild(venueCardRevealUlEl);
	
	venueCardEl.appendChild(venueCardImageDivEl);
	venueCardEl.appendChild(venueCardContentEl);
	venueCardEl.appendChild(venueCardRevealDivEl);

	venueCardDivEl.appendChild(venueCardEl);
	venueCardsContainerEl.appendChild(venueCardDivEl);
};

// function if neither the album or concert buttons are selected and search button is clicked
function showAlert() {
	albumCardsContainerEl.innerHTML = "";
	var warningMessage = document.createElement("h2");
	warningMessage.textContent = "Please select one of the buttons before searching!";
	albumCardsContainerEl.appendChild(warningMessage);
};

// function when 'saved albums' button in navbar is clicked. gets saved albums object from local storage
function reloadSavedAlbumCards() {
	var getLocalStorageAlbums = localStorage.getItem("saved-albums");
	var albumDataObject = JSON.parse(getLocalStorageAlbums);
	// create cards from albumDataObject stored in localStorage
	for (var i = 0; i < albumDataObject.length; i++) {
		createAlbumCards(albumDataObject[i]);
		// add materialize styling to indicate that the albums are currently favorited/saved
		favoriteAlbumIconEl[i].textContent = "";
		favoriteAlbumIconEl[i].textContent = "favorite";
		favoriteAlbumButtonEl[i].classList.add("pulse");
	}
};

// function when 'saved concerts' button in navbar is clicked. gets saved albums object from local storage
function reloadSavedVenueCards() {
	var getLocalStorageVenues = localStorage.getItem("saved-venues");
	var venueDataObject = JSON.parse(getLocalStorageVenues);
	// create cards from venueDataObject stored in localStorage
	for (var i = 0; i < venueDataObject.length; i++) {
		createVenueCards(venueDataObject[i]);
		// add materialize styling to indicate that the concerts are currently favorited/saved
		favoriteVenueIconEl[i].textContent = "";
		favoriteVenueIconEl[i].textContent = "favorite";
		favoriteVenueButtonEl[i].classList.add("pulse");
	}
};

// on page load, function updates savedAlbumsArray to match the local storage object using keyword 'saved-albums'
function localStorageReloadSavedAlbums() {
	var reloadSavedAlbumsArray = localStorage.getItem("saved-albums");
	// if array is empty (no saved albums), don't do anything 
	if (reloadSavedAlbumsArray === null) {
		reloadSavedAlbumsArray = reloadSavedAlbumsArray;
	} 
	// else if array is not empty, parse the array
	else {
		var parsedReload = JSON.parse(reloadSavedAlbumsArray);
		savedAlbumsArray = parsedReload;
	}
};

// on page load, function updates savedVenuesArray to match the local storage object using keyword 'saved-venues'
function localStorageReloadSavedVenues() {
	var reloadSavedVenuesArray = localStorage.getItem("saved-venues");
	// if array is empty (no saved concerts), don't do anything 
	if (reloadSavedVenuesArray === null) {
		reloadSavedVenuesArray = reloadSavedVenuesArray;
	} 
	// else if array is not empty, parse the array
	else {
		var parsedReload = JSON.parse(reloadSavedVenuesArray);
		savedVenuesArray = parsedReload;
	}
};

localStorageReloadSavedAlbums();
localStorageReloadSavedVenues();