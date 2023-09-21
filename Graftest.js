const xValues = [50,60,70,80,90,100,110,120,130,140,150];
const yValues = [7,8,8,9,9,9,10,11,14,14,15];


// Get the canvas element by its ID
const ctx = document.getElementById('myChart').getContext('2d');

//create chart
new Chart("myChart", {
    type: "line",
    data: {
        labels: xValues,
        datasets: [{
        data: yValues,
        fill: false
        }]
    },
    
    });

/*
How to use:

Set canvas and import Graf file:
<canvas id="myChart" style="width:100%;max-width:500px">   </canvas>
<script src="Graftest.js"></script>
*/
