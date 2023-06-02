import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Button, Form } from 'react-bootstrap';

const FinanceTracker = () => {
    const [data, setData] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [slice, setSlice] = useState(5);
    const [from, setFrom] = useState('USD');
    const [to, setTo] = useState('TRY');
    const API_KEY = '081B1G95JBIIWXV1';
    const API_ENDPOINT = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${from}&to_symbol=${to}&apikey=081B1G95JBIIWXV1`;

    const handleSliceChange = (e) => {
        e.preventDefault();
        setSlice(e.target.value);
    };

    const handleFromChange = (e) => {
        e.preventDefault();
        setFrom(e.target.value);
    };

    const handleToChange = (e) => {
        e.preventDefault();
        setTo(e.target.value);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(API_ENDPOINT);
                const data = await response.json();
                if (data && data['Time Series FX (Daily)']) {
                    const last30DaysData = Object.entries(data['Time Series FX (Daily)']).slice(0, slice).map((entry) => {
                        return [new Date(entry[0]).getTime(), parseFloat(entry[1]['4. close'])];
                    });
                    setData(last30DaysData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, [slice, from, to]);

    const generateChartOptions = () => {
        return {
            title: {
                text: `${from}/${to} Exchange Rate`,
                style: {
                    color: isDarkMode ? 'goldenrod' : 'black',
                },
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
            series: [{
                name: `${from}/${to}`,
                data: data,
                lineWidth: 2,
                type: 'spline',
                marker: {
                    enabled: true,
                    radius: 3,
                },
                color: isDarkMode ? 'goldenrod' : 'black',
            }],
            chart: {
                type: 'line',
                spacing: [10, 10, 10, 10],
                backgroundColor: isDarkMode ? '#333' : 'white',
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
        <div style={{ margin: '10px' }}>
            <h1>USD/TRY Exchange Rate</h1>
            {data.length === 0 || data.length === null ? (
                'Refresh the page if the chart does not load.'
            )  : (<div className={`app-container ${isDarkMode ? 'dark' : 'light'}`}>
                    <div className="chart-container">
                        <HighchartsReact highcharts={Highcharts} options={generateChartOptions()} />
                    </div>
                    <div className="controls-container">

                        <Form className="form-container" style={{width:'150px',margin:"10px"}}>
                            <Form.Group controlId="formSlice">
                                <Form.Label>Show: </Form.Label>
                                <Form.Control as="select" value={slice} onChange={handleSliceChange}>
                                    <option value={7}>Last 7 Days</option>
                                    <option value={30}>Last 30 Days</option>
                                    <option value={60}>Last 60 Days</option>
                                    <option value={90}>Last 90 Days</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formFrom">
                                <Form.Label>From:</Form.Label>
                                <Form.Control as="select" value={from} onChange={handleFromChange}>
                                    <option value={'USD'}>USD</option>
                                    <option value={'EUR'}>EUR</option>
                                    <option value={'GBP'}>GBP</option>
                                    <option value={'JPY'}>JPY</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formTo">
                                <Form.Label>To:</Form.Label>
                                <Form.Control as="select" value={to} onChange={handleToChange}>
                                    <option value={'TRY'}>TRY</option>
                                    <option value={'EUR'}>EUR</option>
                                    <option value={'GBP'}>GBP</option>
                                    <option value={'JPY'}>JPY</option>
                                </Form.Control>
                            </Form.Group>
                            <br/>
                            <Button variant="primary" onClick={() => setIsDarkMode(!isDarkMode)}>
                                {isDarkMode ? 'Light' : 'Dark'}
                            </Button>
                        </Form>
                    </div>
                </div>)
            }
        </div>
    );
};

export default FinanceTracker;
