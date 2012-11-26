// Some variables that will be helpful to define
var h = 400;
var width = 310;
var padding = 30;
var duration = 1000;
var colors = {kobe:["rgb(255,215,11)","rgb(128,27,179)"],
	      taylor:["rgb(255,26,0)","rgb(0,0,0)"]};
var tick_values = {kobe:[0,6,12,18,24,30,36,42,48],
		   taylor:[0,5,10,15,20,25,30,35,40]};


// Initialize the two svg canvases
var svg = d3.select("#main_container")
    .append("svg")
    .attr("width", width)
    .attr("height", h);

var svg_2 = d3.select("#main_container")
    .append("svg")
    .attr("width", width)
    .attr("height", h);

transition_stack_area(kobe,svg,"kobe","percentage");
// Change the axis labels
function axis_labels(svg,type){    
    // Set up the scales
    var x_scale = d3.scale.ordinal()
	.domain([0,1])
	.range([15, width/2 - 30]);
    var y_scale = d3.scale.ordinal()
	.domain([0,1])
	.range([h/2 + 80,h-20]);
    
    // Determine the y_axis text
    if (type === "percentage"){
	var legend_text = "Percentage of team's points";
    }
    else{
	var legend_text = "Amount of points"
    }
    // Update the text
    var axis_text = svg.selectAll(".axis_text")
	.data([legend_text,"Minutes"]);
    axis_text.enter().append("text")
    axis_text.transition()
	.duration(duration)
	.text(function (d){return d})
	.attr("font-family","Georgia")
	.attr("color","black")
	.attr("class","axis_text")
	.attr("transform", function(d,i){
	    if (i===0){
		return "rotate(-90 "+x_scale(i)+","+y_scale(i)+")";
	    }
	})
	.attr("x",function(d,i){return x_scale(i);})
	.attr("y",function(d,i){return y_scale(i);});
}

// Transition to a stacked area graph 
function transition_stack_area(data,svg,player, type){
    var y_scale = d3.scale.linear()
	.range([h-padding*2, 5]);
    var y_axis = d3.svg.axis()
	.scale(y_scale)
	.orient("left")
	.ticks(8);
    var stack = d3.layout.stack();
    var x_scale = d3.scale.linear()
	.range([padding*2,width-padding]);
    var x_axis = d3.svg.axis()
	.scale(x_scale)
	.orient("bottom")
	.tickFormat(d3.format("2f"))
	.tickValues(tick_values[player])
	.ticks(8);

    var stack_area = d3.svg.area()
	.x(function(d) { 
	    return x_scale(d.x); })
	.y0(function(d) { return y_scale(d.y0); })
	.y1(function(d) { return y_scale(d.y + d.y0); });
  

    // we need to manipulate the data to use the d3 stack method
    var data_domain = get_data(data,player,type);
    data = stack(data_domain[0]);
    y_scale.domain(data_domain[1]);
    y_axis.tickFormat(data_domain[2]);
    x_scale.domain([0,d3.max(data[0],function(d){return d.x})]);
    
    // Transition the area graph
    var paths = svg.selectAll(".areas")
	.data(data);
    paths.enter().append("path")
	.attr("fill","rgba(255,255,255,0)")
	.attr("class","areas")
	.attr("d",stack_area)
	.transition()
	.duration(duration)
	.attr("fill",function(d,i){
	    return colors[player][i]})
	.attr("opacity",1);
    paths.transition()
    	.duration(duration)
    	.attr("d",stack_area)
    	.attr("fill",function(d,i){
    	    return colors[player][i]})
    	.attr("opacity",1);

    // Remove the rects if necessary
    svg.selectAll("rect")
	.data([])
	.exit().transition()
	.duration(duration)
	.attr("width",0)
	.attr("height",0)
	.remove();

    // Enter the axis labels
    axis_labels(svg,type);

    // Transition the x and y axis if necessary
    var x_element = svg.selectAll(".x_axis")
	.data([1]);
    x_element.enter().append("g")
    	.attr("class", function (d) {
	    return "x_axis"})
	.attr("transform", "translate(0," + (h - 2*padding) + ")")
	.call(x_axis);
    x_element.transition().duration(duration)
    	.call(x_axis);

    var y_element = svg.selectAll(".y_axis")
	.data([1]);
    y_element.enter().append("g")
    	.attr("class", "y_axis")
    	.attr("transform", "translate(" + padding*2 + ",0)")
    	.call(y_axis);
    y_element.transition().duration(duration)
    	.call(y_axis);
}

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
