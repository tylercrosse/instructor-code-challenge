window.onload = function() {
  // on submit of search form call search function
  var searchForm = document.getElementById('search-form');
  searchForm.addEventListener('submit', function() {
    event.preventDefault();
    // searchMovies();
    popcorn.searchMovies();
    searchForm.reset();
  });

  // var clearResultsForm = document.getElementById('clear-results-form');
  // searchForm.addEventListener('submit', function() {
  //   event.preventDefault();
  //   popcorn.clearResults();
  // });

  var showFavForm = document.getElementById('show-fav-form');
  showFavForm.addEventListener('submit', function() {
    event.preventDefault();
    popcorn.showFavorites();
  });
};

var popcorn = {
  searchMovies: function() {
    // get keyword from search form, & destination for where to render results
    var keyword = document.getElementById('search-keyword').value;
    var results = document.getElementById('results');
    // add keyword to url used in api request
    var url = 'http://www.omdbapi.com/?s='+ escape(keyword);

    // create new XMLHttpRequest Object
    var xhr = new XMLHttpRequest();
    // callback on XMLHttpRequest Object to render response to DOM
    xhr.onload = popcorn.renderXhr;
    // initialize XMLHttpRequest with HTTP method, where to make request, boolean for whether call is asynch (TRUE = asynch)
    xhr.open('GET', url, true);
    // sends request, if asynch returns as soon as request is sent, if not asynch then doesn't return until response has arrived
    xhr.send();
  },
  renderXhr: function(e) {
    // parse XMLHttpRequest.responseText in object
    var responseObj = JSON.parse(e.target.responseText);
    // use just the 'Search' values of response object
    var response = responseObj.Search;
    console.log(response);

    // create divs for each item of response, add them to '.results'
    for (var i = 0; i < response.length; i++) {
      var newDiv = document.createElement('div');
      newDiv.setAttribute('class', 'movieResult');
      newDiv.innerHTML = '<p>'+ response[i].Title +'</p><img class="moviePoster" src='+ response[i].Poster +'>';

      var favButton = document.createElement('form');
      favButton.setAttribute('class', 'inlineButton');
      favButton.innerHTML = '<input type="submit" value="Favorite this Movie" >';
      favButton.addEventListener('submit', popcorn.addToFavorites);

      newDiv.appendChild(favButton);
      results.appendChild(newDiv);
    }
  },
  // clearResults: function() {
  //   var results = document.getElementById('results');
  //   results.innerHTML = '';
  // },
  addToFavorites: function() {
    event.preventDefault();

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      //
    };
    xhr.open(); // method, destination, aysnc=boolean
    xhr.send(); // data to send
  },
  showFavorites: function() {
    console.log("Showing Favorites");
    // get show button element
  }
};
