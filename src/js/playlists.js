import {renderPlaylists, renderPlaylistTracks} from './handlebarUtils.js'
import {getHashParams} from './webUtils.js'
import calculateGif from './gifs'

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

function playTrack(trackId, btnElement) {
  pauseCurrentlyPlaying()

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
      btnElement.classList.replace('btn-success', 'btn-danger')
      btnElement.innerText = "Pause"
      dance(trackId)
    },
    error: () => {
      activateDevices(event)
    }
  })
}

function pauseCurrentlyPlaying() {
  const currentlyPlaying = document.querySelectorAll('.btn-danger')
  currentlyPlaying.forEach(btn => {
    pauseTrack(btn)
  })
}

function dance(trackId) {
  $.ajax({
    url: `https://api.spotify.com/v1/audio-features/${trackId}`,
    headers: {
      'Authorization': 'Bearer ' + accessToken()
    },
    success: (response) => {
      const gif = calculateGif(response)
      $('#dancing-gif').show()
      $('#dancing-gif').attr("src", gif.url)
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

function pauseTrack(btnElement) {
  $.ajax({
    url: `https://api.spotify.com/v1/me/player/pause`,
    type: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + accessToken()
    },
    success: () => {
      btnElement.classList.replace('btn-danger', 'btn-success')
      btnElement.innerText = "Play"
      $('#dancing-gif').hide()
    }
  })
}

const accessToken = () => {
  const params = getHashParams()
  return params.access_token
}