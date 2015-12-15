window.onload = function() {
  // on submit of search form call search function
  var searchForm = document.getElementById('search-form');
  searchForm.addEventListener('submit', function() {
    event.preventDefault();
    // searchMovies();
    popcorn.searchMovies();
    searchForm.reset();
  });

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
    xhr.onload = popcorn.renderMovies;
    // initialize XMLHttpRequest with HTTP method, where to make request, boolean for whether call is asynch (TRUE = asynch)
    xhr.open('GET', url, true);
    // sends request, if asynch returns as soon as request is sent, if not asynch then doesn't return until response has arrived
    xhr.send();
  },
  renderMovies: function(e) {
    // parse XMLHttpRequest.responseText in object
    var resObj = JSON.parse(e.target.responseText);
    // use just the 'Search' values of response object
    var res = resObj.Search;
    console.log(res);

    // create html elements for each item of res, add them to '.results'
    for (var i = 0; i < res.length; i++) {
      var newDiv = document.createElement('div');
      newDiv.setAttribute('id', res[i].imdbID);
      newDiv.setAttribute('class', 'omdbResult');
      newDiv.innerHTML =
        '<strong><p class="title">'+ res[i].Title +'</p></strong> \
        <p>'+ res[i].Year +'</p> \
        <img class="moviePoster" src='+ res[i].Poster +'>';

      var detailButton = document.createElement('button');
      detailButton.innerHTML = 'Show Details';
      detailButton.setAttribute('class', 'inlineButton detailButton');
      detailButton.addEventListener('click', popcorn.getDetails);

      var favButton = document.createElement('form');
      favButton.setAttribute('class', 'inlineButton');
      favButton.innerHTML = '<input type="submit" value="Favorite this Movie" >';
      favButton.addEventListener('submit', popcorn.addToFavorites);

      newDiv.appendChild(detailButton);
      newDiv.appendChild(favButton);
      results.appendChild(newDiv);
    }
  },
  getDetails: function() {
    event.preventDefault();

    var self = this;
    var omdbResult = self.parentNode;
    omdbResult.classList.add("detailed");
    var title = omdbResult.querySelector('.title').innerHTML;
    var url = 'http://www.omdbapi.com/?t=' + escape(title) + '&y=&plot=full&r=json';
    var xhr = new XMLHttpRequest();
    xhr.onload = function(e) {
      var res = JSON.parse(e.target.responseText);
      popcorn.renderDetails(res, omdbResult);
    };
    xhr.open('GET', url, true);
    xhr.send();
  },
  renderDetails: function(res, omdbResult) {
    var details = document.createElement('div');
    details.innerHTML =
      '<p>'+ res.Rated +' | '+ res.Runtime +' | '+ res.Genre +'</p> \
      <p>IMDB Rating: '+ res.imdbRating +' / 10</p> \
      <p>Director: '+ res.Director +'</p> \
      <p>Writer: '+ res.Writer +'</p> \
      <p>Actors: '+ res.Actors +'</p> \
      <p class="plot">'+ res.Plot +'</p>';
    omdbResult.appendChild(details);
  },
  addToFavorites: function() {
    event.preventDefault();

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      //
    };
    xhr.open('POST', url, true); // method, destination, aysnc=boolean
    xhr.send(); // data to send
  },
  showFavorites: function() {
    console.log("Showing Favorites");
    // get show button element
  }
};
