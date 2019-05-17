export default class Gif {
  constructor({description = "", url = "", danceability = 0, tempo = 0}) {
    this.description = description
    this.url = url
    this.danceability = danceability
    this.tempo = tempo
  }
}