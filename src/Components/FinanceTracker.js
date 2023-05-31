import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const FinanceTracker = () => {
    const API_KEY = '081B1G95JBIIWXV1';
    const API_ENDPOINT = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=USD&to_symbol=TRY&apikey=081B1G95JBIIWXV1`;
    const [data, setData] = useState({});
    const [isDarkMode, setIsDarkMode] = useState(false);

    const fetchStockData = async () => {
        try {
            const response = await fetch(API_ENDPOINT);
            const responseData = await response.json();
            const dates = Object.keys(responseData['Time Series FX (Daily)']);
            const stockData = Object.values(responseData['Time Series FX (Daily)']).map((value) => parseFloat(value['4. close']));
            const data = dates.map((date, index) => [Date.parse(date), stockData[index]]);
            setData(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchStockData();
    }, []);

    const generateChartOptions = () => {
        const chartOptions = {
            chart: {
                backgroundColor: isDarkMode ? '#333' : '#fff',
                style: {
                    color: isDarkMode ? '#fff' : '#333',
                },
            },
            title: {
                text: 'USD/TRY Exchange Rate',
                style: {
                    color: isDarkMode ? '#fff' : '#333',
                },
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    style: {
                        color: isDarkMode ? '#fff' : '#333',
                    },
                },
                rangeSelector: {
                    enabled: true,
                    buttons: [
                        {
                            type: 'month',
                            count: 1,
                            text: '1m',
                        },
                        {
                            type: 'month',
                            count: 3,
                            text: '3m',
                        },
                        {
                            type: 'month',
                            count: 6,
                            text: '6m',
                        },
                        {
                            type: 'ytd',
                            text: 'YTD',
                        },
                        {
                            type: 'year',
                            count: 1,
                            text: '1y',
                        },
                        {
                            type: 'all',
                            text: 'All',
                        },
                    ],
                    selected: 5, // set the default range to 'All'
                },
            },
            yAxis: {
                title: {
                    text: 'Price',
                    style: {
                        color: isDarkMode ? '#fff' : '#333',
                    },
                },
                labels: {
                    style: {
                        color: isDarkMode ? '#fff' : '#333',
                    },
                },
            },
            series: [
                {
                    name: 'USD/TRY',
                    data: data,
                    color: isDarkMode ? '#fff' : '#333',
                },
            ],
        };
        return chartOptions;
    };

    return (
        <div>
            <h1>USD/TRY Exchange Rate</h1>
            <button onClick={() => setIsDarkMode(!isDarkMode)}>Toggle Theme</button>
            <HighchartsReact highcharts={Highcharts} options={generateChartOptions()} />
        </div>
    );
};

export default FinanceTracker;