// sflix.js — Streamr source for sflix.ps
var SOURCE_ID = "sflix";
var BASE_URL = "https://sflix.ps";
var TMDB_KEY = "8265bd1679663a7ea12ac168da84d2e8";

function searchMovies(query) {
    try {
        var encoded = encodeURIComponent(query);
        var url = "https://api.themoviedb.org/3/search/movie?api_key=" + TMDB_KEY + "&query=" + encoded + "&include_adult=false";
        var response = httpGet(url);
        var data = JSON.parse(response);
        var results = [];
        for (var i = 0; i < Math.min(data.results.length, 20); i++) {
            var m = data.results[i];
            results.push({
                id: String(m.id),
                title: m.title || "",
                year: m.release_date ? m.release_date.substring(0, 4) : "",
                genre: "",
                rating: m.vote_average ? m.vote_average.toFixed(1) : "0.0",
                posterURL: m.poster_path ? "https://image.tmdb.org/t/p/w500" + m.poster_path : "",
                sourceID: SOURCE_ID
            });
        }
        return JSON.stringify(results);
    } catch(e) {
        return "[]";
    }
}

function getTrendingMovies() {
    try {
        var url = "https://api.themoviedb.org/3/trending/movie/week?api_key=" + TMDB_KEY;
        var response = httpGet(url);
        var data = JSON.parse(response);
        var results = [];
        for (var i = 0; i < Math.min(data.results.length, 20); i++) {
            var m = data.results[i];
            results.push({
                id: String(m.id),
                title: m.title || "",
                year: m.release_date ? m.release_date.substring(0, 4) : "",
                genre: "",
                rating: m.vote_average ? m.vote_average.toFixed(1) : "0.0",
                posterURL: m.poster_path ? "https://image.tmdb.org/t/p/w500" + m.poster_path : "",
                sourceID: SOURCE_ID
            });
        }
        return JSON.stringify(results);
    } catch(e) {
        return "[]";
    }
}

function getStreamURL(movieID) {
    try {
        var searchURL = BASE_URL + "/search/" + movieID;
        var page = httpGet(searchURL);
        var match = page.match(/href="\/movie\/watch-[^"]*-(\d+)"/);
        if (match && match[1]) {
            var sflixID = match[1];
            return BASE_URL + "/movie/watch-movie-" + sflixID + "-" + sflixID;
        }
        return BASE_URL + "/movie/" + movieID;
    } catch(e) {
        return BASE_URL + "/movie/" + movieID;
    }
}
