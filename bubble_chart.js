var bmargin = { top: 40, right: 150, bottom: 60, left: 50 };
const bubbleChartWidth = 600;
bheight = 420 - bmargin.top - bmargin.bottom;
var bubble_svg = d3.select("#bubble_chart")
    .append("svg")
    .attr("width", "100%")
    .attr("height", bheight + bmargin.top + bmargin.bottom)
    .append("g")
    .attr("transform", "translate(" + bmargin.left + "," + bmargin.top + ")");
//Read the data
d3.csv("banque_mondiale.csv").then(function (data) {



    var x = d3.scaleLinear()
        .domain([0, 1.2237700479375e+13])
        .range([0, bubbleChartWidth]);

    bubble_svg.append("g")
        .attr("transform", "translate(0," + bheight + ")")
        .call(d3.axisBottom(x).ticks(7));

    bubble_svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", bubbleChartWidth)
        .attr("y", bheight + 50)
        .text("Gdp");

    var y = d3.scaleLinear()
        .domain([50, 90])
        .range([bheight, 0]);
    bubble_svg.append("g")
        .call(d3.axisLeft(y));

    bubble_svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", -20)
        .text("Life expectancy")
        .attr("text-anchor", "start")

    var z = d3.scaleSqrt()
        .domain([200000, 1310000000])
        .range([2, 30]);


    var myColor = d3.scaleOrdinal()
        .domain(["Asia", "Europe", "South_America", "North_America", "Africa", "Oceania"])
        .range(d3.schemeSet1);

    var tooltip = d3.select("#bubble_chart")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")


    var showTooltip = function (event, d) {
        tooltip
            .transition()
            .duration(200);

        const [x, y] = d3.pointer(event);

        tooltip
            .style("opacity", 1)
            .html("Country: " + d.country)
            .style("left", (x + 30) + "px")
            .style("top", (y + 30) + "px");
    };

    var moveTooltip = function (event, d) {
        const [x, y] = d3.pointer(event);

        tooltip
            .style("left", (x + 30) + "px")
            .style("top", (y + 30) + "px");
    };

    var hideTooltip = function (d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }


    var highlight = function (d) {
        d3.selectAll(".bubbles").style("opacity", .05)
        d3.selectAll("." + d).style("opacity", 1)
    }


    var noHighlight = function (d) {
        d3.selectAll(".bubbles").style("opacity", 1)
    }

    bubble_svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", function (d) { return "bubbles " + d.continent })
        .attr("cx", function (d) { return x(d.gdp); })
        .attr("cy", function (d) { return y(d.life_expectancy); })
        .attr("r", function (d) { return z(d.population); })
        .style("fill", function (d) { return myColor(d.continent); })

        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip)


    var valuesToShow = [10000000, 100000000, 1000000000]
    var xCircle = 400
    var xLabel = 450

    bubble_svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function (d) { return bheight - 100 - z(d) })
        .attr("r", function (d) { return z(d) })
        .style("fill", "none")
        .attr("stroke", "black")

    bubble_svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("line")
        .attr('x1', function (d) { return xCircle + z(d) })
        .attr('x2', xLabel)
        .attr('y1', function (d) { return bheight - 100 - z(d) })
        .attr('y2', function (d) { return bheight - 100 - z(d) })
        .attr('stroke', 'black')
        .style('stroke-dasharray', ('2,2'))

    bubble_svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("text")
        .attr('x', xLabel)
        .attr('y', function (d) { return bheight - 100 - z(d) })
        .text(function (d) { return d / 1000000 })
        .style("font-size", 10)
        .attr('alignment-baseline', 'middle')

    bubble_svg.append("text")

        .attr('x', xCircle)
        .attr("y", bheight - 100 + 30)
        .text("Population (M)")
        .attr("text-anchor", "middle")

    var size = 20

    var allgroups = ["Asia", "Europe", "South_America", "North_America", "Africa", "Oceania"]
    bubble_svg.selectAll("myrect")
        .data(allgroups)
        .enter()
        .append("circle")
        .attr("cx", 400)
        .attr("cy", function (d, i) { return 10 + i * (size + 6) })
        .attr("r", 7)
        .style("fill", function (d) { return myColor(d) })
        .on("mouseover", function (event, d) { highlight(d); })
        .on("mouseleave", function (event, d) { noHighlight(d); });

    bubble_svg.selectAll("mylabels")
        .data(allgroups)
        .enter()
        .append("text")
        .attr("x", 400 + size * .8)
        .attr("y", function (d, i) { return i * (size + 6) + (size / 2) })
        .style("fill", function (d) { return myColor(d) })
        .text(function (d) { return d })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", function (event, d) { highlight(d); })
        .on("mouseleave", function (event, d) { noHighlight(d); });
})