import express from "express";
import "dotenv/config";
const SpotifyWebApi = (await import("spotify-web-api-node")).default;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URL
});

await initSpotify();

async function initSpotify() {
  const data = await spotifyApi.clientCredentialsGrant();
  spotifyApi.setAccessToken(data.body.access_token);
  console.log("Spotify token set");
}

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/searchByArtist", async (req, res) => {
    let artistName = req.query.artist;
    console.log("Searcing artist: " + artistName);

    const data = await spotifyApi.searchArtists(artistName, { limit: 5 });
    const artists = data.body.artists.items;
    const artist = artists[0];
    // console.log(artist);

    res.render("artists.ejs", {artist});
});

app.get("/searchBySong", async (req, res) => {
    let songName = req.query.song;
    console.log("Searching song: " + songName);

    const data = await spotifyApi.searchTracks(`track:${songName}`, { limit: 10 });
    const songs = data.body.tracks.items;
    // console.log(songs);

    res.render("songs.ejs", {songs});
});

app.get("/searchByAlbum", async (req, res) => {
    let albumName = req.query.album;
    console.log("Searching album: " + albumName);

    const data = await spotifyApi.searchAlbums(albumName, { limit: 5 });
    const albums = data.body.albums.items;
    const album = albums[0];
    // console.log(album);

    res.render("albums.ejs", {album});
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
