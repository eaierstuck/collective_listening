import {renderUserInfo} from './handlebarUtils.js'
import {getPlaylists} from './playlists.js'
import {getHashParams} from './webUtils.js'

const displayHomePage = () => {

  const params = getHashParams()
  let accessToken = params.access_token,
    error = params.error

  if (error) {
    alert('There was an error during the authentication')
  } else {
    if (accessToken) {
      $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + accessToken
        },
        success: (response) => {
          renderUserInfo(response)

          $('#login').hide()
          $('#loggedin').show()

          getPlaylists(response["id"])
        }
      })
    } else {
      // render initial screen
      $('#login').show()
      $('#loggedin').hide()
    }
  }
}

displayHomePage()