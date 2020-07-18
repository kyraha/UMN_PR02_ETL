var ctx = document.getElementById('myChart').getContext('2d');
lineConfig = {};
lineInitialized = false;

function optionChanged(season) {
  if(season == undefined) {
    console.log("Season is undefined!!");
    return;
  }
  console.log("Season", season, lineInitialized, window.myLineChart);
  redrawLine(season);
  makechart1(season);
}

function makechart1(season){

  let boxes = [];
  d3.json(`/season/${season}`).then(function(data){
    fillSeasonInfo(data);
    let salary = {};
    let ranks = {};
    data.forEach(player => {
      let club = player.club;
      if(ranks[club] == undefined) ranks[club] = player.rank;
      if(salary[club] == undefined) salary[club] = [];
      salary[club].push(player.salary);
    });

    Object.keys(salary).forEach(club => {
      boxes.push({
        name: club,
        rank: ranks[club],
        y: salary[club],
        type: "box"
      });
    });
    boxes = boxes.sort((a,b) => a.rank - b.rank);
    Plotly.newPlot("bubble", boxes);
  });
}


/*

    d3.min - compute the minimum value in an array.
    d3.max - compute the maximum value in an array.
    d3.extent - compute the minimum and maximum value in an array.
    d3.sum - compute the sum of an array of numbers.
    d3.mean - compute the arithmetic mean of an array of numbers.
    d3.median - compute the median of an array of numbers (the 0.5-quantile).
    d3.quantile - compute a quantile for a sorted array of numbers.
    d3.variance - compute the variance of an array of numbers.
    d3.deviation - compute the standard deviation of an array of numbers.

*/
const mlsPrice = new Intl.NumberFormat('en-US',
                        { style: 'currency', currency: 'USD',
                          minimumFractionDigits: 0 });

function fillSeasonInfo(data) {
  let minitable = d3.select("#sample-metadata");
  minitable.html("");
  let salary = data.map(player => player.salary);
  let seasondata = {
    "Min Salary": mlsPrice.format(d3.min(salary)),
    "Max Salary": mlsPrice.format(d3.max(salary)),
    "Median": mlsPrice.format(d3.median(salary)),
    "Variance": mlsPrice.format(d3.deviation(salary))
  }
  Object.entries(seasondata).forEach(([key,value])=>{
    minitable.append("h5").text(`${key}: ${value}`)
  })

}

function lineChart(season) {

  d3.json(`/clubs/${season}`).then(function(data){
    console.log("Clubs", data);
    window.myLineChart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
        // The data for our dataset
        data: {
            labels: data.map(clubObj => clubObj.club),
            datasets: [{
                label: 'GD',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: data.map(co => co.GD)
            }]
        },
        // Configuration options go here
        options: {}
    });
  });
  lineInitialized = true;
}

function redrawLine(season) {
  d3.json(`/clubs/${season}`).then(function(data){
    lineConfig = {
      // The type of chart we want to create
      type: 'line',
      // The data for our dataset
      data: {
          labels: data.map(clubObj => clubObj.club),
          datasets: [{
              label: 'GD',
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              data: data.map(co => co.GD)
          }]
      },
      // Configuration options go here
      options: {}
    };
//    if(window.myLineChart == undefined)
      window.myLineChart = new Chart(ctx, lineConfig);
//    else window.myLineChart.update();
  });
}

d3.select("#selSeason").on("change", optionChanged);

optionChanged(d3.select("#selSeason").property("value"));
