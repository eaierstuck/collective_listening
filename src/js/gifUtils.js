import gifs from './gifs'

function calculateGif(featuresResponse) {
  const danceability = featuresResponse['danceability']
  console.log("danceability: ", danceability)

  if (danceability) {
    const filteredGifs = gifs.filter(g => g.danceability === Math.floor(danceability * 10))
    return filteredGifs[Math.floor(Math.random() * filteredGifs.length)]
  }
}

export default calculateGif