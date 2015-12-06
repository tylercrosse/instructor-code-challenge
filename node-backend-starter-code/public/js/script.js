window.onload = function() {
  // on submit of search form call search function
  var searchForm = document.getElementById('search-form');
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // searchMovies();
    popcorn.searchMovies();
    searchForm.reset();
  });
};

var popcorn = {
  searchMovies: function() {
    // get keyword from search form
    var keyword = document.getElementById('search-keyword').value;
    // get element where resuls will be displayed
    var results = document.getElementById('results');
    // add keyword to url used in api request
    var url = 'http://www.omdbapi.com/?s='+ escape(keyword);
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

    // create divs for each item of response, add them to '.results'
    for (var i = 0; i < response.length; i++) {
      var newDiv = document.createElement('div');
      newDiv.innerHTML = response[i].Title;
      results.appendChild(newDiv);
    }
  }
};
