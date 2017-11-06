



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


// Create functions to help parse our data on read-in:
var parseDate = d3.timeParse("%Y-%m-%d");

// timeParsing Documentation:
// https://github.com/d3/d3-time-format/blob/master/README.md#timeParse
var formatYear = d3.timeFormat("%Y")
var formatMonth = d3.timeFormat("%m")


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
  
  // Create aggregation at the year-month level.
  var pol_agg = d3.nest()
    .key(function(d) { return formatYear(d.date) + "-" + formatMonth(d.date); })
    .rollup(function(leaves) { return leaves.length; })
    .entries(pol);

  console.log("The data after the nesting and rollup:")
  console.log(pol_agg)


  // Then use a map function to create three distinct key-value pairs for year/month/count:
  pol_agg = pol_agg
    .map(function(d){ 
      return {
        year: +d.key.substring(0,4),
        month: +d.key.substring(5,7),
        count: +d.value
      };
    });

  console.log("The data after the map:")
  console.log(pol_agg)

};

