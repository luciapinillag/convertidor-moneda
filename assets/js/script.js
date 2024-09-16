
const convertBtn = document.getElementById('convert-btn');
const resultElement = document.getElementById('result');
const errorElement = document.getElementById('error');
const ctx = document.getElementById('myChart').getContext('2d');


const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], 
        datasets: [{
            label: 'Historial últimos 10 días',
            borderColor: 'rgb(255, 99, 132)',
            data: [] 
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
    }
});


function updateChart(labels, data) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}


convertBtn.addEventListener('click', async function() {
    const amount = parseFloat(document.getElementById('amount').value);
    const currency = document.getElementById('currency').value;

    try {
      
        const response = await fetch('https://mindicador.cl/api');
        if (!response.ok) throw new Error('No se pudo obtener los datos');

        const data = await response.json();
        let conversionRate;

        
        if (currency === 'USD') {
            conversionRate = data.dolar.valor;
        } else if (currency === 'EUR') {
            conversionRate = data.euro.valor;
        } else {
            throw new Error('Moneda no soportada');
        }

       
        const convertedAmount = (amount / conversionRate).toFixed(2);
        resultElement.textContent = `Resultado: ${convertedAmount} ${currency}`;
        errorElement.textContent = '';

        const last10Days = data.dolar.serie.slice(0, 10); 
        if (!last10Days || last10Days.length === 0) throw new Error('No hay datos disponibles');

        const labels = last10Days.map(entry => entry.fecha.split('T')[0]); 
        const values = last10Days.map(entry => entry.valor);

        updateChart(labels, values);

    } catch (error) {
        
        errorElement.textContent = `Error: ${error.message}`;
        resultElement.textContent = 'Resultado: --';
    }
});