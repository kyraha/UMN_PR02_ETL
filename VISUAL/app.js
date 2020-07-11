var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "season";
var chosenYAxis = "PTS";
var chosenZAxis = "totalCompensation";

// function used for updating x-scale var upon click on axis label
function xScale(mlsData, chosenXAxis) {
  // create scales
//   console.log(d3.max(mlsData, d => d[chosenXAxis]));
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(mlsData, d => d[chosenXAxis]),
      d3.max(mlsData, d => d[chosenXAxis])
    ])
    .range([0, width]);

  return xLinearScale;

}

function yScale(mlsData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(mlsData, d => d[chosenYAxis]) * 0.8,
      d3.max(mlsData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;

}

function zScale(mlsData, chosenZAxis) {
  var zLinearScale = d3.scaleLinear()
    .domain([d3.min(mlsData, d => d[chosenZAxis]),
      d3.max(mlsData, d => d[chosenZAxis])
    ])
    .range([3, 75]);
    return zLinearScale
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newZScale, chosenZAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("r", d => newZScale(d[chosenZAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "hair_length") {
    label = "Hair Length:";
  }
  else {
    label = "# of Albums:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.Club}<br>Total Salary: ${d.totalCompensation}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

function money(str) {
    str = str.replace("$", "");
    str = str.replace(",", "");
    str = str.replace(" ", "");

    // console.log(str);
    return parseFloat(str);
}

// Retrieve data from the CSV file and execute everything below
d3.json("zeus.json").then(function(mlsData, err) {
  if (err) throw err;

  // parse data
  mlsData.forEach(function(data) {
    data.GA = +data.GA;
    data.GF = +data.GF;
    data.W = +data.W;
    data.L = +data.L;
    data.PTS = +data.PTS;
    data.baseSalary = +data.baseSalary;
    data.totalCompensation = +data.totalCompensation;
  });
  console.log(mlsData);
//   return;

  // xLinearScale function above csv import
  var xLinearScale = xScale(mlsData, chosenXAxis);
  var yLinearScale = yScale(mlsData, chosenYAxis);
  var zLinearScale = zScale(mlsData, chosenZAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(mlsData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r",  d => zLinearScale(d[chosenZAxis]))
    .attr("fill", "pink")
    .attr("opacity", d => `${1.0-d.totalCompensation/1000000}`);

  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var hairLengthLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "season") // value to grab for event listener
    .classed("active", true)
    .text("Season");

  var totalCompensation = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "totalCompensation") // value to grab for event listener
    .classed("active", true)
    .text("Total Compensation (average)");

  var baseSalary = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "baseSalary") // value to grab for event listener
    .classed("inactive", true)
    .text("Base Salary (average)");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Points (PTS)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== "season" && value !== chosenZAxis) {

        // replaces chosenXAxis with value
        chosenZAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        zLinearScale = zScale(mlsData, chosenZAxis);

        // updates x axis with transition
        //xAxis = renderAxes(zLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, zLinearScale, chosenZAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenZAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenZAxis === "totalCompensation") {
          totalCompensation
            .classed("active", true)
            .classed("inactive", false);
          baseSalary
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          totalCompensation
            .classed("active", false)
            .classed("inactive", true);
          baseSalary
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
}).catch(function(error) {
  console.log(error);
});
