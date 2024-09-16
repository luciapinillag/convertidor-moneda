// Seleccionamos los elementos del DOM
const convertBtn = document.getElementById('convert-btn');
const resultElement = document.getElementById('result');
const errorElement = document.getElementById('error');
const ctx = document.getElementById('myChart').getContext('2d');

// Configuración inicial del gráfico
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Se actualizarán dinámicamente
        datasets: [{
            label: 'Historial últimos 10 días',
            borderColor: 'rgb(255, 99, 132)',
            data: [] // Datos que se actualizarán
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
    }
});

// Función que actualiza el gráfico con nuevos datos
function updateChart(labels, data) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}

// Función para realizar la conversión de moneda
convertBtn.addEventListener('click', async function() {
    const amount = parseFloat(document.getElementById('amount').value);
    const currency = document.getElementById('currency').value;

    try {
        // Fetch a la API de mindicador.cl
        const response = await fetch('https://mindicador.cl/api');
        if (!response.ok) throw new Error('No se pudo obtener los datos');

        const data = await response.json();
        let conversionRate;

        // Selecciona la tasa de cambio según la moneda
        if (currency === 'USD') {
            conversionRate = data.dolar.valor;
        } else if (currency === 'EUR') {
            conversionRate = data.euro.valor;
        } else {
            throw new Error('Moneda no soportada');
        }

        // Cálculo de la conversión
        const convertedAmount = (amount / conversionRate).toFixed(2);
        resultElement.textContent = `Resultado: ${convertedAmount} ${currency}`;
        errorElement.textContent = '';

        // Actualización del gráfico
        const last10Days = data.dolar.serie.slice(0, 10); // Tomamos los últimos 10 días de datos del dólar
        if (last10Days.length === 0) throw new Error('No hay datos disponibles');

        const labels = last10Days.map(entry => entry.fecha.split('T')[0]); // Convertimos las fechas a un formato legible
        const values = last10Days.map(entry => entry.valor);

        updateChart(labels, values);

    } catch (error) {
        // Mostrar el error en el DOM
        errorElement.textContent = 'Error al obtener los datos. Intenta de nuevo.';
        resultElement.textContent = 'Resultado: --';
    }
});
