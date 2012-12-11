var w = 960;
var h = 600;
var padding = 40;

var albers = d3.geo.albers()
    .scale(1000)
    .origin([-87.63073,41.836084]);
    // .translate([200,400]);

var azimuthal = d3.geo.azimuthal()
    .scale(1000)
    .origin([-87.63073,41.836084]);

var path = d3.geo.path().projection(albers);

var vis = d3.select("#main_container")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

var color_scale = d3.scale.linear()
    .domain([0,50,100])
    .range(['red','purple','blue']);

var mapper = vis.selectAll("path")
    .data(election.features);

mapper.enter().append("path")
    .attr('fill',function (d){
	return color_scale(parseFloat(d.properties.percent));
    })
    .attr("d", path)

mapper.transition()
    .delay(1000)
    .duration(2500)
    .attr('fill', 'red')// function (d){
    // 	if (parseFloat(d.properties.percent) <= 50){
    // 	    return "red"
    // 	}
    // 	else{
    // 	    return "blue"
    // 	}
    // })
    .attr("stroke", "none");

    // .on("mouseover", function(d) {
    // 	console.log(d);
console.log(election.features);
