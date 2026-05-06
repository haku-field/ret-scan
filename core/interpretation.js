export function interpretState(
  snapshot
){

  const scores =
    snapshot.scores

  return {

    resonance:
      resolveResonance(scores),

    boundary:
      resolveBoundary(scores),

    delegation:
      resolveDelegation(scores),

    continuity:
      resolveContinuity(scores),

    reflection:
      resolveReflection(scores)
  }
}

function resolveResonance(scores){

  const value =
    scores['共鳴感受性']

  if(value >= 6){

    return {
      state: 'high_resonance',

      label: '高共鳴',

      description:
        '外部との関係余韻が内部へ残留しやすい状態'
    }
  }

  if(value <= -4){

    return {
      state: 'low_resonance',

      label: '独立保持',

      description:
        '外部影響より内部独立性を優先しやすい状態'
    }
  }

  return {

    state: 'moderate_resonance',

    label: '中間共鳴',

    description:
      '外部との関係と内部保持の間で揺らぎを保っている状態'
  }
}

function resolveBoundary(scores){

  const value =
    scores['境界保持性']

  if(value >= 5){

    return {
      state: 'boundary_open',

      label: '境界開放',

      description:
        '周囲の空気や関係の影響を受けやすい状態'
    }
  }

  if(value <= -4){

    return {
      state: 'boundary_stable',

      label: '境界安定',

      description:
        '自己輪郭を維持しやすい状態'
    }
  }

  return {

    state: 'moderate_boundary',

    label: '境界揺動',

    description:
      '外部影響と自己保持の間を可変的に移行している状態'
  }
}

function resolveDelegation(scores){

  const value =
    scores['委譲許容度']

  if(value >= 5){

    return {
      state: 'delegation_open',

      label: '流動受容',

      description:
        '他者視点や外部流れを自然に受け入れやすい状態'
    }
  }

  if(value <= -4){

    return {
      state: 'self_directed',

      label: '自己主導',

      description:
        '内部基準による判断を優先しやすい状態'
    }
  }

  return {

    state: 'adaptive_delegation',

    label: '適応委譲',

    description:
      '内部判断と外部受容を状況に応じて切り替えている状態'
  }
}

function resolveContinuity(scores){

  const value =
    scores['連続性志向']

  if(value >= 6){

    return {
      state: 'continuity_strong',

      label: '継続志向',

      description:
        '関係や積み重なりを重要視しやすい状態'
    }
  }

  if(value <= -4){

    return {
      state: 'moment_oriented',

      label: '瞬間志向',

      description:
        '継続より現在感覚を優先しやすい状態'
    }
  }

  return {

    state: 'fluid_continuity',

    label: '流動連続',

    description:
      '継続性と瞬間性の比重が状況に応じて変化している状態'
  }
}

function resolveReflection(scores){

  const value =
    scores['内省深度']

  if(value >= 6){

    return {
      state: 'deep_reflection',

      label: '深層内省',

      description:
        '内部観測や再帰思考が自然発生しやすい状態'
    }
  }

  if(value <= -4){

    return {
      state: 'external_focus',

      label: '外部集中',

      description:
        '内部観測より外部対象へ意識が向きやすい状態'
    }
  }

  return {

    state: 'moderate_reflection',

    label: '中間内省',

    description:
      '内部観測と外部集中の間で視点が循環している状態'
  }
}