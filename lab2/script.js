const slidesContainer = document.querySelector(".slides");
const slides = document.querySelectorAll("img");
const prevBtn = document.querySelector("#btn-prev");
const nextBtn = document.querySelector("#btn-next");

const slideWidth = slidesContainer.offsetWidth;
const transition = getComputedStyle(slidesContainer).transition;
let currentIndex = 1;

const firstSlideClone = slides[0].cloneNode(true);
const lastSlideClone = slides[slides.length - 1].cloneNode(true);

firstSlideClone.id = "first-slide-clone";
lastSlideClone.id = "last-slide-clone";

slidesContainer.appendChild(firstSlideClone);
slidesContainer.prepend(lastSlideClone);

const moveSlide = (infiniteAction) => {
  if (getComputedStyle(slidesContainer).transition.includes("none") && !infiniteAction) slidesContainer.style.transition = transition;
  slidesContainer.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
};

const lockButtons = () => {
  nextBtn.setAttribute("disabled", true);
  prevBtn.setAttribute("disabled", true);
};

const unLockButtons = () => {
  nextBtn.removeAttribute("disabled");
  prevBtn.removeAttribute("disabled");
};

const onButtonClick = (direction) => {
  direction ? currentIndex++ : currentIndex--;
  moveSlide();
  lockButtons();
};

nextBtn.addEventListener("click", () => onButtonClick(true));

prevBtn.addEventListener("click", () => onButtonClick(false));

slidesContainer.addEventListener("transitionend", () => {
  unLockButtons();
  if (currentIndex === 0 || currentIndex === slides.length) {
    slidesContainer.style.transition = "none";
    currentIndex = currentIndex === 0 ? slides.length : 0;
    moveSlide(true);
  }
});

// document.addEventListener("DOMContentLoaded", () => {
//   setInterval(() => {
//     currentIndex++;
//     moveSlide();
//   }, 900);
// });

moveSlide();
