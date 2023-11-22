const currencySelect = document.querySelector('#currency');
const cryptocurrencySelect = document.querySelector('#cryptocurrency');
const form = document.querySelector('#form');

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
