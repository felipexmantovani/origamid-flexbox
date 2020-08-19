const menuItems = document.querySelectorAll('.menu-nav a');
const btnGoTop = document.querySelector('.btn-go-top');

menuItems.forEach((item) => {
  item.addEventListener('click', linkClick);
});

btnGoTop.addEventListener('click', goTop);

window.addEventListener('scroll', (event) => {
  btnGoTop.style.opacity = 0;
  if (event.target.scrollingElement.scrollTop >= 65) {
    btnGoTop.style.opacity = 1;
  }
});

function getIdLink(element) {
  return element.getAttribute('href');
}

function getSectionPositionTop(id) {
  return document.querySelector(id).offsetTop;
}

function animation(sectionTop) {
  window.scroll({
    top: sectionTop + 3,
    behavior: 'smooth'
  });
}

function goTop() {
  animation(0);
}

function linkClick(event) {
  event.preventDefault();
  const element = event.target;
  const id = getIdLink(element);
  const sectionTop = getSectionPositionTop(id);
  animation(sectionTop);
}
