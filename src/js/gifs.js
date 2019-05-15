import Gif from './gif'

const gifs = [
  new Gif('https://media.giphy.com/media/SGkufeMafyuBhIw796/giphy.gif', 1),
  new Gif('https://media.giphy.com/media/l3vR3FaH4adpUG9eE/giphy.gif',2),
  new Gif('https://media.giphy.com/media/F9hQLAVhWnL56/giphy.gif',3),
  new Gif('https://media.giphy.com/media/w8f9g2x44aGI/giphy.gif',4),
  new Gif('https://i.giphy.com/media/vVzH2XY3Y0Ar6/giphy.webp',5),
  new Gif('https://media.giphy.com/media/l46CdUTy21h8wwrAs/giphy.gif',6),
  new Gif('https://media.giphy.com/media/TLqkzhMIZxAQg/giphy.gif',7),
  new Gif('https://giphy.com/gifs/dancing-fresh-prince-of-bel-air-carlton-pa37AAGzKXoek',8),
  new Gif('https://media.giphy.com/media/8j3CTd8YJtAv6/giphy.gif',9),
]

function calculateGif(response) {
  const danceability = response['danceability']
  if (danceability) {
    const filteredGifs = gifs.filter(g => g.danceability === Math.floor(danceability * 10))
    return filteredGifs[Math.floor(Math.random() * filteredGifs.length)]
  }
}

export default calculateGif