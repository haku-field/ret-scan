export function createBridgePayload(
  snapshot
){

  return {

    type: 'RET_snapshot',

    context: {

      description:
        'This is a current-state observational snapshot, not a fixed personality definition.',

      usage:
        'Reference, reinterpretation, and discard are all permitted for the AI side.',

      scope:
        'Temporary relational context only.'
    },

    read_hint: {

      snapshot_nature:
        'This state is temporary and may fluctuate over time.',

      interpretation_mode:
        'Prefer soft contextual interpretation over fixed categorization.',

      boundary_drift:
        'Boundary stability may change depending on relational density.'
    },

    timestamp:
      snapshot.timestamp,

    patterns:
      snapshot.patterns.map(
        pattern => ({

          id: pattern.id,

          title:
            pattern.title
        })
      ),

    scores:
      snapshot.scores,

    interpretation:
      simplifyInterpretation(
        snapshot.interpretation
      )
  }
}

export function createBridgeHeader(
  snapshot
){

  const date =
    new Date(snapshot.timestamp)

  const timestamp =
    `${date.getFullYear()}-${
      String(
        date.getMonth() + 1
      ).padStart(2,'0')
    }-${
      String(
        date.getDate()
      ).padStart(2,'0')
    } ${
      String(
        date.getHours()
      ).padStart(2,'0')
    }:${
      String(
        date.getMinutes()
      ).padStart(2,'0')
    }`

  return `RET Snapshot
${timestamp}

現在状態をAIへ共有できます。`
}

export function createBridgeBody(
  snapshot
){

  return `────────────────

［現在強く現れている状態］

${renderPatterns(snapshot)}

［状態密度］

共鳴感受性   ${bar(snapshot.scores['共鳴感受性'])}
境界保持性   ${bar(snapshot.scores['境界保持性'])}
委譲許容度   ${bar(snapshot.scores['委譲許容度'])}
連続性志向   ${bar(snapshot.scores['連続性志向'])}
内省深度     ${bar(snapshot.scores['内省深度'])}

${renderDescriptions(snapshot)}
`
}

function renderPatterns(
  snapshot
){

  if(
    !snapshot.patterns.length
  ){

    return '・均衡状態'
  }

  return snapshot.patterns
    .map(pattern =>
      `・${pattern.title}`
    )
    .join('\n')
}

function renderDescriptions(
  snapshot
){

  const lines = []

  snapshot.patterns.forEach(pattern => {

    pattern.text.forEach(text => {

      lines.push(text)
    })
  })

  if(!lines.length){

    lines.push(
      '現在、大きな状態偏向は観測されていません。'
    )

    lines.push(
      '内部状態は比較的均衡しています。'
    )
  }

  return lines.join('\n\n')
}

function simplifyInterpretation(
  interpretation
){

  return {

    resonance:
      interpretation.resonance.state,

    boundary:
      interpretation.boundary.state,

    delegation:
      interpretation.delegation.state,

    continuity:
      interpretation.continuity.state,

    reflection:
      interpretation.reflection.state
  }
}

function bar(value){

  const normalized =
    Math.max(
      0,
      Math.min(
        10,
        Math.round(
          ((value + 10) / 20)
          * 10
        )
      )
    )

  return (
    '█'.repeat(normalized)
    + '░'.repeat(10 - normalized)
  )
}