window.onload = function() {
  popcorn.getFavorites();

  // on submit of search form call search function (callback)
  var searchForm = document.getElementById('search-form');
  searchForm.addEventListener('submit', function() {
    event.preventDefault();

    popcorn.clearResults();

    // call the function that searches OMDB
    popcorn.getMovies();
    searchForm.reset();
  });

  var showFavForm = document.getElementById('show-fav-form');
  showFavForm.addEventListener('submit', function() {
    event.preventDefault();

    popcorn.clearResults();

    popcorn.showFavorites();
  });
};

var favs = [];

var popcorn = {
  clearResults: function() {
    document.getElementById('results').innerHTML = '';
  },
  getMovies: function() {
    // get keyword from search form, & destination for where to render results
    var keyword = document.getElementById('search-keyword').value;
    var results = document.getElementById('results');
    // add keyword to url used in api request
    var url = 'https://www.omdbapi.com/?s=' + escape(keyword);

    // create new XMLHttpRequest Object
    var xhr = new XMLHttpRequest();
    // callback on XMLHttpRequest Object to render response to DOM
    xhr.onload = popcorn.renderMovies;
    // initialize XMLHttpRequest with HTTP method, where to make request, boolean for whether call is asynch (TRUE = asynch)
    xhr.open('GET', url, true);
    // sends request, if asynch returns as soon as request is sent, if not asynch then doesn't return until response has arrived
    xhr.send();
  },
  renderMovies: function(e, flag) {
    // parse XMLHttpRequest.responseText in object
    var resObj = JSON.parse(e.target.responseText);

    // if response came from search, iterate through it
    if (resObj.Search) {
      var res = resObj.Search;
      for (var i = 0; i < res.length; i++) {
        popcorn.resultTemplate(res[i]);
      }
    }
    // otherwise pass along flag to indicate not from search - flag is used to distinguish b/t
    // whether this was orginally called by search vs. showFavorites
    else {
      var res = resObj;
      popcorn.resultTemplate(res, flag);
    }
  },
  resultTemplate: function(res, flag) {
    // create html elements for each item of res, add them to '.results'
    var omdbResult = document.createElement('div');
    omdbResult.setAttribute('id', res.imdbID);
    omdbResult.setAttribute('class', 'omdbResult');
    omdbResult.innerHTML =
      '<img class="moviePoster" src=' + res.Poster + '> \
      <strong><p class="title">' + res.Title + '</p></strong> \
      <p>' + res.Year + '</p>';
    // add favorite button
    var favButton = document.createElement('form');
    favButton.setAttribute('class', 'inlineButton');
    favButton.innerHTML = '<input type="submit" value="Favorite this Movie" >';
    favButton.addEventListener('submit', function() {
      event.preventDefault();
      var title = this.parentNode.querySelector('.title').innerHTML;
      var id = this.parentNode.id;
      popcorn.addToFavorites(title, id);
    });
    // make an api call to get details, render them, hide them, & add button to toggle details
    // if flag exists, pass the response to next function - flag is used to distinguish b/t
    // whether this was orginally called by search vs. showFavorites
    flag ? popcorn.getDetails(omdbResult, res) : popcorn.getDetails(omdbResult);

    // add conent to DOM
    omdbResult.appendChild(favButton);
    results.appendChild(omdbResult);
    // check if results are in the list that has already been favorited
    popcorn.checkFavorites(res.imdbID, omdbResult);
  },
  getDetails: function(omdbResult, res) {
    event.preventDefault();

    // if function is called with a response use that to render details
    if (res) {
      popcorn.renderDetails(res, omdbResult);
    }
    // otherwise make a api call to get details and use that to render details
    else {
      var title = omdbResult.querySelector('.title').innerHTML;
      var url = 'https://www.omdbapi.com/?t=' + escape(title) + '&y=&plot=full&r=json';
      var xhr = new XMLHttpRequest();
      xhr.onload = function(e) {
        var res = JSON.parse(e.target.responseText);
        popcorn.renderDetails(res, omdbResult);
      };
      xhr.open('GET', url, true);
      xhr.send();
    }
  },
  renderDetails: function(res, omdbResult) {
    var details = document.createElement('div');
    details.setAttribute('class', 'details');
    // initially hide details
    details.style.display = 'none';
    details.innerHTML =
      '<p>' + res.Rated + ' | ' + res.Runtime + ' | ' + res.Genre + '</p> \
      <p>IMDB Rating: ' + res.imdbRating + ' / 10</p> \
      <p>Director: ' + res.Director + '</p> \
      <p>Writer: ' + res.Writer + '</p> \
      <p>Actors: ' + res.Actors + '</p> \
      <p class="plot">' + res.Plot + '</p>';

    // toggle show/hide of details when card is clicked on
    omdbResult.addEventListener('click', function() {
      // toggle details
      popcorn.toggleVisible(details);
      omdbResult.classList.toggle("detailed");
    });

    // append content to DOM
    omdbResult.appendChild(details);
  },
  checkFavorites: function(id, omdbResult) {
    // by default assume, not favorited
    var favorited = false;

    // check id of movie in question against the ones that have already been favorited
    for (var j = 0; j < favs.length; j++) {

      if (id == favs[j].oid) {
        // when function is passed an omdbResult div && it's been favorited then color it
        if (omdbResult) {
          omdbResult.style.background = "gold";
        }
        // change favorited to true if it has been favorited
        favorited = true;
      }
    }
    return favorited;
  },
  addToFavorites: function(title, id) {
    event.preventDefault();
    omdbResult = event.path[1];

    // check if already favorited before adding
    if (popcorn.checkFavorites(id)) {
      console.log("Already in favorites!");
    } else {
      console.log("Added to favorites!");

      fav = {
        name: title,
        oid: id
      };
      favs.push(fav);

      omdbResult.style.background = "gold";

      // post request to express backend, stored in data.json
      var url = '/favorites';
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {

      };
      xhr.open('POST', url, true); // method, destination, aysnc=boolean
      xhr.setRequestHeader('Content-Type', 'application/json');
      // data to send, server.js requires 'name' & 'old' keys in request
      xhr.send('{"name":"' + title + '","oid":"' + id + '"}');
    }

  },
  getFavorites: function() {
    // get favorites from data.json
    var url = '/favorites';
    var xhr = new XMLHttpRequest();
    xhr.onload = function(e) {
      res = JSON.parse(e.target.response);
      // add each response to favs array
      for (var i = 0; i < res.length; i++) {
        favs.push(res[i]);
      }
    };
    xhr.open('GET', url, true); // method, destination, aysnc=boolean
    xhr.send();
  },
  showFavorites: function() {
    // make an API call for each favorite and render result
    for (var i = 0; i < favs.length; i++) {
      var title = favs[i].name;
      var url = 'https://www.omdbapi.com/?t=' + escape(title) + '&y=&plot=full&r=json';
      var xhr = new XMLHttpRequest();
      xhr.onload = function(e) {
        // IMPORTANT flag get passed along down cascade and tells getDetails & renderDetails
        // to use the response from here instead of making another API call for the same data
        // renderMovies -> resultTemplate -> getDetails -> renderDetails(res, omdbResult)
        // using the flag helps reduce duplicate code
        var flag = true;
        popcorn.renderMovies(e, flag);
      };
      xhr.open('GET', url, true);
      xhr.send();
    }
  },
  toggleVisible: function(elToToggle) {
    // similar functionality to jQuery .toggle()
    var el = elToToggle;
    if (el.style.display == 'none') {
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  }
};
