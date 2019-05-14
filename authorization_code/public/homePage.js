import {renderPlaylistsInfo, renderUserInfo, renderOauthInfo} from './handlebarUtils.js'

const displayHomePage = () => {

  const params = getHashParams()
  let accessToken = params.access_token,
    refreshToken = params.refresh_token,
    error = params.error

  if (error) {
    alert('There was an error during the authentication')
  } else {
    if (accessToken) {
      renderOauthInfo(accessToken, refreshToken)

      $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + accessToken
        },
        success: (response) => {
          renderUserInfo(response)

          $('#login').hide()
          $('#loggedin').show()

          getPlaylists(response["id"], accessToken)
        }
      })
    } else {
      // render initial screen
      $('#login').show()
      $('#loggedin').hide()
    }

    document.getElementById('obtain-new-token').addEventListener('click', function() {
      $.ajax({
        url: '/refresh_token',
        data: {
          'refresh_token': refreshToken
        }
      }).done((data) => {
        accessToken = data.access_token
        renderOauthInfo(accessToken, refreshToken)
      })
    }, false)
  }
}

function getHashParams() {
  let hashParams = {}
  let e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1)
  while ( e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams
}

function getPlaylists(userId, accessToken) {
  $.ajax({
    url: `https://api.spotify.com/v1/users/${userId}/playlists`,
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    success: (response) => {
      renderPlaylistsInfo(response)
      console.log(response)
    }
  })
}

displayHomePage()