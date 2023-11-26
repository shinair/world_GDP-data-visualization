var s_margin = { top: 40, right: 150, bottom: 60, left: 30 };
const s_width = 600;
s_height = 510 - s_margin.top - s_margin.bottom;

var scatter_svg = d3.select("#scatter_plot")
    .append("svg")
    .attr("width", s_width + s_margin.left + s_margin.right)
    .attr("height", s_height + s_margin.top + s_margin.bottom)
    .append("g")
    .attr("transform", "translate(" + s_margin.left + "," + s_margin.top + ")");

//Read the data
d3.csv("banque_mondiale.csv").then(function (data) {

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, 1.2237700479375e+13])
        .range([0, s_width]);
    var xAxis = scatter_svg.append("g")
        .attr("transform", "translate(0," + s_height + ")")
        .call(d3.axisBottom(x).ticks(8));

    //Add X axis label
    scatter_svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", s_width)
        .attr("y", s_height + 50)
        .text("Gdp");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([50, 90])
        .range([s_height, 0]);
    scatter_svg.append("g")
        .call(d3.axisLeft(y));

    //Add Y axis label
    scatter_svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", -20)
        .text("Life expectancy")
        .attr("text-anchor", "start")

    var clip = scatter_svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", 900)
        .attr("height", s_height)
        .attr("x", 0)
        .attr("y", 0);

    var color = d3.scaleOrdinal()
        .domain(["Asia", "Europe", "South_America", "North_America", "Africa", "Oceania"])
        .range(["#c51b8a", "#31a354", "#0000FF", "#8856a7", "#eb5809", "#fde725"]);

    // Add brushing
    var brush = d3.brushX()
        .extent([[0, 0], [s_width, s_height]])
        .on("end", updateChart);

    // Create the scatter variable: where both the circles and the brush take place
    var scatter = scatter_svg.append('g')
        .attr("clip-path", "url(#clip)")

    // Add circles
    scatter
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.gdp); })
        .attr("cy", function (d) { return y(d.life_expectancy); })
        .attr("r", 8)
        .style("fill", function (d) { return color(d.continent) })
        .style("opacity", 0.8)

    // Add the brushing
    scatter
        .append("g")
        .attr("class", "brush")
        .call(brush);

    // A function that set idleTimeOut to null
    var idleTimeout
    function idled() { idleTimeout = null; }

    function updateChart(event) {

        extent = event.selection;

        // If no selection, back to initial coordinate. Otherwise, update X axis domain
        if (!extent) {
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350);
            x.domain([0, 1.2237700479375e+13]);
            x.range([0, s_width]);
        } else {
            x.domain([x.invert(extent[0]), x.invert(extent[1])]);
            scatter.select(".brush").call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
        }

        // Update axis and circle position
        xAxis.transition().duration(1000).call(d3.axisBottom(x));
        scatter
            .selectAll("circle")
            .transition().duration(1000)
            .attr("cx", function (d) { return x(d.gdp); })
            .attr("cy", function (d) { return y(d.life_expectancy); });
    }
    ///Add legends



    // Define the data for the legend
    var legendData = ["Asia", "Europe", "South_America", "North_America", "Africa", "Oceania"];

    // Define the color scale for the legend
    var colorScale = d3.scaleOrdinal()
        .domain(legendData)
        .range(["#c51b8a", "#31a354", "#0000FF", "#8856a7", "#eb5809", "#fde725"]);

    //Defining the legend
    var legend = scatter_svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", 680)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", 675)
        .attr("y", 10)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) { return d; });

})