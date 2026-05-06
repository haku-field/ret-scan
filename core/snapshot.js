export function createSnapshot(scores){

  const values = Object.values(scores)

  const average =
    values.reduce((a,b)=>a+b,0)
    / values.length

  const variance = Math.sqrt(

    values
      .map(v => (v - average) ** 2)
      .reduce((a,b)=>a+b,0)

    / values.length
  )

  return {

    timestamp: Date.now(),

    scores,

    metrics: {
      average,
      variance
    },

    field: {},

    motion: {},

    resonance: {},

    patterns: [],

    bridge: {}

  }
}