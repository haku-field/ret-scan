export function switchView(id){

  document
    .querySelectorAll('.view')
    .forEach(view => {

      view.classList
        .remove('active')
    })

  document
    .getElementById(id)
    .classList
    .add('active')

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}