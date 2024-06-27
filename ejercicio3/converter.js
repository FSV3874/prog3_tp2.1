class Currency {
    constructor(code, name) {
        this.code = code;
        this.name = name;
    }
}

class CurrencyConverter {
    constructor(apiUrl) {
        this.apiUrl = apiUrl; // Inicializacion del atributo
        this.currencies = []; //Inicializacion del arreglo
    }

    async getCurrencies() {
        try {
            const response = await fetch(`${this.apiUrl}/currencies`);
            if(!response.ok){
                throw new Error(`Failed to fetch this.currencies.`);
            }
            const data = await response.json();
            this.currencies = Object.keys(data).map(key => new Currency(key, data[key]));

        } catch (error){
            console.error('Error fetching currencies:', error)
        }
        
    }

    async convertCurrency(amount, fromCurrency, toCurrency) {
              // Verificar si las monedas de origen y destino son las mismas
        if (fromCurrency.code === toCurrency.code) {
            return parseFloat(amount); // Retornar el mismo monto sin realizar petición
        }

        try {
            const response = await fetch(`${this.apiUrl}/latest?amount=${amount}&from=${fromCurrency.code}&to=${toCurrency.code}`);
            if (!response.ok) {
                throw new Error('Failed to convert currency.');
            }
            const data = await response.json();
            return data.rates[toCurrency.code] * amount; // Retornar el monto convertido
        } catch (error) {
            console.error('Error converting currency:', error);
            return null; // Retornar null en caso de error
        }  
    }

        // FUNCIONES ADICIONALES
     //la tasa de cambio de monedas de hoy y la tasa de cambio de monedas de ayer

    async getExchangeRateToday(fromCurrency, toCurrency) {
        try {
            const response = await fetch(`${this.apiUrl}/latest?from=${fromCurrency.code}&to=${toCurrency.code}`);
            if (!response.ok) {
                throw new Error('Failed to fetch exchange rate for today.');
            }
            const data = await response.json();
            return data.rates[toCurrency.code];
        } catch (error) {
            console.error('Error fetching exchange rate for today:', error);
            return null;
        }
    }

    async getExchangeRateYesterday(fromCurrency, toCurrency) {
        try {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const formattedDate = yesterday.toISOString().split('T')[0]; // Formato YYYY-MM-DD

            const response = await fetch(`${this.apiUrl}/${formattedDate}?from=${fromCurrency.code}&to=${toCurrency.code}`);
            if (!response.ok) {
                throw new Error('Failed to fetch exchange rate for yesterday.');
            }
            const data = await response.json();
            return data.rates[toCurrency.code];
        } catch (error) {
            console.error('Error fetching exchange rate for yesterday:', error);
            return null;
        }
    }

    //la diferencia entre la tasa de cambio de monedas de dos fechas diferentes
    async calculateRateDifference(fromCurrency, toCurrency) {
        try {
            const rateToday = await this.getExchangeRateToday(fromCurrency, toCurrency);
            const rateYesterday = await this.getExchangeRateYesterday(fromCurrency, toCurrency);

            if (rateToday === null || rateYesterday === null) {
                throw new Error('Failed to calculate rate difference.');
            }

            const difference = ((rateToday - rateYesterday) / rateYesterday) * 100;
            return difference.toFixed(2);
        } catch (error) {
            console.error('Error calculating rate difference:', error);
            return null;
        }
    }
}

// Código para manipulación del DOM y lógica de interacción con la API Frankfurter
document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("conversion-form");
    const resultDiv = document.getElementById("result");
    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");

    const converter = new CurrencyConverter("https://api.frankfurter.app");
    const fromCurrency = new Currency("USD", "US Dollar");  //prueba
    const toCurrency = new Currency("EUR", "Euro");         //prueba

    // Lógica para obtener y cargar las monedas disponibles en los selectores
    await converter.getCurrencies();
    populateCurrencies(fromCurrencySelect, converter.currencies);
    populateCurrencies(toCurrencySelect, converter.currencies);

    // Evento de envío del formulario para realizar la conversión
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const amount = document.getElementById("amount").value;
        const fromCurrency = converter.currencies.find(
            (currency) => currency.code === fromCurrencySelect.value
        );
        const toCurrency = converter.currencies.find(
            (currency) => currency.code === toCurrencySelect.value
        );
            
        // Llamada al método de conversión implementado en CurrencyConverter
        const convertedAmount = await converter.convertCurrency(
            amount,
            fromCurrency,
            toCurrency
        );

        // Manejo del resultado de la conversión y actualización del DOM
        if (convertedAmount !== null && !isNaN(convertedAmount)) {
            resultDiv.textContent = `${amount} ${
                fromCurrency.code
            } son ${convertedAmount.toFixed(2)} ${toCurrency.code}`;
        } else {
            resultDiv.textContent = "Error al realizar la conversión.";
        }
    });

    function populateCurrencies(selectElement, currencies) {
         // Limpiar opciones existentes antes de agregar nuevas
        selectElement.innerHTML = "";

        if (currencies) {
            currencies.forEach((currency) => {
                const option = document.createElement("option");
                option.value = currency.code;
                option.textContent = `${currency.code} - ${currency.name}`;
                selectElement.appendChild(option);
            });
        }
    }
        // FUNCIONES ADICIONALES
        // Ejemplo de uso de calculateRateDifference para mostrar la diferencia entre tasas de cambio
    const exampleFromCurrency = converter.currencies.find(currency => currency.code === 'USD');
    const exampleToCurrency = converter.currencies.find(currency => currency.code === 'EUR');

    const difference = await converter.calculateRateDifference(exampleFromCurrency, exampleToCurrency);
    console.log(`Diferencia entre tasas de cambio: ${difference}%`);

});
