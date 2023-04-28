function print_hello_world() {
  console.log("Hello world!");
}
// this is working because of the import in the html file
// https://socket.io/docs/v4/client -installation/#standalone -build
const socket = io();

socket.on("connect", () => {
  console.log("Connected to the webserver.");
});
socket.on("disconnect", () => {
  console.log("Disconnected from the webserver.");
});
socket.on("example_data", (obj) => {
  console.log(obj);
});

function getUniqueMinimumAges(dataFile) {
  console.log(typeof dataFile);
  console.log(dataFile);
}

function createBarChart(data) {
  // Set up the scales for the chart
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.minAge))
    .range([0, 400])
    .padding(0.1);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.frequency)])
    .range([350, 0]);

  // Set up the axes for the chart
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // Add the bars to the chart
  const svg = d3.select("svg");
  const bars = svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.minAge))
    .attr("y", (d) => yScale(d.frequency))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => 350 - yScale(d.frequency))
    .attr("fill", "steelblue");

  // Add the x-axis to the chart
  svg.append("g").attr("transform", "translate(0, 350)").call(xAxis);

  // Add the y-axis to the chart
  svg.append("g").call(yAxis);
}

function createBarChart2(dataFile) {
  // socket.emit("get_data", string);

  // Define the dimensions and margins of the chart
  const margin = { top: 20, right: 20, bottom: 50, left: 50 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Append the SVG element to the body of the page
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Load the data from the JSON file
  d3.json(dataFile).then(function (data) {
    // Define the x and y scales and axes
    const xScale = d3.scaleBand().range([0, width]).padding(0.1);
    const yScale = d3.scaleLinear().range([height, 0]);
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Map the data to the x and y domains
    xScale.domain(data.map((d) => d.variable1));
    yScale.domain([0, d3.max(data, (d) => d.variable2)]);

    // Append the x and y axes to the chart
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");
    svg.append("g").call(yAxis);

    // Append the bars to the chart
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.variable1))
      .attr("y", (d) => yScale(d.variable2))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.variable2))
      .attr("fill", "steelblue");
  });
}

function request_example_data(string) {
  socket.emit("get_data", null);
}
function getBoardGameData() {
  socket.emit("get_data", "boardgames_40");
}

socket.on("receiveData", (data) => {
  console.log(data);
  createBarChart(data);
});
