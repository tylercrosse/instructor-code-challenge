window.onload = function() {
  // on submit of search form call search function
  var searchForm = document.getElementById('search-form');
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    searchMovies();
    searchForm.reset();
  });
};


function searchMovies() {

  // get keyword from search form
  var keyword = document.getElementById('search-keyword').value;
  // get element where resuls will be displayed
  var results = document.getElementById('results');
  // add keyword to url used in api request
  var url = 'http://www.omdbapi.com/?s='+ escape(keyword);
  var xhr = new XMLHttpRequest();
  console.log(xhr);

  // callback on XMLHttpRequest Object
  xhr.onload = function(e) {

    responseObj = JSON.parse(e.target.responseText);
    response = responseObj.Search;

    // create divs for each item of response, add them to '.results'
    for (var i = 0; i < response.length; i++) {
      var newDiv = document.createElement('div');
      newDiv.innerHTML = response[i].Title;
      console.log(response[i].Title);
      results.appendChild(newDiv);
    }
  };
  xhr.open('GET', url, true);
  xhr.send(null);
}
