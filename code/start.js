var data_length = 30;
var data = [];
for (var i = 0; i < data_length; i++) {
    var newNumber = Math.floor(Math.random() * 50);
    data.push(newNumber);

}


// var data = [1,3,5,7,25,29,50,2,34,25,67,
//     21,1,56,43,4,2,6,87,5,67,21,1,56,43,4,2,6,87,5,67];

var width = 500;
var height = 500;
var bar_padding = 2;
var padding = 20;

var our_svg = d3.select("#main_container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);



var color_scale = d3.scale.linear()
// .domain([0,100])
.domain(d3.extent(data))
    .range(["red", "blue"]);

var xScale = d3.scale.ordinal()
    .domain(d3.range(data.length))
    .rangeRoundBands([padding, width], .1);

var yScale = d3.scale.ordinal()
    .domain(d3.extent(data))
    .range([100,0]);


var xAxis = d3.svg.axis()
              .scale(xScale)
              .orient("bottom")
              .ticks(5); 

var yAxis = d3.svg.axis()
              .scale(yScale)
              .orient("left")
              .ticks(5); 

our_svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(0,101)")
       .call(xAxis);

our_svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate("+ padding+",0)")
       .call(yAxis);


var rects = our_svg.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("x", function(d, i) {
    return xScale(i); //*(width / data.length);
})
    .attr("y", function(d) {
    return 100 - d
})
    .attr("width", xScale.rangeBand())
    .attr("height", function(d) {
    return d
})
    .attr("fill", function(d) {
    return color_scale(d)
})
    // .on("mouseover",function(d){
    //     console.log("Moused over!", this);
    //     d3.select("#tooltip").classed("hidden", false);
    // })
    // .on("mousemove", function(d){
    //     console.log("moved mouse!");
    //     var coordinates = d3.mouse(this);
    //     d3.select("#tooltip")
    //     .style("left", coordinates[0] + 10)
    //     .style("top", coordinates[1] - 10)
    //     .select("#value")
    //     .text(d)
    // })
    // .on("mouseout",function(d){
    //     d3.select("#tooltip").classed("hidden", true);
    // });



var texts = our_svg.selectAll("text")
    .data(data)
    .enter().append("text")
    .attr("x", function(d, i) {
    return xScale(i) + xScale.rangeBand() / 2;
})
    .attr("y", function(d) {
    return 100 - d + 10
})
    .text(function(d) {
    return d;
})
    .attr("class", "rect_label");
// .attr("font-family","sans serif")
// .attr("font-size","10px")
// .attr("fill", "white")
// .attr("text-anchor","middle");

function click_button() {
    var data_length = 30;
    var data = [];
    for (var i = 0; i < data_length; i++) {
        var newNumber = Math.floor(Math.random() * 50);
        data.push(newNumber);
        console.log(data, newNumber);
    }

    var duration_time = 2000
    our_svg.selectAll("rect")
        .data(data)
        .transition()
        .duration(duration_time)
        .ease("back")
        .attr("x", function(d, i) {
                    return xScale(i); //*(width / data.length);
              })
        .attr("y", function(d) {
                    return 100 - d
              })
        .attr("width", xScale.rangeBand())
        .attr("height", function(d) {
                    return d
        })
        .attr("fill", function(d) {
        return color_scale(d)
    });

    our_svg.selectAll(".rect_label")
           .data(data)
           .transition()
           .delay(duration_time)
           .duration(duration_time)
           .attr("x", function(d, i) {
              return xScale(i) + xScale.rangeBand() / 2;
            })
          .attr("y", function(d) {
            return 100 - d + 10
          })
          .text(function(d) {
            return d;
          });

}
