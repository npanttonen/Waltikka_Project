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
    const dateControl = document.querySelector('input[type="date"]');
    console.log(dateControl.value)
    if (dateControl.value == ""){
        dateControl.value = `${year}-${month}-${day}`;
    }
    return dateControl.value;
    
}

// Function to get the date string for one week, month and year ago
function getOneWeekAgoDateString() {
    const now = getCurrentDateString();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);   // set the date for one week ago
    const year = oneWeekAgo.getFullYear();
    const month = (oneWeekAgo.getMonth() + 1).toString().padStart(2, '0');
    const day = oneWeekAgo.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function getOneMonthAgoDateString() {
    const now = getCurrentDateString();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);   // set the date for one month ago
    const year = oneMonthAgo.getFullYear();
    const month = (oneMonthAgo.getMonth() + 1).toString().padStart(2, '0');
    const day = oneMonthAgo.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function getOneYearAgoDateString() {
    const now = getCurrentDateString();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);   // set the date for one year ago
    const year = oneYearAgo.getFullYear();
    const month = (oneYearAgo.getMonth() + 1).toString().padStart(2, '0');
    const day = oneYearAgo.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}


// Function to fetch data and display it on the webpage
async function fetchtemperature(roomNumber, timegap) {

    // Define your API key
    const apiKey = 'II6dsQDctGjWeoHgnT5wPjXlyJVmmUbvASnh2Zay';

    try {
        // Get the current time string and one week ago date string
        const dateString = getCurrentDateString();
        const timeString = getCurrentTimeString();
        var pastDateString = getOneWeekAgoDateString();

        if (timegap == "week"){
            pastDateString = getOneWeekAgoDateString();
            var chartElement = document.getElementById('chart-temperature');
            // Check if the chart exists before destroying it
            if (chartElement) {
            var existingChart = Chart.getChart(chartElement);
            if (existingChart) {
                // The chart exists, so you can destroy it
                existingChart.destroy();
            }
            } 
            //color the button after pressed
            document.getElementById("week").classList.toggle("pressed");
            document.getElementById("month").classList.remove("pressed");
            document.getElementById("year").classList.remove("pressed");
        }
        else if (timegap == "month"){
            pastDateString = getOneMonthAgoDateString();
            var chartElement = document.getElementById('chart-temperature');
            // Check if the chart exists before destroying it
            if (chartElement) {
            var existingChart = Chart.getChart(chartElement);
            if (existingChart) {
                // The chart exists, so you can destroy it
                existingChart.destroy();
            }
            }
            document.getElementById("week").classList.remove("pressed");
            document.getElementById("month").classList.toggle("pressed");
            document.getElementById("year").classList.remove("pressed");
        }
        else if (timegap == "year"){
            pastDateString = getOneYearAgoDateString();
            var chartElement = document.getElementById('chart-temperature');

            // Check if the chart exists before destroying it
            if (chartElement) {
            var existingChart = Chart.getChart(chartElement);
            if (existingChart) {
                // The chart exists, so you can destroy it
                existingChart.destroy();
            }
            }
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
        
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr",
            "May", "Jun", "Jul", "Aug",
            "Sep", "Oct", "Nov", "Dec"
          ];
          
          const dayNames = [
            "Sun", "Mon", "Tue", "Wed",
            "Thu", "Fri", "Sat"
          ];

        // Calculate monthly averages if timegap is "year"
        if (timegap === "year") {
            const monthlyData = {};

            // Loop through the data received from the API
            data.results[0].series[0].values.forEach(element => {
                const resultDate = new Date(element[0]);
                const year = resultDate.getUTCFullYear();
                const month = resultDate.getUTCMonth();

                // Create a key in the monthlyData object based on year and month
                const dateKey = `${year}-${month}`;
                console.log(dateKey)
                if (!monthlyData[dateKey]) {
                    monthlyData[dateKey] = { sum: 0, count: 0 };
                }

                // Accumulate temperature values for each month
                monthlyData[dateKey].sum += element[1];
                monthlyData[dateKey].count++;
            });

            // Calculate monthly averages and populate chart data arrays
            for (const dateKey in monthlyData) {
                const [year, month] = dateKey.split('-');
                const monthName = monthNames[parseInt(month)];
                const avgTemperature = monthlyData[dateKey].sum / monthlyData[dateKey].count;
                chartDate[indexOfChart] = `${monthName}-${year}`;
                chartTemperature[indexOfChart] = avgTemperature;
                indexOfChart++;
            }
            
        }else if(timegap === "month"){
            const weeklyData = {};

            // Loop through the data received from the API
            data.results[0].series[0].values.forEach(element => {
                const resultDate = new Date(element[0]);
                const month = (resultDate.getMonth() + 1).toString().padStart(2, '0');
                const day = resultDate.getDate().toString().padStart(2, '0');
                const week = resultDate.getDate().toString().padStart(2, '0');
                // Create a key in the monthlyData object based on year and month
                const dateKey = `${month}-${day}`;
                console.log(dateKey)
                if (!weeklyData[dateKey]) {
                    weeklyData[dateKey] = { sum: 0, count: 0 };
                }

                // Accumulate temperature values for each month
                weeklyData[dateKey].sum += element[1];
                weeklyData[dateKey].count++;
            });

            // Calculate monthly averages and populate chart data arrays
            for (const dateKey in weeklyData) {
                const [day, month] = dateKey.split('-');
                const avgTemperature = weeklyData[dateKey].sum / weeklyData[dateKey].count;
                console.log(avgTemperature)
                chartDate[indexOfChart] = `${month}-${day}`;
                chartTemperature[indexOfChart] = avgTemperature;
                indexOfChart++;
            }
        }else{
            const dailyData = {};

            // Loop through the data received from the API
            data.results[0].series[0].values.forEach(element => {
                const resultDate = new Date(element[0]);
                const month = (resultDate.getMonth() + 1).toString().padStart(2, '0');
                const day = resultDate.getDate().toString().padStart(2, '0');
                
                // Create a key in the monthlyData object based on year and month
                const dateKey = `${month}-${day}`;
                console.log(dateKey)
                if (!dailyData[dateKey]) {
                    dailyData[dateKey] = { sum: 0, count: 0 };
                }

                // Accumulate temperature values for each month
                dailyData[dateKey].sum += element[1];
                dailyData[dateKey].count++;
            });

            // Calculate monthly averages and populate chart data arrays
            for (const dateKey in dailyData) {
                const [day, month] = dateKey.split('-');
                const avgTemperature = dailyData[dateKey].sum / dailyData[dateKey].count;
                console.log(avgTemperature)
                chartDate[indexOfChart] = `${month}-${day}`;
                chartTemperature[indexOfChart] = avgTemperature;
                indexOfChart++;
            }
        }
        console.log(chartDate)
        var ctx = document.getElementById("chart-temperature").getContext("2d");

        new Chart(ctx, {
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
    
    var dateInput = document.getElementById('start');
    dateInput.addEventListener('change', function() {
        // Call the fetchtemperature function when the date changes
        fetchtemperature(roomNumber, timegap);
    });

        // Display data in the 'data-container' div
        // document.getElementById('data-container').textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        console.error('Error:', error);
    }
}
