import { startField } from '../field/renderer.js'

import {
  createBridgeHeader,
  createBridgeBody,
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

  const bridgeHeader =
    document.getElementById(
      'bridgeHeader'
    )

  bridgeHeader.innerText =
    createBridgeHeader(snapshot)

  const bridgeBody =
    document.getElementById(
      'bridgeBody'
    )

  bridgeBody.innerText =
    createBridgeBody(snapshot)

  const copyBtn =
    document.getElementById(
      'copyBtn'
    )

  copyBtn.onclick =
    async ()=>{

      const payload =
        createBridgePayload(
          snapshot
        )

      await navigator.clipboard
        .writeText(

          JSON.stringify(
            payload,
            null,
            2
          )
        )

      copyBtn.innerText =
        'コピーしました'

      setTimeout(()=>{

        copyBtn.innerText =
          'snapshot をコピー'

      }, 1600)
    }
}