export function breathingRadius(
  base,
  t,
  intensity = 1
){

  return (
    base
    + Math.sin(t * 0.8)
    * 12
    * intensity
  )
}