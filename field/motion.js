export function createMotion(field, presets){

  let speed = 0.03
  let rotation = 0.002
  let noise = 0.2
  let tail = 0.4

  presets.forEach(preset => {

    speed += preset.speed * 0.01

    rotation +=
      preset.rotation * 0.003

    noise +=
      preset.noise * 0.15

    tail +=
      preset.tail * 0.2
  })

  return {
    speed,
    rotation,
    noise,
    tail
  }
}