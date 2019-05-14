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
    }
  })
}

function setUpPlaylists(accessToken) {
  const playlistElements = document.querySelectorAll('#playlists-list li')
  for (const el of playlistElements) {
    el.addEventListener('click', (event) => {

      const playlistId = event.target['id'].substring('playlist-'.length)
      $.ajax({
        url: `https://api.spotify.com/v1/playlists/${playlistId}`,
        headers: {
          'Authorization': 'Bearer ' + accessToken
        },
        success: (response) => {
          const tracks = response.tracks.items.map((item) => item.track);
          response.tracks = tracks;
          renderPlaylistTracks(response)
          setUpPlaylistTracks(accessToken)
        }
      })
    })
  }
}

function setUpPlaylistTracks(accessToken) {
  const playButtons = document.querySelectorAll('.play-pause')
  for (const el of playButtons) {
    el.addEventListener('click', (event) => {
      const trackId = event.target['id'].substring('track-'.length)

      if (event.target['classList'].contains('btn-success')) {
        playTrack(trackId, accessToken, el)
      } else if (event.target['classList'].contains('btn-danger')) {
        pauseTrack(accessToken, el)
      }
    })
  }
}

function playTrack(trackId, accessToken, el) {
  $.ajax({
    url: `https://api.spotify.com/v1/me/player/play`,
    type: 'PUT',
    data: JSON.stringify({
      uris: [`spotify:track:${trackId}`]
    }),
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    success: () => {
      el.classList.remove('btn-success')
      el.classList.add('btn-danger')
      el.innerText = "Pause"
    },
    error: () => {
      activateDevices(trackId, accessToken, el)
    }
  })
}

function activateDevices(trackId, accessToken, el) {
  $.ajax({
    url: `https://api.spotify.com/v1/me/player/devices`,
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    async: false,
    success: (response) => {
      const phones = response.devices.filter(d => d.type === "Smartphone")
      if (phones.length > 0) {
        transferPlayback(trackId, accessToken, phones[0].id, el)
      } else if (response.devices.length > 0) {
        transferPlayback(trackId, accessToken, response.devices[0].id, el)
      } else {
        alert('open spotify app!')
      }
    }
  })
}

function transferPlayback(trackId, accessToken, deviceId, el) {
  $.ajax({
    url: `https://api.spotify.com/v1/me/player`,
    type: 'PUT',
    data: JSON.stringify({
      device_ids: [deviceId]
    }),
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    success: () => {
      playTrack(trackId, accessToken, el)
    }
  })
}

function pauseTrack(accessToken, el) {
  $.ajax({
    url: `https://api.spotify.com/v1/me/player/pause`,
    type: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    success: () => {
      el.classList.remove('btn-danger')
      el.classList.add('btn-success')
      el.innerText = "Play"
    }
  })
}