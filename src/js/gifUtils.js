import gifs from './gifs'

function calculateGif(featuresResponse, chorus) {
  const chorusTempo = chorus["tempo"]
  console.log('chorusTempo: ', chorusTempo)

  const filteredByTempo = gifs.filter(g => {
    return g.tempo != null && Math.abs(g.tempo - chorusTempo) < 10
  })

  if (filteredByTempo.length > 0) {
    // const sortedByClosestTempo = sortBy(filteredByTempo, (g) => Math.abs(g.tempo - chorusTempo))
    // console.log('sorted: ', sortedByClosestTempo)
    return randomEntryFrom(filteredByTempo)
  }

  const danceability = featuresResponse['danceability']
  console.log("danceability: ", danceability)
  const filteredByDanceability = gifs.filter(g => g.danceability === Math.floor(danceability * 10))
  return randomEntryFrom(filteredByDanceability)
}

function randomEntryFrom(array) {
  return array[Math.floor(Math.random() * array.length)]
}

export default calculateGif