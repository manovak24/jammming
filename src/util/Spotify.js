const clientId = process.env.REACT_APP_SPOTIFY_API_KEY;
const redirectUri = 'https://manovak24.github.io/jammming/';
let accessToken;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        } 
        // check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            //This clears the parameters, allowing us to grab a new access token when it expires.
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
        { headers: {
            Authorization: `Bearer ${accessToken}`
        }}).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if(!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri,
                previewUrl: track.preview_url
            }));
        });

    },

    savePlaylist(listName, trackUris) {
        if ( !listName || !trackUris.length ) {
           return;
          }
   
          const accessToken = Spotify.getAccessToken();
          const headers = { Authorization: `Bearer ${accessToken}`}
          let userID;
   
          return fetch('https://api.spotify.com/v1/me', {headers: headers}
          ).then(response => response.json()
          ).then(jsonResponse => {
            userID = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,{
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ name: listName })
            }).then(response =>  response.json()
            ).then(jsonResponse => {
              const playlistID = jsonResponse.id;
               return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`,{
              method: 'POST',
              headers: headers,
              body: JSON.stringify({ uris: trackUris })
            });
          });
        });
      } // end of savePlaylist method

}

export default Spotify;