const currencySelect = document.querySelector('#currency');
const cryptocurrencySelect = document.querySelector('#cryptocurrency');
const form = document.querySelector('#form');
const resultDiv = document.querySelector('#result');

const search = {
	currency: '',
	cryptocurrency: '',
};

/**
 * Retrieves a list of cryptocurrencies.
 * @param {Array} cryptocurrencies - The list of cryptocurrencies.
 * @returns {Promise} A promise that resolves with the list of cryptocurrencies.
 */
const getCryptocurrency = cryptocurrencies =>
	new Promise(resolve => {
		resolve(cryptocurrencies);
	});

document.addEventListener('DOMContentLoaded', () => {
	consultCryptocurrency();

	form.addEventListener('submit', submitForm);

	currencySelect.addEventListener('change', readValue);
	cryptocurrencySelect.addEventListener('change', readValue);
});

/**
 * Fetches the top 10 cryptocurrencies by market capitalization and selects them.
 * @returns {Promise<void>} A promise that resolves when the cryptocurrencies are selected.
 */
async function consultCryptocurrency() {
	const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

	// fetch(url)
	// 	.then(response => response.json())
	// 	.then(data => getCryptocurrency(data.Data))
	// 	.then(cryptocurrencies => selectCryptocurrency(cryptocurrencies));

	try {
		const response = await fetch(url);
		const data = await response.json();
		const cryptocurrencies = await getCryptocurrency(data.Data);
		selectCryptocurrency(cryptocurrencies);
	} catch (error) {
		console.error(error);
	}
}

/**
 * Populates a select element with cryptocurrency options.
 *
 * @param {Array} cryptocurrencies - An array of cryptocurrency objects.
 */
function selectCryptocurrency(cryptocurrencies) {
	cryptocurrencies.forEach(cryptocurrency => {
		const { FullName, Name } = cryptocurrency.CoinInfo;

		const option = document.createElement('option');
		option.value = Name;
		option.textContent = FullName;
		cryptocurrencySelect.appendChild(option);
	});
}

/**
 * Updates the value of a property in the search object based on the event target's name and value.
 * @param {Event} evt - The event object triggered by the input element.
 */
function readValue(evt) {
	search[evt.target.name] = evt.target.value;
}

/**
 * Submits the form and performs necessary validations before calling the API.
 * @param {Event} evt - The event object representing the form submission.
 */
function submitForm(evt) {
	evt.preventDefault();

	const { currency, cryptocurrency } = search;

	if (currency === '' || cryptocurrency === '') {
		showAlert('Both fields are required');
		return;
	}

	consultAPI();
}

/**
 * Displays an error message as a div element on the page for a specified duration.
 * @param {string} msg - The error message to be displayed.
 */
function showAlert(msg) {
	const error = document.querySelector('.error');

	if (!error) {
		const divMsg = document.createElement('div');
		divMsg.classList.add('error');
		divMsg.textContent = msg;

		form.appendChild(divMsg);

		setTimeout(() => {
			divMsg.remove();
		}, 3000);
	}
}

/**
 * Fetches data from the Cryptocompare API and displays the result.
 * @async
 * @function consultAPI
 * @returns {Promise<void>} A promise that resolves when the API data is fetched and displayed.
 */
async function consultAPI() {
	const { currency, cryptocurrency } = search;

	const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrency}&tsyms=${currency}`;

	spinner();

	// fetch(url)
	// 	.then(response => response.json())
	// 	.then(data => {
	// 		showResult(data.DISPLAY[cryptocurrency][currency]);
	// 	});

	try {
		const response = await fetch(url);
		const data = await response.json();
		showResult(data.DISPLAY[cryptocurrency][currency]);
	} catch (error) {
		console.error(error);
	}
}

/**
 * Displays the result of a cryptocurrency query.
 *
 * @param {Object} result - The result object containing cryptocurrency data.
 * @param {number} result.PRICE - The price of the cryptocurrency.
 * @param {number} result.HIGHDAY - The highest price of the day.
 * @param {number} result.LOWDAY - The lowest price of the day.
 * @param {number} result.CHANGEPCT24HOUR - The percentage change in price over the last 24 hours.
 * @param {string} result.LASTUPDATE - The timestamp of the last update.
 */
function showResult(result) {
	clearHTML();

	const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = result;

	const price = document.createElement('P');
	price.classList.add('price');
	price.innerHTML = `The price is: <span>${PRICE}</span>`;

	const highPrice = document.createElement('P');
	highPrice.innerHTML = `<p>Highest price of the day: <span>${HIGHDAY}</span></p>`;

	const lowPrice = document.createElement('P');
	lowPrice.innerHTML = `<p>Lowest price of the day: <span>${LOWDAY}</span></p>`;

	const lastHours = document.createElement('P');
	lastHours.innerHTML = `<p>Last 24 hours: <span>${CHANGEPCT24HOUR}%</span></p>`;

	const lastUpdate = document.createElement('P');
	lastUpdate.innerHTML = `<p>Last update: <span>${LASTUPDATE}</span></p>`;

	resultDiv.appendChild(price);
	resultDiv.appendChild(highPrice);
	resultDiv.appendChild(lowPrice);
	resultDiv.appendChild(lastHours);
	resultDiv.appendChild(lastUpdate);
}

/**
 * Clears the HTML content of the resultDiv element.
 */
function clearHTML() {
	while (resultDiv.firstChild) {
		resultDiv.removeChild(resultDiv.firstChild);
	}
}

/**
 * Displays a spinner on the page.
 */
function spinner() {
	clearHTML();

	const spinner = document.createElement('DIV');
	spinner.classList.add('spinner');

	spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

	resultDiv.appendChild(spinner);
}
