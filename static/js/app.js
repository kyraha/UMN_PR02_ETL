let link = "/season/2017";
function init(){
let selected = d3.select("#selSeason")
  d3.json(link).then(function(data) {
    console.log(data)
    data.club.forEach((season)=>{
      selected.append("option").text(season).property("value",season)
      

    })
    makechart(data.season[0])
  })
};
function optionChanged(season){
  console.log(season)
  makechart(season)
}
init();
function makechart(sampleclub){
  d3.json(link).then(function(data){
let filteredsamples =data.samples.filter(s=>s.id==sampleclub)
let otu_ids =filteredsamples[0].otu_ids
let otu_labels = filteredsamples[0].otu_labels
let sample_values = filteredsamples[0].sample_values

let chartdata = [
  {
    y:otu_ids.slice(0,10),
    x:sample_values.slice(0,10),
    text:otu_labels.slice(0,10),
    type:"bar",
    orientation: "h"
  }
]
let layout = {
  title:"Belly button chart"
}


Plotly.newPlot("bar",chartdata,layout)
let bubbledata = [
  {
    y:sample_values,
    x:otu_ids,
    text:otu_labels,
    mode: "markers",
    marker: {
      size: sample_values,
      color:otu_ids
    }
  }
]
let bubblelayout = {
  title: ""
}

Plotly.newPlot("bubble",bubbledata,bubblelayout)

let seasondata = data.club.filter(s=>s.id==sampleclub)[0]
let minitable = d3.select("#sample-metadata")
minitable.html("")
Object.entries(seasondata).forEach(([key,value])=>{
minitable.append("h5").text(`${key}: ${value}`)
})
  })


}

















// //  set the dimensions and margins of the graph
// var margin = {top: 20, right: 30, bottom: 40, left: 90},
//     width = 460 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;

// // append the svg object to the body of the page
// var svg = d3.select("#bar")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");

// // read in json file

// d3.json("../StarterCode/samples.json").then(function(data) {
//     // console.log(data);


//     var wfreq = data.metadata.map(d => d.wfreq)
// console.log(`Washing Freq: ${wfreq}`)
// let id = data.metadata.id;
// let samples = data.samples.filter(s => s.id.toString() === id)[0];
// console.log(samples);


//     let otu_ids = data.metadata.map(d => d.id)
//   console.log(`id: ${otu_ids}`)


//   });

// // ==========================================================================

// //  set the dimensions and margins of the graph
// var margin = {top: 20, right: 30, bottom: 40, left: 90},
//     width = 460 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;

// // append the svg object to the body of the page
// var svg = d3.select("#bar")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");

// // Parse the Data
// // d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv", function(data) {
//   d3.json("../StarterCode/samples.json").then(function(data) {
//   // Add X axis
//   var x = d3.scaleLinear()
//     .domain([0, 150])
//     .range([ 0, width]);
//   svg.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x))
//     .selectAll("text")
//       .attr("transform", "translate(-10,0)rotate(-45)")
//       .style("text-anchor", "end");

//   // Y axis
//   var y = d3.scaleBand()
//     .range([ 0, height ])
//     .domain(data.map(function(d) { return d.otu_ids; }))
//     .padding(.1);
//   svg.append("g")
//     .call(d3.axisLeft(otu_ids))

//   //Bars
//   svg.selectAll("myRect")
//     .data(data)
//     .enter()
//     .append("rect")
//     .attr("x", x(0) )
//     .attr("y", function(d) { return y(d.otu_ids); })
//     .attr("width", function(d) { return x(d.Value); })
//     .attr("height", otu_ids.bandwidth() )
//     .attr("fill", "#69b3a2")


//     // .attr("x", function(d) { return x(d.Country); })
//     // .attr("y", function(d) { return y(d.Value); })
//     // .attr("width", x.bandwidth())
//     // .attr("height", function(d) { return height - y(d.Value); })
//     // .attr("fill", "#69b3a2")

// })
// // This function is called when a dropdown menu item is selected
// function updatePlotly() {
//   // Use D3 to select the dropdown menu
//   var dropdownMenu = d3.select("#selDataset");
//   // Assign the value of the dropdown menu option to a variable
//   var dataset = dropdownMenu.property("value");

//   // Initialize x and y arrays
//   var x = [];
//   var y = [];

//   if (dataset === 'dataset1') {
//     x = [1, 2, 3, 4, 5];
//     y = [1, 2, 4, 8, 16];
//   }

//   if (dataset === 'dataset2') {
//     x = [10, 20, 30, 40, 50];
//     y = [1, 10, 100, 1000, 10000];
//   }

//   // Note the extra brackets around 'x' and 'y'
//   Plotly.restyle("plot", "x", [x]);
//   Plotly.restyle("plot", "y", [y]);
// }

// init();

