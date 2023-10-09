// Function to fetch data and display it on the webpage
async function fetchData(roomNumber, temperatureElementId, co2ElementId, humidityElementId) {

    // Define your API key
    const apiKey = 'II6dsQDctGjWeoHgnT5wPjXlyJVmmUbvASnh2Zay';

    // Function to get the current time string
    function getCurrentTimeString() {
        const d1 = new Date();
        const now = new Date(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds());
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    function getPastTimeString() {
        const d1 = new Date();
        const now = new Date(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds());
        const past = new Date(now - 30000 * 60);
        const hours = past.getHours().toString().padStart(2, '0');
        const minutes = past.getMinutes().toString().padStart(2, '0');
        const seconds = past.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    // Function to get the current date string in "yyyy-mm-dd" format
    function getCurrentDateString() {
        const d1 = new Date();
        const now = new Date(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds());
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }


    try {
        // Get the current time string and one week ago date string
        const dateString = getCurrentDateString();
        const pastTimeString = getPastTimeString();
        const timeString = getCurrentTimeString();

        // Update the apiUrl with the time strings
        const apiUrl = 'https://iot.research.hamk.fi/api/v1/hamk/rooms/tsdata?room-id=' + roomNumber + '&startTime=' + dateString + 'T' + pastTimeString + 'Z&endTime=' + dateString + 'T' + timeString + 'Z&fields=temperature,co2,humidity';


        const response = await fetch(apiUrl, {
            headers: {
                'x-api-key': apiKey
            }
        });

        const data = await response.json();

        const lastIndex = data.results[0].series[0].values.length - 1;

        document.getElementById(temperatureElementId).textContent = data.results[0].series[0].values[lastIndex][1];
        document.getElementById(co2ElementId).textContent = data.results[0].series[0].values[lastIndex][2];
        document.getElementById(humidityElementId).textContent = data.results[0].series[0].values[lastIndex][3];

        // Display data in the 'data-container' div
        // document.getElementById('data-container').textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        console.error('Error:', error);
    }
}

