import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Button, Form } from 'react-bootstrap';

const Oil = () => {
    const [data, setData] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [year, setYear] = useState();

    const API_KEY = '081B1G95JBIIWXV1';
    const API_ENDPOINT = `https://www.alphavantage.co/query?function=WTI&interval=monthly&apikey=${API_KEY}`;

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(API_ENDPOINT);
                const responseData = await response.json();

                if (responseData && responseData.data) {
                    const oilData = responseData.data.map((entry) => {
                        return [new Date(entry.date).getTime(), parseFloat(entry.value)];
                    });

                    if (year) {
                        setData(
                            oilData.filter(
                                (entry) =>
                                    entry[0] > new Date(`${year}-01-01`).getTime() &&
                                    entry[0] < new Date(`${year}-12-31`).getTime()
                            )
                        );
                    } else {
                        setData(oilData);
                    }
                } else {
                    setData([]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [year]);

    const handleModeChange = () => {
        setIsDarkMode(!isDarkMode);
    };

    useEffect(() => {
        if (isDarkMode) {
            document.body.style.backgroundColor = '#333';
            document.body.style.color = '#fff';
        } else {
            document.body.style.backgroundColor = 'white';
            document.body.style.color = 'black';
        }
    }, [isDarkMode]);

    const generateChartOptions = () => {
        //line chart
        return {
            title: {
                text: 'Oil Price',
                style: {
                    color: isDarkMode ? 'goldenrod' : 'black',
                },
            },
            yAxis: {
                title: {
                    text: 'Price',
                    style: {
                        color: isDarkMode ? 'goldenrod' : 'black',
                    }
                },
                labels: {
                    style: {
                        color: isDarkMode ? 'goldenrod' : 'black',

                    }

                }
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    style: {
                        color: isDarkMode ? 'goldenrod' : 'black',
                    }

                }
            },
            series: [
                {
                    name: 'Oil Price',
                    data: data,
                    color: isDarkMode ? 'goldenrod' : 'black',
                },
            ],
            chart: {
                backgroundColor: isDarkMode ? '#333' : 'white',
            },
            legend: {
                itemStyle: {
                    color: isDarkMode ? 'goldenrod' : 'black',
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
        };
    };

    //filter data to year 2022


    return (
        <div style={{ margin: '10px' }}>
            {data.length<=0 ? (
                <div style={{ textAlign: 'center' }}>
                    <h2>Loading...</h2>
                </div>
            ) : (
                <div>
                    <HighchartsReact highcharts={Highcharts} options={generateChartOptions()} />
                    <div className="controls-container">
                        <Form className="form-container" style={{ width: '150px', margin: '10px' }}>
                            <Form.Group controlId="year">
                                <Form.Label>Year</Form.Label>
                                <Form.Control as="select" value={year} onChange={(e) => setYear(e.target.value)}>
                                    <option value="">All</option>
                                    <option value="2020">2020</option>
                                    <option value="2021">2021</option>
                                    <option value="2022">2022</option>
                                    <option value="2023">2023</option>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </div>
                    <Button variant={isDarkMode ? 'outline-success' : 'outline-dark'} onClick={handleModeChange}>
                        {isDarkMode ? 'Light' : 'Dark'} Mode
                    </Button>
                </div>

                )
            }
        </div>
    );
};

export default Oil;