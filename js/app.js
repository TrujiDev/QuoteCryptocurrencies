const currencySelect = document.querySelector('#currency');
const cryptocurrencySelect = document.querySelector('#cryptocurrency');
const form = document.querySelector('#form');
const resultDiv = document.querySelector('#result');

const search = {
	currency: '',
	cryptocurrency: '',
};

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

function consultCryptocurrency() {
	const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

	fetch(url)
		.then(response => response.json())
		.then(data => getCryptocurrency(data.Data))
		.then(cryptocurrencies => selectCryptocurrency(cryptocurrencies));
}

function selectCryptocurrency(cryptocurrencies) {
	cryptocurrencies.forEach(cryptocurrency => {
		const { FullName, Name } = cryptocurrency.CoinInfo;

		const option = document.createElement('option');
		option.value = Name;
		option.textContent = FullName;
		cryptocurrencySelect.appendChild(option);
	});
}

function readValue(evt) {
	search[evt.target.name] = evt.target.value;
}

function submitForm(evt) {
	evt.preventDefault();

	const { currency, cryptocurrency } = search;

	if (currency === '' || cryptocurrency === '') {
		showAlert('Both fields are required');
		return;
	}

	consultAPI();
}

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

function consultAPI() {
	const { currency, cryptocurrency } = search;

	const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrency}&tsyms=${currency}`;

	fetch(url)
		.then(response => response.json())
		.then(data => {
			showResult(data.DISPLAY[cryptocurrency][currency]);
		});
}

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

function clearHTML() {
    while(result.firstChild) {
        result.removeChild(result.firstChild);
    }
}