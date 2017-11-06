


// Set Spacing Guidelines
var margin = {top: 60, right: 75, bottom: 100, left: 50}
var width = 800 - margin.left - margin.right;
var height = 300 - margin.top - margin.bottom;

// Create Color Palette:
var colors = ['#fef0d9','#fdd49e','#fdbb84','#fc8d59','#ef6548','#d7301f','#990000'];
// From ColorBrewer: http://colorbrewer2.org/#type=sequential&scheme=OrRd&n=7

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

  // Then use a map function to create three distinct key-value pairs for year/month/count:
  pol_agg = pol_agg
    .map(function(d){ 
      return {
        year: +d.key.substring(0,4),
        month: +d.key.substring(5,7),
        count: +d.value
      };
    }).filter(function(d) { 
      return d.year != 2017 || d.month != 11 
    });


  // Create Scales
  var xScale = d3.scaleLinear()
    .domain(d3.extent(pol_agg, function(d){ return d.month; }))
    .range([0,width])
    .nice();

  var yScale = d3.scaleLinear()
    .domain(d3.extent(pol_agg, function(d){ return d.year; }))
    .range([height,0])
    .nice();

  // Color Scale using d3.scaleQuantile, which has a discrete range:
  var colorScale = d3.scaleQuantile()
    .domain([d3.min(pol_agg, function (d) { return d.count; }), 
      colors.length - 1, 
      d3.max(pol_agg, function (d) { return d.count; })])
    .range(colors);

  // 
  var tiles = g.selectAll(".tiles")
    .data(pol_agg)
    .enter()
    .append("rect")
    .attr("class", "tiles")
    .attr("x", function(d){ return xScale(d.month)})
    .attr("y", function(d){ return yScale(d.year)})
    .attr("rx", 10)
    .attr("ry", 10)
    .attr("width", 60)
    .attr("height", 60)
    .style("fill", function(d){ return colorScale(d.count)});

  var colLegend = g.selectAll(".legend")
    .data(colorScale.quantiles(), function(d) { return d; })
    .enter().append("g")
      .attr("class", "legend")
    .append("rect")
      .attr("x", function(d, i) { return 150 + (((width * 2/3)/6) * i); })
      .attr("y", height + margin.top + margin.bottom/4)
      .attr("width", ((width * 2/3)/6))
      .attr("height", 10)
      .style("fill", function(d, i) { return colors[i]; });

};

