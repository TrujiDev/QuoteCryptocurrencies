const cryptocurrencySelect = document.querySelector('#cryptocurrency');

const getCryptocurrency = cryptocurrencies =>
	new Promise(resolve => {
		resolve(cryptocurrencies);
	});

document.addEventListener('DOMContentLoaded', () => {
	consultCryptocurrency();
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
