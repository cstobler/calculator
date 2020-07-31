let currentOperator = "";
let previousNumber = undefined;
let numberButtons = document.querySelectorAll("button[data-number]");
let operatorButtons = document.querySelectorAll("button[data-operator]");
let clearButton = document.querySelector("button[data-clear]");
let deleteButton = document.querySelector("button[data-del]");
let percentButton = document.querySelector("button[data-per]");
let decimalButton = document.querySelector("button[data-decimal]");
let posNegButton = document.querySelector("button[data-pos-neg]");
let equalsButton = document.querySelector("button[data-equals]");
let displayNumber = document.querySelector(".displaynumber");

let currentNumber = () => +displayNumber.innerHTML;

let currentNumberLength = () => displayNumber.innerHTML.split("").length;

let roundResult = () => displayNumber.innerHTML.split("").length > 13 ? displayNumber.innerHTML.slice(0, 13) : displayNumber.innerHTML; //== This ensures that the result fits in the display box

const performOperation = {
	"+": (x, y) => x + y,
	"-": (x, y) => x - y,
	"*": (x, y) => x * y,
	"/": (x, y) => x / y,
}

window.addEventListener("resize", () => {
	let vh = window.innerHeight * 0.01;
	document.body.style.setProperty("--vh", `${vh}px`);
})

numberButtons.forEach(button => button.addEventListener("click", () => {
	if (currentNumberLength() > 13) return; //== Limit number of digits in display

	if ((currentOperator !== "") && (previousNumber === undefined)) {
		previousNumber = currentNumber();
		displayNumber.innerHTML = "";
	}

	operatorButtons.forEach(button => button.classList.remove("operatorselected")); //== Deselect any highlighted operator buttons
	displayNumber.innerHTML += button.innerHTML;
}))

operatorButtons.forEach(button => button.addEventListener("click", () => {
	if (displayNumber.innerHTML == "") return;
	if (previousNumber !== undefined) {
		displayNumber.innerHTML = performOperation[currentOperator](previousNumber, currentNumber());
		displayNumber.innerHTML = roundResult();
		previousNumber = undefined;
	}

	operatorButtons.forEach(button => button.classList.remove("operatorselected"));
	button.classList.add("operatorselected"); //== Highlight selected operator
	currentOperator = button.getAttribute("data-operator");
}))

clearButton.addEventListener("click", () => {
	currentOperator = "";
	previousNumber = undefined;
	displayNumber.innerHTML = "";
	operatorButtons.forEach(button => button.classList.remove("operatorselected"));
})

deleteButton.addEventListener("click", () => displayNumber.innerHTML = displayNumber.innerHTML.slice(0, -1));

percentButton.addEventListener("click", () => {
	if (currentNumber() == "") return;

	let result = +displayNumber.innerHTML / 100;
	if (result.toString().split("").length > 13) result = +result.toString().slice(0, 13);

	displayNumber.innerHTML = result;
})

decimalButton.addEventListener("click", () => {
	if (displayNumber.innerHTML.includes(".")) return;
	if (currentNumber() == "") displayNumber.innerHTML = "0";
	// the == as opposed to === is interesting here, because the parser thinks that 0s are equivalent to "". Therefore, if there are multiple 0s, they are replaced with "0."

	displayNumber.innerHTML += ".";
})

posNegButton.addEventListener("click", () => displayNumber.innerHTML = +displayNumber.innerHTML * -1);

equalsButton.addEventListener("click", () => {
	if (previousNumber !== undefined) {
		displayNumber.innerHTML = performOperation[currentOperator](previousNumber, currentNumber());
		displayNumber.innerHTML = roundResult();
	}

	operatorButtons.forEach(button => button.classList.remove("operatorselected"));
	previousNumber = undefined;
	currentOperator = "";
})

document.addEventListener("keydown", (e) => {
	if (e.key >= 0 || e.key <= 9) {
		e.preventDefault();
		document.querySelector(`button[data-number="${e.key}"]`).click();
	} else if (e.key == "+" || e.key == "-" || e.key == "*" || e.key == "/") {
		e.preventDefault();
		document.querySelector(`button[data-operator="${e.key}"]`).click();
	} else if (e.key == "Clear") {
		e.preventDefault();
		clearButton.click();
	} else if (e.key == "Backspace") {
		e.preventDefault();
		deleteButton.click();
	} else if (e.key == "%") {
		e.preventDefault();
		percentButton.click();
	} else if (e.key == ".") {
		e.preventDefault();
		decimalButton.click();
	} else if (e.key == "Enter" || e.key == "=") {
		e.preventDefault();
		equalsButton.click();
	}
})