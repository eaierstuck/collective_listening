import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import config from '../../webpack.dev.config.js'
import {addRoutes} from './routes'

const app = express()
const compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}))

app.use(cors())
   .use(cookieParser())

addRoutes(app, compiler)

const PORT = process.env.PORT || 8888
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})
