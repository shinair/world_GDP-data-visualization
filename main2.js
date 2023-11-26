// Choropleth Map
const width = document.getElementById("map").clientWidth;
const height = 480;
const colorScale = d3.scaleSequential(d3.interpolateYlGnBu);

const svg = d3.select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const projection = d3.geoNaturalEarth1()
  .scale(width / (2 * Math.PI))
  .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

// Line Graph
const margin = { top: 20, right: 30, bottom: 30, left: 40 };
const graphWidth = width - margin.left - margin.right;
const graphHeight = 480 - margin.top - margin.bottom

const xScale = d3.scaleLinear().range([0, graphWidth]);
const yScale = d3.scaleLinear().range([graphHeight, 0]);

const xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"));
const yAxis = d3.axisLeft().scale(yScale);

// Add a tooltip div
const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px")
  .style("opacity", 0);

const graphSvg = d3.select("#line-graph")
  .append("svg")
  .attr("width", graphWidth + margin.left + margin.right)
  .attr("height", graphHeight + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Add x-axis and y-axis labels
graphSvg.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${graphHeight})`)
  .call(xAxis)
  .append("text")
  .attr("x", graphWidth)
  .attr("y", -6)
  .attr("text-anchor", "end")
  .attr("fill", "black")
  .text("Year");

graphSvg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .attr("text-anchor", "end")
  .attr("fill", "black")
  .text("Annual percent change");

const line = d3.line()
  .x(d => xScale(d.year))
  .y(d => yScale(d.gdp));

const gdpMap = new Map();
const countrySelect = d3.select("#country-select");

const color = d3.scaleOrdinal(d3.schemeCategory10);

Promise.all([
  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
  d3.csv("world_gdp.csv")
]).then(([geoData, gdpData]) => {
  gdpData.forEach(d => {
    const country = d["Real GDP growth (Annual percent change)"];
    delete d["Real GDP growth (Annual percent change)"];
    const yearlyData = Object.entries(d).map(([year, gdp]) => ({ year: +year, gdp: +gdp }));
    gdpMap.set(country, yearlyData);
    countrySelect.append("option").text(country).attr("value", country);
  });

  const minValue = d3.min(gdpData, d => d3.min(Object.values(d), gdp => +gdp));
  const maxValue = d3.max(gdpData, d => d3.max(Object.values(d), gdp => +gdp));
  colorScale.domain([minValue, maxValue]);

  const year = 1980;
  updateMap(year, geoData);
  updateLineGraph(year, countrySelect.node().value);

  d3.select("#year-slider").on("input", function () {
    const selectedYear = +this.value;
    updateMap(selectedYear, geoData);
    updateLineGraph(selectedYear, countrySelect.node().value);
  });

  countrySelect.on("change", function () {
    graphSvg.selectAll(".line").remove(); // Clear previous line when changing the country
    updateLineGraph(+d3.select("#year-slider").node().value, this.value);
  });

  // Custom interpolator for the color scale
  function customInterpolator(t) {
    if (t < 0) {
      return "orange";
    } else {
      return d3.interpolateYlGnBu(t);
    }
  }

  // Add legend
  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + (width - 240) + "," + 20 + ")");

  const legendScale = d3.scaleLinear()
    .domain([minValue, maxValue])
    .range([0, 200]);

  legend.selectAll("rect")
    .data(colorScale.ticks(8))
    .enter().append("rect")
    .attr("width", 200 / 8)
    .attr("height", 8)
    .attr("x", (d, i) => i * 200 / 8)
    .attr("fill", d => colorScale(d));

  legend.call(d3.axisBottom(legendScale).tickSize(13).tickValues(colorScale.ticks(8)))
    .select(".domain")
    .remove();


});

function updateMap(year, geoData) {
  svg.selectAll("path")
    .data(geoData.features)
    .join("path")
    .attr("d", path)
    .attr("fill", d => {
      const gdpDataForCountry = gdpMap.get(d.properties.name);
      if (gdpDataForCountry) {
        const yearData = gdpDataForCountry.find(data => data.year === year);
        if (yearData) {
          return colorScale(yearData.gdp);
        }
        return "#ccc";
      }
      return "#ccc";
    });
}

function updateLineGraph(year, selectedCountry) {
  const gdpDataForCountry = gdpMap.get(selectedCountry);
  if (!gdpDataForCountry) return;

  xScale.domain(d3.extent(gdpDataForCountry, d => d.year));
  yScale.domain([d3.min(gdpDataForCountry, d => d.gdp), d3.max(gdpDataForCountry, d => d.gdp)]);

  // Update x-axis
  graphSvg.select(".x.axis").call(xAxis);

  // Update y-axis
  graphSvg.select(".y.axis").call(yAxis);

  // Update line
  graphSvg.selectAll(".line")
    .data([gdpDataForCountry.slice(0, gdpDataForCountry.findIndex(d => d.year === year) + 1)])
    .join("path")
    .attr("class", "line")
    .attr("d", line)
    .style("stroke", color(selectedCountry)) // Apply color to the line
    .style("fill", "none")
    .style("stroke-width", 2);

  // Update or create a vertical line
  const verticalLine = graphSvg.selectAll(".vertical-line")
    .data([year])
    .join("line")
    .attr("class", "vertical-line")
    .attr("x1", xScale(year))
    .attr("x2", xScale(year))
    .attr("y1", 0)
    .attr("y2", graphHeight)
    .attr("stroke", "red")
    .attr("stroke-width", 1);

  // Add a label to the vertical line showing the current year
  const yearLabel = graphSvg.selectAll(".year-label")
    .data([year])
    .join("text")
    .attr("class", "year-label")
    .attr("x", xScale(year) - 20)
    .attr("y", graphHeight - 5)
    .attr("fill", "red")
    .text(year);
}


