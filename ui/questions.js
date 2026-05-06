import { state } from '../core/state.js'

export function renderQuestions(){

  const container =
    document.getElementById(
      'questionContainer'
    )

  container.innerHTML = ''

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
                ></button>

              `)
              .join('')}

          </div>

          <div class="scale-center">
            どちらでもない
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