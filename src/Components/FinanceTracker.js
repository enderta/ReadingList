import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const FinanceTracker = () => {
    const API_KEY = '081B1G95JBIIWXV1';
    const API_ENDPOINT = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=USD&to_symbol=TRY&apikey=081B1G95JBIIWXV1`;
    const [data, setData] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
       async function fetchData() {
            const response = await fetch(API_ENDPOINT);
            const data = await response.json();
            const last30DaysData = Object.entries(data['Time Series FX (Daily)']).slice(0, 30).map((entry) => {
                return [new Date(entry[0]).getTime(), parseFloat(entry[1]['4. close'])];
            });
            setData(last30DaysData);
        }
        fetchData();
    }, []);

    console.log(data)

    const generateChartOptions = () => {
        return {
            title: {
                text: 'USD/TRY Exchange Rate',
            },
            yAxis: {
                title: {
                    text: 'Exchange Rate',
                },
            },
            xAxis: {
                type: 'datetime',
            },
            series: [
                {
                    name: 'USD/TRY',
                    data: data,
                },
            ],
            chart: {
                backgroundColor: isDarkMode ? '#333' : '#FFF',
                height: 500,
            },
            tooltip: {
                backgroundColor: '#333',
                style: {
                    color: '#FFF',
                },
                formatter: function () {
                    return `<strong>${this.series.name}</strong><br/>${new Date(this.x).toLocaleDateString()}<br/>${this.y}`;
                },
            },
            plotOptions: {
                series: {
                    color: isDarkMode ? '#FFF' : '#333',
                },
            },
        };
    }
    



    return (
        <div>
            <h1>USD/TRY Exchange Rate</h1>
            <button onClick={() => setIsDarkMode(!isDarkMode)}>Toggle Theme</button>
            <HighchartsReact highcharts={Highcharts} options={generateChartOptions()} />
        </div>
    );
};

export default FinanceTracker;