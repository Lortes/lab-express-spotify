require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));



app.get("/", (req, res, next) => {
    res.render('home-page')
})

app.get("/artist-search", (req, res, next) => {
    const { nameArtist } = req.query

    spotifyApi.searchArtists(nameArtist)
        .then(data => {
            res.render('artist-search-results', { artistList: data.body.artists.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:artistId", (req, res, next) => {
    const { artistId } = req.params

    spotifyApi.getArtistAlbums(artistId)
        .then(data => {
            res.render('albums', { albumList: data.body.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/tracks/:album_id', (req, res) => {

    const { album_id } = req.params

    spotifyApi
        .getAlbumTracks(album_id)
        .then(data => {
            const tracksData = data.body.items
            res.render('tracks', { tracksData })
        })
        .catch(err => console.log(err))

})


app.listen(5005, () => console.log('My Spotify project running on port 5005 🎧 🥁 🎸 🔊'));
