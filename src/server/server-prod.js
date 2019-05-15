/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */
import express from 'express'
import request from 'request'
import requestPromise from 'request-promise'
import cors from 'cors'
import querystring from 'querystring'
import cookieParser from 'cookie-parser'
import {generateRandomString} from './stringUtils'
import path from 'path'

const client_id = '3ed0a5d64f864489b1e522a0f5e26ee7' // Your client id
const client_secret = '545f9222eaf24c61877c92cf10541414' // Your secret
const redirect_uri = 'http://localhost:8888/callback' // Your redirect uri

const stateKey = 'spotify_auth_state'

const app = express()
const DIST_DIR = path.join(__dirname)
const HTML_FILE = path.join(DIST_DIR, 'index.html')

app.use(express.static(DIST_DIR))
   .use(cors())
   .use(cookieParser())

app.get('/', (req, res) => {
  res.sendFile(HTML_FILE)
})

app.get('/login', function(req, res) {

  const state = generateRandomString(16)
  res.cookie(stateKey, state)

  // your application requests authorization
  const scope = 'playlist-read-collaborative user-read-playback-state user-modify-playback-state'
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }))
})

app.get('/callback', (req, res) => {

  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null
  const state = req.query.state || null
  const storedState = req.cookies ? req.cookies[stateKey] : null

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }))
  } else {
    res.clearCookie(stateKey)
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    }

    requestPromise.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {

        const access_token = body.access_token,
            refresh_token = body.refresh_token

        const options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        }

        // use the access token to access the Spotify Web API
        request.get(options, (error, response, body) => {
          console.log(body);
        })

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }))
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }))
      }
    })
  }
})

console.log('Listening on 8888')
app.listen(8888)
