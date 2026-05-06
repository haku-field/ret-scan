import { state } from '../core/state.js'

export function renderQuestions(){

  const container =
    document.getElementById(
      'questionContainer'
    )

  container.innerHTML = ''

  const nextBtn =
    document.getElementById(
      'nextBtn'
    )

  nextBtn.disabled = false

  const start =
    state.currentPage
    * state.pageSize

  const end =
    Math.min(
      start + state.pageSize,
      state.questions.length
    )

  for(
    let i = start;
    i < end;
    i++
  ){

    const question =
      state.questions[i]

    const card =
      document.createElement('div')

    card.className =
      'question-card'

    card.innerHTML = `

      <div class="question-text">
        ${question.text}
      </div>

      <div class="scale-wrap">

        <div class="scale-label">
          そう思う
        </div>

        <div class="scale-block">

          <div class="scale">

            ${[2,1,0,-1,-2]
              .map(value => `

                <button
                  data-value="${value}"
                  type="button"
                ></button>

              `)
              .join('')}

          </div>

        </div>

        <div class="scale-label">
          そう思わない
        </div>

      </div>
    `

    container.appendChild(card)

    const buttons =
      card.querySelectorAll(
        'button'
      )

    const savedAnswer =
      state.answers[i]

    if(savedAnswer !== undefined){

      const activeButton =
        card.querySelector(
          `[data-value="${savedAnswer}"]`
        )

      if(activeButton){

        activeButton.classList.add(
          'active'
        )
      }
    }

    buttons.forEach(button => {

      button.addEventListener(
        'click',
        ()=>{

          buttons.forEach(b => {

            b.classList.remove(
              'active'
            )
          })

          button.classList.add(
            'active'
          )

          applyAnswer(
            i,
            question,
            Number(
              button.dataset.value
            )
          )

          updateNextButton()
        }
      )
    })
  }

  updateProgress()

  updateNextButton()
}

function applyAnswer(
  index,
  question,
  value
){

  const previous =
    state.answers[index]

  if(previous !== undefined){

    state.scores[
      question.axis
    ] -= previous
  }

  state.answers[index] =
    value

  state.scores[
    question.axis
  ] += value

  updateProgress()
}

export function validateCurrentPage(){

  const start =
    state.currentPage
    * state.pageSize

  const end =
    Math.min(
      start + state.pageSize,
      state.questions.length
    )

  for(
    let i = start;
    i < end;
    i++
  ){

    if(
      state.answers[i]
      === undefined
    ){

      return false
    }
  }

  return true
}

export function resetQuestions(){

  state.answers = []

  state.currentPage = 0

  state.scores = {
    "共鳴感受性": 0,
    "境界保持性": 0,
    "委譲許容度": 0,
    "連続性志向": 0,
    "内省深度": 0
  }

  updateProgress()
}

function updateProgress(){

  const done =
    state.answers.filter(
      value =>
        value !== undefined
    ).length

  const total =
    state.questions.length

  document
    .getElementById(
      'progressText'
    )
    .innerText =
      `${done} / ${total}`

  document
    .getElementById(
      'progressFill'
    )
    .style.width =
      `${done / total * 100}%`
}

function updateNextButton(){

  const nextBtn =
    document.getElementById(
      'nextBtn'
    )

  nextBtn.disabled = false

  const totalPages =
    Math.ceil(
      state.questions.length
      / state.pageSize
    )

  const isLastPage =
    state.currentPage
    === totalPages - 1

  nextBtn.innerText =
    isLastPage
      ? '結果を見る'
      : '次へ'
}