import { state } from './core/state.js'

import { switchView } from './ui/views.js'

import {
  renderQuestions,
  validateCurrentPage,
  resetQuestions
} from './ui/questions.js'

import { createSnapshot } from './core/snapshot.js'

import { interpret } from './core/interpreter.js'

import { interpretState } from './core/interpretation.js'

import { renderResult } from './ui/result.js'

const startBtn =
  document.getElementById('startBtn')

const nextBtn =
  document.getElementById('nextBtn')

const restartBtn =
  document.getElementById('restartBtn')

init()

async function init(){

  const response =
    await fetch('./data/questions.json')

  state.questions =
    await response.json()

  startBtn.addEventListener(
    'click',
    start
  )

  nextBtn.addEventListener(
    'click',
    next
  )

  restartBtn.addEventListener(
    'click',
    restart
  )
}

function start(){

  switchView('questionView')

  renderQuestions()

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

async function next(){

  if(
    !validateCurrentPage()
  ){
    return
  }

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

  if(
    state.currentPage
    >= totalPages
  ){

    const snapshot =
      createSnapshot(
        state.scores
      )

    await interpret(snapshot)

    snapshot.interpretation =
      interpretState(snapshot)

    window.currentSnapshot =
      snapshot

    switchView('resultView')

    renderResult(snapshot)

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

function restart(){

  resetQuestions()

  window.currentSnapshot =
    null

  const container =
    document.getElementById(
      'questionContainer'
    )

  container.classList.remove(
    'transition-out'
  )

  container.classList.remove(
    'transition-in'
  )

  switchView('topView')

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

function sleep(ms){

  return new Promise(resolve => {

    setTimeout(resolve, ms)

  })
}