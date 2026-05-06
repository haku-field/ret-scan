export function resolveFieldColor(
  field
){

  const resonance =
    field.resonance

  const reflection =
    field.reflection

  const boundary =
    field.boundary

  const delegation =
    field.delegation

  const t =
    performance.now()
    * 0.0002

  let red =
    120
    + resonance * 140

  let green =
    150
    + boundary * 40

  let blue =
    170
    + reflection * 120

  red +=
    Math.sin(t)
    * delegation
    * 25

  blue +=
    Math.cos(t * 0.7)
    * reflection
    * 30

  return `rgb(
    ${Math.floor(red)},
    ${Math.floor(green)},
    ${Math.floor(blue)}
  )`
}

export function resolveCoreColor(
  field
){

  return `rgba(
    255,
    255,
    255,
    ${0.3 + field.reflection * 0.7}
  )`
}