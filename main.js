import { state } from './core/state.js'

import { switchView } from './ui/views.js'

import { renderQuestions } from './ui/questions.js'

import { createSnapshot } from './core/snapshot.js'

import { interpret } from './core/interpreter.js'

import { interpretState } from './core/interpretation.js'

import { renderResult } from './ui/result.js'

const startBtn =
  document.getElementById('startBtn')

const nextBtn =
  document.getElementById('nextBtn')

const copyBtn =
  document.getElementById('copyBtn')

startBtn.addEventListener(
  'click',
  start
)

nextBtn.addEventListener(
  'click',
  next
)

copyBtn.addEventListener(
  'click',
  copySnapshot
)

init()

async function init(){

  const response =
    await fetch('./data/questions.json')

  state.questions =
    await response.json()
}

function start(){

  switchView('questionView')

  renderQuestions()
}

async function next(){

  const container =
    document.getElementById(
      'questionContainer'
    )

  container.classList.remove(
    'transition-in'
  )

  container.classList.add(
    'transition-out'
  )

  await sleep(220)

  state.currentPage++

  const totalPages =
    Math.ceil(
      state.questions.length
      / state.pageSize
    )

  if(state.currentPage >= totalPages){

    const snapshot =
      createSnapshot(
        state.scores
      )

    await interpret(snapshot)

    snapshot.interpretation =
      interpretState(snapshot)

    switchView('resultView')

    renderResult(snapshot)

    window.currentSnapshot =
      snapshot

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

    return
  }

  renderQuestions()

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })

  container.classList.remove(
    'transition-out'
  )

  container.classList.add(
    'transition-in'
  )
}

async function copySnapshot(){

  if(!window.currentSnapshot){
    return
  }

  await navigator.clipboard.writeText(

    JSON.stringify(
      window.currentSnapshot,
      null,
      2
    )
  )
}

function sleep(ms){

  return new Promise(resolve => {

    setTimeout(resolve, ms)
  })
}