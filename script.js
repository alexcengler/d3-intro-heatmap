



// Set Spacing Guidelines
var margin = {top: 10, right: 10, bottom: 40, left: 40}
var width = 850 - margin.left - margin.right;
var height = 450 - margin.top - margin.bottom;

// Create and Size SVG, where all of our visualization will appear:
var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

// Create and place start of SVG g tag, inside which our heatmap will appear:
var g = svg.append("g")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var parseDate = d3.timeParse("%Y-%m-%d");

function parseBoolean(dat){
  switch(dat.toLowerCase()) {
    case "true": return true;
    case "false": return false;
  };
};


d3.csv("fatal-police-shootings-data.csv", function(d) {
  return {
    race: d.race,
    gender: d.gender,
    bodyCamera: parseBoolean(d.body_camera),
    date: parseDate(d.date)
  }
}, function(error, data){
  // Simple error handling
  if(error) { 
    console.log(error);
  } else {
    createHeatmap(data);
  };
});


function createHeatmap(pol = data) {
  console.log(pol);
};

