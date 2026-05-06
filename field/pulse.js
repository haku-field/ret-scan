export function createWaveValues(field){

  const values = []

  const {
    resonance,
    boundary,
    delegation,
    continuity,
    reflection
  } = field

  for(let i = 0; i < 96; i++){

    const phase = i / 96 * Math.PI * 2

    const resonanceWave =
      Math.sin(phase * 3)
      * resonance
      * 0.45

    const boundaryNoise =
      Math.cos(phase * 7)
      * boundary
      * 0.25

    const reflectionWave =
      Math.sin(phase * 1.5)
      * reflection
      * 0.2

    const delegationDrift =
      Math.cos(phase * 5)
      * delegation
      * 0.18

    const continuitySmooth =
      Math.sin(phase)
      * continuity
      * 0.15

    values.push(
      0.5
      + resonanceWave
      + boundaryNoise
      + reflectionWave
      + delegationDrift
      + continuitySmooth
    )
  }

  return smooth(values)
}

function smooth(values){

  return values.map((_, i)=>{

    const prev =
      values[i - 1] ?? values[i]

    const current =
      values[i]

    const next =
      values[i + 1] ?? values[i]

    return (
      prev
      + current
      + next
    ) / 3
  })
}