export function fadeIn(element){

  element.animate(

    [
      {
        opacity: 0,
        transform:
          'translateY(12px)'
      },

      {
        opacity: 1,
        transform:
          'translateY(0px)'
      }
    ],

    {
      duration: 500,
      easing: 'ease'
    }
  )
}

export function breathe(element){

  element.animate(

    [
      {
        transform:
          'scale(1)'
      },

      {
        transform:
          'scale(1.01)'
      },

      {
        transform:
          'scale(1)'
      }
    ],

    {
      duration: 4200,
      iterations: Infinity,
      easing: 'ease-in-out'
    }
  )
}