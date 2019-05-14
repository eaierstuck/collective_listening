export const renderOauthInfo = (accessToken, refreshToken) => {
  const oauthSource = document.getElementById('oauth-template').innerHTML
  const oauthTemplate = Handlebars.compile(oauthSource)
  const oauthPlaceholder = document.getElementById('oauth')
  oauthPlaceholder.innerHTML = oauthTemplate({
    access_token: accessToken,
    refresh_token: refreshToken
  })
}

export const renderUserInfo = (response) => {
  const userProfileSource = document.getElementById('user-profile-template').innerHTML
  const userProfileTemplate = Handlebars.compile(userProfileSource)
  const userProfilePlaceholder = document.getElementById('user-profile')

  userProfilePlaceholder.innerHTML = userProfileTemplate(response)
}

export const renderPlaylistsInfo = (response) => {
  const playlistsSource = document.getElementById('playlists-template').innerHTML
  const playlistsTemplate = Handlebars.compile(playlistsSource)
  const playlistsPlaceholder = document.getElementById('playlists')

  playlistsPlaceholder.innerHTML = playlistsTemplate(response)
}

Handlebars.registerHelper('list', (items, options) => {
  let out = "<ul>"

  for(let i=0, l=items.length; i<l; i++) {
    out = out + "<li>" + options.fn(items[i]) + "</li>"
  }

  return out + "</ul>"
})


