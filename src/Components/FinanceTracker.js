import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const FinanceTracker = () => {
    const API_KEY = '081B1G95JBIIWXV1';
    const API_ENDPOINT = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=USD&to_symbol=TRY&apikey=081B1G95JBIIWXV1`;
    const [data, setData] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [slice, setSlice] = useState(5);

    const handleSliceChange = (e) => {
        e.preventDefault();
        setSlice(e.target.value);
    }
    useEffect(() => {
       async function fetchData() {
            const response = await fetch(API_ENDPOINT);
            const data = await response.json();
            const last30DaysData = Object.entries(data['Time Series FX (Daily)']).slice(0, slice).map((entry) => {
                return [new Date(entry[0]).getTime(), parseFloat(entry[1]['4. close'])];
            });
            setData(last30DaysData);
        }
        fetchData();
    }, [slice]);

    console.log(data)
    const generateChartOptions = () => {
       
        return {
            title: {
                text: 'USD/TRY Exchange Rate',
            },
            yAxis: {
                title: {
                    text: 'Exchange Rate',
                    style: {
                        color: isDarkMode ? 'goldenrod' : 'black',
                    },
                },
                labels: {
                    style: {
                        color: isDarkMode ? 'goldenrod' : 'black',
                    },
                },
            },
            xAxis: {
                color: isDarkMode ? 'goldenrod' : 'black',
                type: 'datetime',
                style: {
                    color: isDarkMode ? 'goldenrod' : 'black',
                },
                labels: {
                    style: {
                        color: isDarkMode ? 'goldenrod' : 'black',
                    },
                },

            },
            colors: [isDarkMode ? 'goldenrod' : 'black'],
            series: [
                {
                    name: 'USD/TRY',
                    data: data,
                    color: isDarkMode ? 'goldenrod' : 'black',
                },
            ],
            chart: {
                backgroundColor: isDarkMode ? '#333' : 'white',
                height: 500,
            },
            tooltip: {
                backgroundColor: '#333',
                style: {
                    color: 'white',

                },
                formatter: function () {
                    return `<strong>${this.series.name}</strong><br/>${new Date(this.x).toLocaleDateString()}<br/>${this.y}`;
                },
            },
            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false,
                    },
                    pointStart: 2010,
                },
            },
            legend: {
                itemStyle: {
                    color: isDarkMode ? 'goldenrod' : 'black',
                },
                itemHoverStyle: {
                    color: isDarkMode ? 'goldenrod' : 'black',
                },

            },
        };
    };



    return (
        <div>
            <h1>USD/TRY Exchange Rate</h1>
            <select onChange={handleSliceChange} value={slice}>
                <option value={7}>Last 7 Days</option>
                <option value={30}>Last 30 Days</option>
                <option value={60}>Last 60 Days</option>
                <option value={90}>Last 90 Days</option>
            </select>
            <button onClick={() => setIsDarkMode(!isDarkMode)}>Toggle Theme</button>
            <HighchartsReact highcharts={Highcharts} options={generateChartOptions()} />
        </div>
    );
};

export default FinanceTracker;