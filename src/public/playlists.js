import {renderPlaylists, renderPlaylistTracks} from './handlebarUtils.js'
import {getHashParams} from './webUtils.js'

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
          const tracks = response.tracks.items.map((item) => item.track);
          response.tracks = tracks;
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
        playTrack(event)
      } else if (event.target['classList'].contains('btn-danger')) {
        pauseTrack(event)
      }
    })
  }
}

function playTrack(event) {
  const trackId = event.target['id'].substring('track-'.length)
  $.ajax({
    url: `https://api.spotify.com/v1/me/player/play`,
    type: 'PUT',
    data: JSON.stringify({
      uris: [`spotify:track:${trackId}`]
    }),
    headers: {
      'Authorization': 'Bearer ' + accessToken()
    },
    success: () => {
      event.target.classList.replace('btn-success', 'btn-danger')
      event.target.innerText = "Pause"
    },
    error: () => {
      activateDevices(event)
    }
  })
}

function activateDevices(event) {
  $.ajax({
    url: `https://api.spotify.com/v1/me/player/devices`,
    headers: {
      'Authorization': 'Bearer ' + accessToken()
    },
    async: false,
    success: (response) => {
      const phones = response.devices.filter(d => d.type === "Smartphone")
      if (phones.length > 0) {
        transferPlayback(event, phones[0].id)
      } else if (response.devices.length > 0) {
        transferPlayback(event, response.devices[0].id)
      } else {
        alert('open spotify app!')
      }
    }
  })
}

function transferPlayback(event, deviceId) {
  $.ajax({
    url: `https://api.spotify.com/v1/me/player`,
    type: 'PUT',
    data: JSON.stringify({
      device_ids: [deviceId]
    }),
    headers: {
      'Authorization': 'Bearer ' + accessToken()
    },
    success: () => {
      playTrack(event)
    }
  })
}

function pauseTrack(event) {
  $.ajax({
    url: `https://api.spotify.com/v1/me/player/pause`,
    type: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + accessToken()
    },
    success: () => {
      event.target.classList.replace('btn-danger', 'btn-success')
      event.target.innerText = "Play"
    }
  })
}

const accessToken = () => {
  const params = getHashParams()
  return params.access_token
}