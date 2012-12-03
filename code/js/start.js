var height = 500;
var width = 500;
var padding = 60;

var svg = d3.select("#main_container")
    .append("svg")
    .attr("width",width)
    .attr("height",height);

// var data = [1,2,3];
// var data2 = [1,2,3,4,5,6,7];
// var color = ["black","red","blue","yellow",
// 	     "green","grey","purple"];

console.log(kobe,taylor);

var x_scale = d3.scale.linear()
    .domain(d3.extent(kobe, function(d)
		      {return d.time}))
    .range([padding,width - padding]);

var y_scale = d3.scale.linear()
    .domain(d3.extent(kobe, function(d){
	return d.kobe_points + d.rot_points}))
    .range([height-padding, padding]);

var x_axis = d3.svg.axis()
    .scale(x_scale)
    .orient("bottom")
    .ticks(8);

var y_axis = d3.svg.axis()
    .scale(y_scale)
    .orient("left")
    .ticks(8);

// Added the y-axis to the dom
svg.append("g")
    .attr("transform","translate(" 
	  + padding + ",0)")
    .attr("class","y_axis")
    .call(y_axis);

// Added the x-axis to the dom
svg.append("g")
    .attr("transform","translate(0," 
	  + (height - padding) + ")")
    .attr("class","x_axis")
    .call(x_axis);

var data_domain = 
    get_data(kobe,"kobe","points");

var data = data_domain[0];
console.log("data is: ",data);
var data_every_12th = [
    data[0].filter(
	function(d,i){return i%12 == 0}),
    data[1].filter(
	function(d,i){return i%12 == 0})];
console.log("after: ",data_every_12th);
var rects = svg.selectAll("rect")
    .data(data_every_12th[0]);
rects.enter().append("rect")
    .attr("x", function(d){

	return x_scale(d.x)})
    .attr("y", function(d){
	return y_scale(d.y)})
    .attr("width", x_scale(1))
    .attr("height", function(d){
	return height - padding 
	    - y_scale(d.y)})
    .attr("fill","green");

// var circles = svg.selectAll("circle")
//     .data(data2)
//     .enter().append("circle")
//     .attr("cx",function(d,i){
// 	console.log(d,i);
// 	return x_scale(d)})
//     .attr("cy",function(d){
// 	return y_scale(d)})
//     .attr("fill",function (d,i){
// 	return color[i];})
//     .attr("r", function(d) {
// 	return x_scale(d)/10});


// // var circle = svg.selectAll("circle")
// //     .data(data);
// // circle.exit().remove();
// Our helper function to place the data in the correct format
function get_data (data,player,type){
    // Define the domain variable to be passed back

    var domain = [];
    if (player === "kobe"){
	if (type === "percentage"){
	    domain = [0,1];
	    return [[data.map(function (d) {return {x:d.time,
						   y:d.kobe_percentage}}),
		    data.map(function (d) {return {x:d.time,
						   y:d.rot_percentage}})],domain, d3.format('%')];
	}
	else{
	    domain = [0,180];
	    return [[data.map(function (d) {return {x:d.time,
						   y:d.kobe_points}}),
		    data.map(function (d) {return {x:d.time,
						   y:d.rot_points}})],domain,d3.format("g")];
	}
    }
    else{
	if (type === "percentage"){
	    domain = [0,1];
	    return [[data.map(function (d) {return {x:d.time,
						   y:d.jt_percentage}}),
		    data.map(function (d) {return {x:d.time,
						   y:d.rot_percentage}})], domain,d3.format("%")];
	}
	else{
	    domain = [0,180];
	    return [[data.map(function (d) {return {x:d.time,
						   y:d.jt_points}}),
		    data.map(function (d) {return {x:d.time,
						   y:d.rot_points}})],domain, d3.format("g")];
	}
    }
}
