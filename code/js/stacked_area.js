// Some variables that will be helpful to define
var height = 400;
var width = 400;
var padding = 30;
var duration = 1000;

var data = [[width/2,0],[width,0],[width/2,height/2]]
// Initialize the two svg canvases
var svg = d3.select("#main_container")
    .append("svg")
    .attr("width", width + padding)
    .attr("height", height + padding);

var line = d3.svg.line()
    .x(function(d) { return d[0]})
    .y(function(d) { return d[1]});

var x_scale = d3.scale.ordinal()
    .domain([0,1])
    .range([15, width/2 - 30]);
var y_scale = d3.scale.ordinal()
    .domain([0,1])
    .range([h/2 + 80,h-20]);
    
var paths = svg.selectAll(".snowflake")
    .data(data);
paths.enter().append("path")
    .attr("fill","rgba(120,120,120,1)")
    .attr("class","snowflake")
    .attr("d",line);
    // .transition()
    // .duration(duration)
    // .attr("fill",function(d,i){
    // 	return colors[player][i]})
    // .attr("opacity",1);
// paths.transition()
//     .duration(duration)
//     .attr("d",stack_area)
//     .attr("fill",function(d,i){
//     	    return colors[player][i]})
//     .attr("opacity",1);

