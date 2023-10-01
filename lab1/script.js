let inputs = Array.from(document.querySelectorAll("input"));
const inputsContainer = document.querySelector(".inputs-box");

const countBtn = document.querySelector("#count-btn");
const addBtn = document.querySelector("#add-field-btn");
const removeBtn = document.querySelector("#remove-field-btn");

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

const count = () => {
  const sum = countSum();
  countAverage(sum);
  getMin();
  getMax();
};

const addField = () => {
  const input = document.createElement("input");
  input.type = "text";

  input.addEventListener("input", count);
  inputs.push(input);

  inputsContainer.appendChild(input);
};

const removeUnusedField = () => {
  inputs = inputs.filter((input) => {
    if (input.value !== "") return true;

    input.remove();
    return false;
  });
};

countBtn.addEventListener("click", count);
inputs.forEach((input) => input.addEventListener("input", count));

addBtn.addEventListener("click", addField);
removeBtn.addEventListener("click", removeUnusedField);
