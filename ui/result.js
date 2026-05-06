import { startField } from '../field/renderer.js'

import {
  createBridgeText,
  createBridgePayload
} from '../core/bridge.js'

export function renderResult(
  snapshot
){

  renderPatterns(snapshot)

  renderBridge(snapshot)

  const canvas =
    document.getElementById(
      'fieldCanvas'
    )

  startField(
    canvas,
    snapshot
  )
}

function renderPatterns(snapshot){

  const container =
    document.getElementById(
      'activePatterns'
    )

  container.innerHTML = ''

  snapshot.patterns
    .slice(0, 3)
    .forEach(pattern => {

      const div =
        document.createElement('div')

      div.className =
        'pattern-item'

      div.innerText =
        pattern.title

      container.appendChild(div)
    })
}

function renderBridge(snapshot){

  const bridgeText =
    document.getElementById(
      'bridgeText'
    )

  bridgeText.innerText =
    createBridgeText(snapshot)

  const copyBtn =
    document.getElementById(
      'copyBtn'
    )

  copyBtn.onclick =
    async ()=>{

      await navigator.clipboard
        .writeText(

          JSON.stringify(
            createBridgePayload(
              snapshot
            ),
            null,
            2
          )
        )
    }
}