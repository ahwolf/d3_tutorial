var w = 960;
var h = 600;
var padding = 40;

var albers = d3.geo.albers()
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

vis.selectAll("path")
    .data(election.features)
    .enter().append("path")
    .attr('fill',function (d){
	return color_scale(parseFloat(d.properties.percent));
    })
    .attr("d", path);