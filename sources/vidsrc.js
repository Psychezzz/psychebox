// vidsrc.js — Streamr source for vidsrc.me
// Runs inside JavaScriptCore on iOS

var SOURCE_ID = "vidsrc";
var BASE_URL = "https://vidsrc.me";
var TMDB_KEY = "8265bd1679663a7ea12ac168da84d2e8";

// Search movies via TMDB (vidsrc uses TMDB IDs)
function searchMovies(query) {
    try {
        var encoded = encodeURIComponent(query);
        var url = "https://api.themoviedb.org/3/search/movie?api_key=" + TMDB_KEY + "&query=" + encoded;
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

// Get trending movies
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

// Get stream URL — returns embed URL as fallback
// Swift will detect it's not .m3u8 and use WebPlayer automatically
function getStreamURL(movieID) {
    return BASE_URL + "/embed/movie?tmdb=" + movieID;
}
