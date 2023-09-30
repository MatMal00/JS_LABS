const inputs = Array.from(document.querySelectorAll("input"));
const countBtn = document.querySelector("#count-btn");
const sumResult = document.querySelector("#sum");
const averageResult = document.querySelector("#average");
const minResult = document.querySelector("#min");
const maxResult = document.querySelector("#max");

const countSum = () => {
  const sum = inputs.reduce((acc, curr) => acc + +curr.value, 0);
  sumResult.textContent = sum;

  return sum;
};

const countAverage = (sum) => {
  const average = sum / +inputs.length;
  averageResult.textContent = average;
};

const getMin = () => {
  const min = Math.min(...inputs.map((input) => +input.value));
  minResult.textContent = min;
};

const getMax = () => {
  const max = Math.max(...inputs.map((input) => +input.value));
  maxResult.textContent = max;
};

countBtn.addEventListener("click", () => {
  const sum = countSum();
  countAverage(sum);
  getMin();
  getMax();
});
