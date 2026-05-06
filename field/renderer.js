import { createWaveValues } from './pulse.js'

import { breathingRadius } from './breathing.js'

import {
  resolveFieldColor,
  resolveCoreColor
} from './colors.js'

import { createMotion } from './motion.js'

let t = 0
let rotation = 0

export async function startField(
  canvas,
  snapshot
){

  const ctx =
    canvas.getContext('2d')

  const field =
    createField(snapshot)

  const presets =
    await loadWavePresets(
      snapshot.patterns
    )

  const motion =
    createMotion(field, presets)

  const values =
    createWaveValues(field)

  function frame(){

    const width =
      canvas.width

    const height =
      canvas.height

    const cx = width / 2
    const cy = height / 2

    ctx.fillStyle =
      'rgba(246,247,251,0.08)'

    ctx.fillRect(
      0,
      0,
      width,
      height
    )

    drawTail(
      ctx,
      cx,
      cy,
      values,
      field,
      motion,
      10
    )

    drawMainWave(
      ctx,
      cx,
      cy,
      values,
      field
    )

    drawCore(
      ctx,
      cx,
      cy,
      field
    )

    t += motion.speed

    rotation += motion.rotation

    requestAnimationFrame(frame)
  }

  frame()
}

function createField(snapshot){

  const scores =
    snapshot.scores

  return {

    resonance:
      normalize(
        scores['共鳴感受性']
      ),

    boundary:
      normalize(
        scores['境界保持性']
      ),

    delegation:
      normalize(
        scores['委譲許容度']
      ),

    continuity:
      normalize(
        scores['連続性志向']
      ),

    reflection:
      normalize(
        scores['内省深度']
      )
  }
}

function normalize(value){

  return (
    value + 14
  ) / 28
}

async function loadWavePresets(
  patterns
){

  const response =
    await fetch(
      './patterns/wave-presets.json'
    )

  const presets =
    await response.json()

  return patterns
    .map(pattern =>
      presets[pattern.wavePreset]
    )
    .filter(Boolean)
}

function drawMainWave(
  ctx,
  cx,
  cy,
  values,
  field
){

  ctx.beginPath()

  values.forEach((v, i)=>{

    const angle =
      (i / values.length)
      * Math.PI
      * 2
      + rotation

    const wave =
      Math.sin(i * 0.45 + t)
      * (
        8
        + field.resonance * 24
      )

    const base =
      breathingRadius(
        120
        + field.continuity * 50,
        t,
        0.4
        + field.reflection
      )

    const radius =
      base
      + v * 60
      + wave

    const x =
      cx
      + Math.cos(angle)
      * radius

    const y =
      cy
      + Math.sin(angle)
      * radius

    if(i === 0){
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })

  ctx.closePath()

  ctx.strokeStyle =
    resolveFieldColor(field)

  ctx.lineWidth = 2

  ctx.stroke()
}

function drawTail(
  ctx,
  cx,
  cy,
  values,
  field,
  motion,
  layers
){

  for(
    let layer = 0;
    layer < layers;
    layer++
  ){

    ctx.beginPath()

    values.forEach((v, i)=>{

      const angle =
        (i / values.length)
        * Math.PI
        * 2
        + rotation
        - layer * 0.01

      const wave =
        Math.sin(
          i * 0.45
          + t
          - layer * 0.08
        )
        * (
          8
          + field.resonance * 20
        )

      const base =
        breathingRadius(
          120
          + field.continuity * 50,
          t,
          0.4
          + field.reflection
        )

      const radius =
        base
        + v * 60
        + wave

      const x =
        cx
        + Math.cos(angle)
        * radius

      const y =
        cy
        + Math.sin(angle)
        * radius

      if(i === 0){
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.closePath()

    ctx.strokeStyle =
      `rgba(
        140,
        220,
        255,
        ${0.02 * (layers - layer)}
      )`

    ctx.lineWidth = 1

    ctx.stroke()
  }
}

function drawCore(
  ctx,
  cx,
  cy,
  field
){

  ctx.beginPath()

  ctx.arc(
    cx,
    cy,
    10
    + field.reflection * 12,
    0,
    Math.PI * 2
  )

  ctx.fillStyle =
    resolveCoreColor(field)

  ctx.fill()
}