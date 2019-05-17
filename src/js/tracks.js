import $ from 'jquery'
import calculateGif from './gifUtils'
import {accessToken} from './webUtils'

export function playTrack(trackId, btnElement) {
  pauseCurrentlyPlaying()

  findChorusStart(trackId).then((chorusStart) => {
    console.log(chorusStart)
    $.ajax({
      url: `https://api.spotify.com/v1/me/player/play`,
      type: 'PUT',
      data: JSON.stringify({
        uris: [`spotify:track:${trackId}`],
        position_ms: chorusStart * 1000
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
  })
}

export function pauseTrack(btnElement) {
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

async function findChorusStart(trackId) {
  try {
    const response = await $.ajax({
      url: `https://api.spotify.com/v1/audio-analysis/${trackId}`,
      headers: {
        'Authorization': 'Bearer ' + accessToken()
      }
    })
    const sortedByLoudness = response["sections"].sort((a,b) => {
      return a["loudness"] <= b["loudness"] ? 1 : -1
    })
    const chorus = sortedByLoudness[0]
    return chorus["start"]
  } catch (error) {
    console.log(error)
  }
}

function pauseCurrentlyPlaying() {
  const currentlyPlaying = document.querySelectorAll('.btn-danger')
  currentlyPlaying.forEach(btn => {
    pauseTrack(btn)
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
      const devices = response["devices"]
      const phones = devices.filter(d => d.type === "Smartphone")
      if (phones.length > 0) {
        transferPlayback(event, phones[0].id)
      } else if (devices.length > 0) {
        transferPlayback(event, devices[0].id)
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

function dance(trackId) {
  $.ajax({
    url: `https://api.spotify.com/v1/audio-features/${trackId}`,
    headers: {
      'Authorization': 'Bearer ' + accessToken()
    },
    success: (featuresResponse) => {
      const gif = calculateGif(featuresResponse)
      let dancingGif = $('#dancing-gif')
      dancingGif.attr("src", gif.url)
      dancingGif.show()
    }
  })
}