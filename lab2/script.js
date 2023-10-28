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

nextBtn.addEventListener("click", () => {
  currentIndex++;
  moveSlide();
});

prevBtn.addEventListener("click", () => {
  currentIndex--;
  moveSlide();
});

slidesContainer.addEventListener("transitionend", () => {
  if (currentIndex === 0 || currentIndex === slides.length) {
    slidesContainer.style.transition = "none";
    currentIndex = currentIndex === 0 ? slides.length : 0;
    moveSlide(true);
  }
});

moveSlide();
