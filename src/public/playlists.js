import {renderPlaylists, renderPlaylistTracks} from './handlebarUtils.js'

export function getPlaylists(userId, accessToken) {
  $.ajax({
    url: `https://api.spotify.com/v1/users/${userId}/playlists`,
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    success: (response) => {
      renderPlaylists(response)
      setUpPlaylists(accessToken)
      console.log("response: ", response)
    }
  })
}

function setUpPlaylists(accessToken) {
  const playlistElements = document.querySelectorAll('#playlists-list li')
  console.log(playlistElements)
  for (const el of playlistElements) {
    el.addEventListener('click', (event) => {

      const playlistId = event.target['id'].substring('playlists-list'.length + 1)
      $.ajax({
        url: `https://api.spotify.com/v1/playlists/${playlistId}`,
        headers: {
          'Authorization': 'Bearer ' + accessToken
        },
        success: (response) => {
          const tracks = response.tracks.items.map((item) => item.track);
          response.tracks = tracks;
          renderPlaylistTracks(response)
          console.log("response: ", response)
        }
      })
    })
  }
}