// Function to fetch data and display it on the webpage
async function fetchData(roomNumber, timegap) {

    // Define your API key
    const apiKey = 'II6dsQDctGjWeoHgnT5wPjXlyJVmmUbvASnh2Zay';

    // Function to get the current time string
    function getCurrentTimeString() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    // Function to get the current date string in "yyyy-mm-dd" format
    function getCurrentDateString() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Function to get the date string for one week ago, one moth ago and one year ago
    function getOneWeekAgoDateString() {
        const now = new Date();
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);   // set the date for one week ago
        const year = oneWeekAgo.getFullYear();
        const month = (oneWeekAgo.getMonth() + 1).toString().padStart(2, '0');
        const day = oneWeekAgo.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    function getOneMonthAgoDateString() {
        const now = new Date();
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);   // set the date for one month ago
        const year = oneMonthAgo.getFullYear();
        const month = (oneMonthAgo.getMonth() + 1).toString().padStart(2, '0');
        const day = oneMonthAgo.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    function getOneYearAgoDateString() {
        const now = new Date();
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);   // set the date for one year ago
        const year = oneYearAgo.getFullYear();
        const month = (oneYearAgo.getMonth() + 1).toString().padStart(2, '0');
        const day = oneYearAgo.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }


    try {
        // Get the current time string and one week ago date string
        const dateString = getCurrentDateString();
        const timeString = getCurrentTimeString();
        var pastDateString = getOneWeekAgoDateString();

        if (timegap == "week"){
            pastDateString = getOneWeekAgoDateString();
            Chart.getChart(document.getElementById('chart-bars')).destroy();
            Chart.getChart(document.getElementById('chart-line')).destroy();
            Chart.getChart(document.getElementById('chart-line-tasks')).destroy(); 
            //color the button after pressed
            document.getElementById("week").classList.toggle("pressed");
            document.getElementById("month").classList.remove("pressed");
            document.getElementById("year").classList.remove("pressed");
        }
        else if (timegap == "month"){
            pastDateString = getOneMonthAgoDateString();
            Chart.getChart(document.getElementById('chart-bars')).destroy();
            Chart.getChart(document.getElementById('chart-line')).destroy();
            Chart.getChart(document.getElementById('chart-line-tasks')).destroy();
            document.getElementById("week").classList.remove("pressed");
            document.getElementById("month").classList.toggle("pressed");
            document.getElementById("year").classList.remove("pressed");
        }
        else if (timegap == "year"){
            pastDateString = getOneYearAgoDateString();
            Chart.getChart(document.getElementById('chart-bars')).destroy();
            Chart.getChart(document.getElementById('chart-line')).destroy();
            Chart.getChart(document.getElementById('chart-line-tasks')).destroy(); 
            document.getElementById("week").classList.remove("pressed");
            document.getElementById("month").classList.remove("pressed");
            document.getElementById("year").classList.toggle("pressed");
        }
        else{
            document.getElementById("week").classList.toggle("pressed"); 
        }

        // Update the apiUrl with the time strings
        const apiUrl = 'https://iot.research.hamk.fi/api/v1/hamk/rooms/tsdata?room-id=' + roomNumber + '&startTime=' + pastDateString + 'T' + timeString + 'Z&endTime=' + dateString + 'T' + timeString + 'Z&fields=temperature';


        const response = await fetch(apiUrl, {
            headers: {
                'x-api-key': apiKey
            }
        });

        const data = await response.json();
        console.log(data);

        let chartDate = [];
        let chartTemperature = [];
        let indexOfChart = 0;
        let indexOfPastWeek = 7;
        let pastDate = new Date(new Date());
        pastDate.setDate(pastDate.getDate() - indexOfPastWeek);

        data.results[0].series[0].values.forEach(element => {
            const resultDate = new Date(element[0]);

            if (resultDate.getDate() !== pastDate.getDate()) {
                indexOfPastWeek = indexOfPastWeek - 1;
                pastDate = new Date(new Date());
                pastDate.setDate(pastDate.getDate() - indexOfPastWeek);
                indexOfChart = indexOfChart + 1;
            }
            const year = resultDate.getFullYear();
            const month = (resultDate.getMonth() + 1).toString().padStart(2, '0');
            const day = resultDate.getDate().toString().padStart(2, '0');
            const date = `${month}-${day}`;

            chartDate[indexOfChart] = date;
            chartTemperature[indexOfChart] = element[1];
        });

        var ctx = document.getElementById("chart-bars").getContext("2d");

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: chartDate,
                datasets: [{
                    label: "Temperature",
                    tension: 0.4,
                    borderWidth: 0,
                    borderRadius: 4,
                    borderSkipped: false,
                    backgroundColor: "rgba(255, 255, 255, .8)",
                    data: chartTemperature,
                    maxBarThickness: 6
                },],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                scales: {
                    y: {
                        grid: {
                            drawBorder: false,
                            display: true,
                            drawOnChartArea: true,
                            drawTicks: false,
                            borderDash: [5, 5],
                            color: 'rgba(255, 255, 255, .2)'
                        },
                        ticks: {
                            suggestedMin: 0,
                            suggestedMax: 500,
                            beginAtZero: true,
                            padding: 10,
                            font: {
                                size: 14,
                                weight: 300,
                                family: "Roboto",
                                style: 'normal',
                                lineHeight: 2
                            },
                            color: "#fff"
                        },
                    },
                    x: {
                        grid: {
                            drawBorder: false,
                            display: true,
                            drawOnChartArea: true,
                            drawTicks: false,
                            borderDash: [5, 5],
                            //color: 'rgba(255, 255, 255, .2)'
                        },
                        ticks: {
                            display: true,
                            color: '#f8f9fa',
                            padding: 10,
                            font: {
                                size: 14,
                                weight: 300,
                                family: "Roboto",
                                style: 'normal',
                                lineHeight: 2
                            },
                        }
                    },
                },
            },
        });


        var ctx2 = document.getElementById("chart-line").getContext("2d");

        new Chart(ctx2, {
            type: "line",
            data: {
                labels: chartDate,
                datasets: [{
                    label: "Temperature",
                    tension: 0,
                    borderWidth: 0,
                    pointRadius: 0,
                    pointBackgroundColor: "rgba(255, 255, 255, .8)",
                    pointBorderColor: "transparent",
                    borderColor: "rgba(255, 255, 255, .8)",
                    borderWidth: 4,
                    backgroundColor: "transparent",
                    fill: true,
                    data: chartTemperature,
                    maxBarThickness: 6

                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                scales: {
                    y: {
                        grid: {
                            drawBorder: false,
                            display: true,
                            drawOnChartArea: true,
                            drawTicks: false,
                            borderDash: [5, 5],
                            color: 'rgba(255, 255, 255, .2)'
                        },
                        ticks: {
                            display: true,
                            color: '#f8f9fa',
                            padding: 10,
                            font: {
                                size: 14,
                                weight: 300,
                                family: "Roboto",
                                style: 'normal',
                                lineHeight: 2
                            },
                        }
                    },
                    x: {
                        grid: {
                            drawBorder: false,
                            display: false,
                            drawOnChartArea: false,
                            drawTicks: false,
                            borderDash: [5, 5]
                        },
                        ticks: {
                            display: true,
                            color: '#f8f9fa',
                            padding: 10,
                            font: {
                                size: 14,
                                weight: 300,
                                family: "Roboto",
                                style: 'normal',
                                lineHeight: 2
                            },
                        }
                    },
                },
            },
        });

        var ctx3 = document.getElementById("chart-line-tasks").getContext("2d");

        new Chart(ctx3, {
            type: "line",
            data: {
                labels: chartDate,
                datasets: [{
                    label: "Temperature",
                    tension: 0,
                    borderWidth: 0,
                    pointRadius: 5,
                    pointBackgroundColor: "rgba(255, 255, 255, .8)",
                    pointBorderColor: "transparent",
                    borderColor: "rgba(255, 255, 255, .8)",
                    borderWidth: 4,
                    backgroundColor: "transparent",
                    fill: true,
                    data: chartTemperature,
                    maxBarThickness: 6

                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                scales: {
                    y: {
                        grid: {
                            drawBorder: false,
                            display: true,
                            drawOnChartArea: true,
                            drawTicks: false,
                            borderDash: [5, 5],
                            color: 'rgba(255, 255, 255, .2)'
                        },
                        ticks: {
                            display: true,
                            padding: 10,
                            color: '#f8f9fa',
                            font: {
                                size: 14,
                                weight: 300,
                                family: "Roboto",
                                style: 'normal',
                                lineHeight: 2
                            },
                        }
                    },
                    x: {
                        grid: {
                            drawBorder: false,
                            display: false,
                            drawOnChartArea: false,
                            drawTicks: false,
                            borderDash: [5, 5]
                        },
                        ticks: {
                            display: true,
                            color: '#f8f9fa',
                            padding: 10,
                            font: {
                                size: 14,
                                weight: 300,
                                family: "Roboto",
                                style: 'normal',
                                lineHeight: 2
                            },
                        }
                    },
                },
            },
        });

        // Display data in the 'data-container' div
        // document.getElementById('data-container').textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        console.error('Error:', error);
    }

}

