// !! IMPORTANT README:

// You may add additional external JS and CSS as needed to complete the project, however the current external resource MUST remain in place for the tests to work. BABEL must also be left in place. 

/***********
INSTRUCTIONS:
  - Select the project you would 
    like to complete from the dropdown 
    menu.
  - Click the "RUN TESTS" button to
    run the tests against the blank 
    pen.
  - Click the "TESTS" button to see 
    the individual test cases. 
    (should all be failing at first)
  - Start coding! As you fulfill each
    test case, you will see them go   
    from red to green.
  - As you start to build out your 
    project, when tests are failing, 
    you should get helpful errors 
    along the way!
    ************/

// PLEASE NOTE: Adding global style rules using the * selector, or by adding rules to body {..} or html {..}, or to all elements within body or html, i.e. h1 {..}, has the potential to pollute the test suite's CSS. Try adding: * { color: red }, for a quick example!

// Once you have read the above messages, you can delete all comments. 

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

fetch(url)
  .then((response) => response.json())
  .then((data) => drawChart(data.data));

function drawChart(data) {
  const width = 800;
  const height = 400;
  const padding = 50;

  // Parse date strings into Date objects
  const parseDate = d3.timeParse("%Y-%m-%d");
  data.forEach((d) => (d[0] = parseDate(d[0])));

  // Define scales
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d[0]))
    .range([padding, width - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[1])])
    .range([height - padding, padding]);

  // Create SVG
  const svg = d3
    .select("#chart")
    .attr("width", width)
    .attr("height", height);

  // X-Axis
  const xAxis = d3.axisBottom(xScale);
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`)
    .call(xAxis);

  // Y-Axis
  const yAxis = d3.axisLeft(yScale);
  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);

  // Bars
  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d[0]))
    .attr("y", (d) => yScale(d[1]))
    .attr("width", (width - 2 * padding) / data.length - 1)
    .attr("height", (d) => height - padding - yScale(d[1]))
    .attr("data-date", (d) => d[0].toISOString().split("T")[0])
    .attr("data-gdp", (d) => d[1])
    .on("mouseover", function (event, d) {
      const tooltip = d3.select("#tooltip");
      tooltip
        .style("visibility", "visible")
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 20 + "px")
        .attr("data-date", d[0].toISOString().split("T")[0])
        .html(`<strong>Date:</strong> ${d[0].toISOString().split("T")[0]}<br>
               <strong>GDP:</strong> ${d[1]} Billion`);
    })
    .on("mouseout", function () {
      d3.select("#tooltip").style("visibility", "hidden");
    });
}
