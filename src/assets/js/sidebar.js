let list = document.querySelectorAll('.navegacion li');

  function activeLink() {
    list.forEach((item) => {
      item.classList.remove('hovered');
    });
    this.classList.add('hovered');
  }

  list.forEach((item) => item.addEventListener('mouseover', activeLink));

  
  let toggle = document.querySelector('.toggle');
  let navigation = document.querySelector('.navegacion');
  let main = document.querySelector('.principal');

  toggle.onclick = function () {
    navigation.classList.toggle('activado');
    main.classList.toggle('activado');
  };
  


