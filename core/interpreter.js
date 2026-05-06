export async function interpret(
  snapshot
){

  const patterns =
    await loadPatterns()

  const matched =
    patterns.filter(pattern => {

      return matchConditions(
        pattern.conditions,
        snapshot.scores
      )
    })

  matched.sort((a,b)=>
    b.priority - a.priority
  )

  snapshot.patterns =
    matched

  return snapshot
}

async function loadPatterns(){

  const response =
    await fetch(
      './patterns/patterns.json'
    )

  return await response.json()
}

function matchConditions(
  conditions,
  scores
){

  return Object
    .entries(conditions)

    .every(([axis, min])=>{

      return (
        scores[axis]
        >= min
      )
    })
}