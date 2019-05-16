import {generateRandomString} from './stringUtils'
import querystring from 'querystring'
import requestPromise from 'request-promise'
import request from 'request'
import path from 'path'

const stateKey = 'spotify_auth_state'
const redirectUri = 'http://localhost:8888/callback' // Your redirect uri
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET

const DIST_DIR = __dirname
const HTML_FILE = path.join(DIST_DIR, 'index.html')

export const addRoutes = (app, compiler) => {
  app.get('/', (req, res, next) => {
    compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
      if (err) {
        return next(err)
      }
      res.set('content-type', 'text/html')
      res.send(result)
      res.end()
    })
  })

  app.get('/login', function(req, res) {

    const state = generateRandomString(16)
    res.cookie(stateKey, state)

    // your application requests authorization
    const scope = 'playlist-read-collaborative user-read-playback-state user-modify-playback-state'
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
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
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64'))
        },
        json: true
      }

      requestPromise.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {

          const accessToken = body.access_token,
            refreshToken = body.refresh_token

          const options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + accessToken },
            json: true
          }

          // use the access token to access the Spotify Web API
          request.get(options, (error, response, body) => {
            console.log(body);
          })

          // we can also pass the token to the browser to make requests from there
          res.redirect('/#' +
            querystring.stringify({
              access_token: accessToken,
              refresh_token: refreshToken
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
}