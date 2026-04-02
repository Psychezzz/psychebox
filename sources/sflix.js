// sflix.js — Streamr source for sflix.to
// Uses TMDB for search/metadata, sflix.to for streams

var SOURCE_ID = "sflix";
var BASE_URL = "https://sflix.to";
var TMDB_KEY = "8265bd1679663a7ea12ac168da84d2e8";

// Search movies via TMDB (sflix uses TMDB IDs)
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
        console.log("searchMovies error: " + e);
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
        console.log("getTrendingMovies error: " + e);
        return "[]";
    }
}

// Get stream URL from sflix.to
// Tries to extract direct embed — falls back gracefully
function getStreamURL(movieID) {
    try {
        // Step 1: Find sflix internal ID from TMDB ID
        var searchURL = BASE_URL + "/search/" + movieID;
        var page = httpGet(searchURL);

        // Step 2: Extract the sflix movie slug from the page
        var match = page.match(/href="\/movie\/watch-[^"]*-(\d+)"/);
        if (match && match[1]) {
            var sflixID = match[1];
            return BASE_URL + "/movie/watch-movie-" + sflixID + "-" + sflixID;
        }

        // Step 3: Fallback — use TMDB ID directly in sflix embed
        return BASE_URL + "/movie/" + movieID;

    } catch(e) {
        console.log("getStreamURL error: " + e);
        return BASE_URL + "/movie/" + movieID;
    }
}
```

Click **Commit changes**.

---

## Step 4 — Add the repo in your app

Your repo URL will be:
```
https://raw.githubusercontent.com/Psychezzz/streamr-sources/main/index.json
