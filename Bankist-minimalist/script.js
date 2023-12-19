'use strict';
const btnScrollTo = document.querySelector('.btn--scroll-to')
const section1 = document.querySelector('#section--1')
const nav = document.querySelector('.nav')
const tabs = document.querySelectorAll('.operations__tab')
const tabsContainer = document.querySelector('.operations__tab-container')
const tabsContent = document.querySelectorAll('.operations__content')
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

///////////////////////////////////////
// Modal window



const openModal = function (e) {
  e.preventDefault()
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  console.log(e.target);

  //matching startgy
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href')
    console.log(id);
    if (id !== "#") return document.querySelector(id).scrollIntoView({ behavior: 'smooth' })
  }
})

const h1 = document.querySelector('h1');


h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'rgb(100,0,20)'


h1.closest('.header').style.background = 'var(--gradient-secondary)'

tabsContainer.addEventListener('click', function (e) {
  console.log(e.target);
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);
  //guard class
  if (!clicked) return;
  // active tab
  tabs.forEach(t => t.classList.remove('.operations__tab--active'))
  tabsContent.forEach(c => c.classList.remove('operations__content--active'))


  clicked.classList.add('.operations__tab--active')
  console.log(clicked.dataset.tab);
  // active content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')
})
///// scroling after learn more
document.querySelector('.btn--scroll-to').addEventListener('click', function (e) {
  e.preventDefault();
  section1.scrollIntoView({ behavior: 'smooth' })
})


const handelHover = function (e) {
  // console.log(this, e.target);
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    // console.log(link);
    const sivlings = link.closest('.nav').querySelectorAll('.nav__link');
    // console.log(sivlings);
    const logo = link.closest('.nav').querySelector('img')
    sivlings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    })
    logo.style.opacity = this;
  }
}


nav.addEventListener('mouseover', handelHover.bind(0.5))
nav.addEventListener('mouseout', handelHover.bind(1))



const navheight = nav.getBoundingClientRect(nav).height
// console.log(navheight);
const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky')
  else nav.classList.remove('sticky')
}



const headerObserver = new IntersectionObserver(stickyNav, { root: null, threshold: 0, rootMargin: `-${navheight}px` });
headerObserver.observe(header)


const allSection = document.querySelectorAll('.section')

const revealSection = function (entries, observer) {

  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden')
  observer.unobserve(entry.target)
}


const sectionObserver = new IntersectionObserver(revealSection, { root: null, threshold: 0.1 })
allSection.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden')
})





const imgTargets = document.querySelectorAll('img[data-src]');

const loadimg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  // replace src with data src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img')
  })
  observer.unobserve(entry.target)
}

const imgOBERVER = new IntersectionObserver(loadimg, { root: null, threshold: 0, rootMargin: '-200px' })

imgTargets.forEach(img => imgOBERVER.observe(img))


const slider = function () {
  const slides = document.querySelectorAll('.slide')
  const btnLeft = document.querySelector('.slider__btn--left')
  const btnRight = document.querySelector('.slider__btn--right')
  const dotContainer = document.querySelector('.dots')


  let curruntSlide = 0;
  let maxSlide = slides.length




  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`)

    })
  }

  const gotoSlide = function (slide) {
    slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`))
  }
  const activateDots = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'))

    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active')
  }


  const nextSlide = function () {
    if (curruntSlide === maxSlide - 1) {
      curruntSlide = 0;
    }
    else {
      curruntSlide++;
    }

    gotoSlide(curruntSlide)
    activateDots(curruntSlide)
  }
  const preSlide = function () {
    if (curruntSlide === 0) {
      curruntSlide = maxSlide - 1;
    }
    else {
      curruntSlide--;
    }

    gotoSlide(curruntSlide)
    activateDots(curruntSlide)
  }

  const init = function () {
    createDots();
    gotoSlide(0);
    activateDots(0)
  }
  init()

  btnRight.addEventListener('click', nextSlide)

  btnLeft.addEventListener('click', preSlide)

  document.addEventListener('keydown', function (e) {
    e.preventDefault();
    console.log(e);
    if (e.key === 'ArrowLeft') preSlide();
    e.key === 'ArrowRight' && nextSlide();

  })
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      gotoSlide(slide)
      activateDots(slide)
    }
  })
};
slider();
