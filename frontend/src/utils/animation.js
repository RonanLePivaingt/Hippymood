const minMood = 75,
      maxMood = 200,
      minText = 122,
      maxText = 372


export const createLoaders = (n, idOffset) => {
  return  Array.from(Array(n).keys()).map((val, index) => ({
    id: idOffset ? index + idOffset : index,
    songWidth: `width: ${Math.max(372 * Math.random(), 122)}px;`,
    albumWidth: `width: ${Math.max(372 * Math.random(), 122)}px;`,
    artistWidth: `width: ${Math.max(372 * Math.random(), 122)}px;`,
    moodWidth: `width: ${moodWidth()}px;`,
  }))
}

function moodWidth () {
  return minMood + ((maxMood - minMood) * Math.random())
}

function textWidth () {
  return minText + ((maxText - minText) * Math.random())
}
