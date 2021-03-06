export const renderUserInfo = (response) => {
  const userProfileSource = document.getElementById('user-profile-template').innerHTML
  const userProfileTemplate = Handlebars.compile(userProfileSource)
  const userProfilePlaceholder = document.getElementById('user-profile')

  userProfilePlaceholder.innerHTML = userProfileTemplate(response)
}

export const renderPlaylists = (response) => {
  const playlistsSource = document.getElementById('playlists-template').innerHTML
  const playlistsTemplate = Handlebars.compile(playlistsSource)
  const playlistsPlaceholder = document.getElementById('playlists')

  playlistsPlaceholder.innerHTML = playlistsTemplate(response)
}

export const renderPlaylistTracks = (response) => {
  const playlistTracksSource = document.getElementById('playlist-tracks-template').innerHTML
  const playlistTracksTemplate = Handlebars.compile(playlistTracksSource)
  const playlistTracksPlaceholder = document.getElementById('playlist-tracks')

  playlistTracksPlaceholder.innerHTML = playlistTracksTemplate(response)

  const playlistsPlaceholder = document.getElementById('playlists')

  playlistsPlaceholder.style.display = 'none'
  playlistTracksPlaceholder.style.display = 'block'
}

Handlebars.registerHelper('playlist-list', (items, options) => {
  let out = `<ul id="playlists-list" class='list-group list-group-flush'>`

  for(let i=0; i<items.length; i++) {
    const item = items[i]
    out = out + `<li class="btn-link list-group-item" id="playlist-${item.id}">`
    out = out + options.fn(item)
    out = out + "</li>"
  }

  return out + "</ul>"
})

Handlebars.registerHelper('tracks-list', (items, options) => {
  let out = `<ul id='tracks' class='list-group list-group-flush'>`

  for(let i=0; i<items.length; i++) {
    const item = items[i]
    out = out + `<li class="btn-link list-group-item">`
    out = out + `<button class='btn btn-success play-pause' id='track-${item.id}'>Play</button>`
    out = out + options.fn(item)
    out = out + "</li>"
  }

  return out + "</ul>"
})


