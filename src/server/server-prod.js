import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import webpack from 'webpack'
import config from '../../webpack.prod.config.js'
import {addRoutes} from './routes'

const app = express()
const compiler = webpack(config)

app.use(express.static(path.join(__dirname)))
   .use(cors())
   .use(cookieParser())

addRoutes(app, compiler)

console.log('Listening on 8888')
app.listen(8888)
