import {renderPlaylists, renderPlaylistTracks} from './handlebarUtils.js'
import $ from 'jquery'
import {playTrack, pauseTrack} from './tracks'
import {accessToken} from './webUtils'

export function getPlaylists(userId) {
  $.ajax({
    url: `https://api.spotify.com/v1/users/${userId}/playlists`,
    headers: {
      'Authorization': 'Bearer ' + accessToken()
    },
    success: (response) => {
      renderPlaylists(response)
      setUpPlaylists()
    }
  })
}

function setUpPlaylists() {
  const playlistElements = document.querySelectorAll('#playlists-list li')
  for (const el of playlistElements) {
    el.addEventListener('click', (event) => {

      const playlistId = event.target['id'].substring('playlist-'.length)
      $.ajax({
        url: `https://api.spotify.com/v1/playlists/${playlistId}`,
        headers: {
          'Authorization': 'Bearer ' + accessToken()
        },
        success: (response) => {
          response.tracks = response.tracks.items.map((item) => item.track);
          renderPlaylistTracks(response)
          setUpPlaylistTracks()
        }
      })
    })
  }
}

function setUpPlaylistTracks() {
  const playButtons = document.querySelectorAll('.play-pause')
  for (const el of playButtons) {
    el.addEventListener('click', (event) => {
      if (event.target['classList'].contains('btn-success')) {
        const trackId = event.target['id'].substring('track-'.length)
        playTrack(trackId, event.target)
      } else if (event.target['classList'].contains('btn-danger')) {
        pauseTrack(event.target)
      }
    })
  }

  document.getElementById('back-to-playlists').addEventListener('click', () => {
    $('#playlist-tracks').hide()
    $('#playlists').show()
  })
}