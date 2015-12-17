window.onload = function() {
  popcorn.getFavorites();

  // on submit of search form call search function (callback)
  var searchForm = document.getElementById('search-form');
  searchForm.addEventListener('submit', function() {
    event.preventDefault();
    // call the function that searches OMDB
    popcorn.getMovies();
    searchForm.reset();
  });

  var showFavForm = document.getElementById('show-fav-form');
  showFavForm.addEventListener('submit', function() {
    event.preventDefault();
    popcorn.getFavorites();
  });
};

var favs = [];

var popcorn = {
  getMovies: function() {
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

    // create html elements for each item of res, add them to '.results'
    for (var i = 0; i < res.length; i++) {

      var omdbResult = document.createElement('div');
      omdbResult.setAttribute('id', res[i].imdbID);
      omdbResult.setAttribute('class', 'omdbResult');
      omdbResult.innerHTML =
        '<strong><p class="title">'+ res[i].Title +'</p></strong> \
        <p>'+ res[i].Year +'</p> \
        <img class="moviePoster" src='+ res[i].Poster +'>';

      var favButton = document.createElement('form');
      favButton.setAttribute('class', 'inlineButton');
      favButton.innerHTML = '<input type="submit" value="Favorite this Movie" >';
      favButton.addEventListener('submit', function() {
        event.preventDefault();
        var title =this.parentNode.querySelector('.title').innerHTML;
        var id = this.parentNode.id;
        popcorn.addToFavorites(title, id);
      });

      popcorn.getDetails(omdbResult);

      omdbResult.appendChild(favButton);
      results.appendChild(omdbResult);

      popcorn.checkFavorites(res[i].imdbID, omdbResult);

    }
  },
  checkFavorites: function(id, omdbResult) {
    var favorited = false;

    // check id of movie in question against the ones that have already been favorited
    for (var j = 0; j < favs.length; j++) {
      console.log(favs[j].oid + " Against");

      if (id == favs[j].oid) {
        // when function is passed an omdbResult div && it's been favorited then color it
        if (omdbResult) {
          omdbResult.style.background = "gold";
        }
        favorited = true;
      }

    }
    return favorited;
  },
  getDetails: function(omdbResult) {
    event.preventDefault();

    // var self = this;
    // var omdbResult = self.parentNode;
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
    details.setAttribute('class', 'details');
    details.style.display = 'none';
    details.innerHTML =
      '<p>'+ res.Rated +' | '+ res.Runtime +' | '+ res.Genre +'</p> \
      <p>IMDB Rating: '+ res.imdbRating +' / 10</p> \
      <p>Director: '+ res.Director +'</p> \
      <p>Writer: '+ res.Writer +'</p> \
      <p>Actors: '+ res.Actors +'</p> \
      <p class="plot">'+ res.Plot +'</p>';
    // append details to result card passed into function

    var detailButton = document.createElement('button');
    detailButton.innerHTML = 'Show Details';
    detailButton.setAttribute('class', 'inlineButton detailButton');
    detailButton.addEventListener('click', function(){
      popcorn.toggleVisible(details);
      omdbResult.classList.toggle("detailed"); // TODO superflouous; seperate to keep main functions more clear
    });

    omdbResult.appendChild(detailButton);
    omdbResult.appendChild(details);
  },
  addToFavorites: function(title, id) {
    event.preventDefault();
    omdbResult = event.path[1];

    if (popcorn.checkFavorites(id)) {
      console.log("Already in favorites!");
    }
    else {
      console.log("Added to favorites!");

      fav = {name: title, oid: id};
      favs.push(fav);

      omdbResult.style.background = "gold";

      var url = '/favorites';
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
        // IDEA something about success / failure
      };
      xhr.open('POST', url, true); // method, destination, aysnc=boolean
      xhr.setRequestHeader('Content-Type', 'application/json');
      // data to send, server.js requires 'name' & 'old' keys in request
      xhr.send('{"name":"'+ title +'","oid":"'+ id +'"}');
    }

  },
  getFavorites: function() {
    var url = '/favorites';
    var xhr = new XMLHttpRequest();
    xhr.onload = function(e) {
      // getMovies -> renderMovies -> getDetails -> renderDetails -> toggleVisible
      res = JSON.parse(e.target.response);
      for (var i=0; i < res.length; i++) {
        favs.push(res[i]);
      }
    };
    xhr.open('GET', url, true); // method, destination, aysnc=boolean
    xhr.send();
  },
  toggleVisible: function(elToToggle) {
    var el = elToToggle;
    if(el.style.display == 'none')
    {
      el.style.display = 'block';
    }
    else
    {
      el.style.display = 'none';
    }
  } // http://stackoverflow.com/questions/7662247/javascript-show-and-hide-elements-on-click
};
