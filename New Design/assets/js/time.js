// time.js

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

// Function to get the date string for one week ago
function getOneWeekAgoDateString() {
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);   // set the date for one week ago
    const year = oneWeekAgo.getFullYear();
    const month = (oneWeekAgo.getMonth() + 1).toString().padStart(2, '0');
    const day = oneWeekAgo.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/*
time.js use guide

In another file:

Include the time-functions.js file:
    <script src="time.js"></script>

Define variables:
    const dateString = getCurrentDateString();
    const timeString = getCurrentTimeString();
    const pastDateString = getOneWeekAgoDateString()

make APIurl into a variable:    
const apiUrl = 'https://iot.research.hamk.fi/api/v1/hamk/rooms/tsdata?room-id=10&startTime='+pastDateString+'T'+timeString+'Z&endTime='+dateString+'T' + timeString + 'Z&fields=temperature,humidity,co2,light,motion,vdd';

*/