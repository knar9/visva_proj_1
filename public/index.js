// this is working because of the import in the html file
// https://socket.io/docs/v4/client -installation/#standalone -build
const socket = io();

socket.on("connect", () => {
  console.log("Connected to the webserver.");
});
socket.on("disconnect", () => {
  console.log("Disconnected from the webserver.");
});


const cats = ['Abstract Strategy', 'Action / Dexterity', 'Adventure', 'American West', 'Ancient', 'Animals', 'Arabian', 'Bluffing', 
  'Card Game', 'City Building', 'Civil War', 'Civilization', 'Collectible Components', 'Comic Book / Strip', 'Deduction', 'Dice', 
  'Economic', 'Educational', 'Environmental', 'Exploration', 'Fantasy', 'Farming', 'Fighting', 'Horror', 'Industry / Manufacturing', 
  'Mature / Adult', 'Medical', 'Medieval', 'Miniatures', 'Modern Warfare', 'Movies / TV / Radio theme', 'Murder/Mystery', 'Mythology', 
  'Nautical', 'Negotiation', 'Novel-based', 'Pirates', 'Political', 'Post-Napoleonic', 'Prehistoric', 'Puzzle', 'Religious', 'Renaissance', 
  'Science Fiction', 'Space Exploration', 'Spies/Secret Agents', 'Territory Building', 'Transportation', 'Travel', 'Video Game Theme', 'Wargame']

function getCat() {
  var x = document.getElementById("catNumber").value;
  document.getElementById("giveCat").innerHTML = cats[x];
}

function transformDatapoints(datapoints) {
  return datapoints.map(datapoint => ({
    x: datapoint.x,  
    y: datapoint.y, 
    centroid_index: 0  
  }));
}

function createScatterplot(obj) {
  let dataset = [];
  let datatuple = [];
  let temp = 0;
  for (let i = 0; i < 100; i++) {
    //datatuple.push((obj[i].minplaytime + obj[i].maxplaytime) / 2);
    for (let j = 0; j < obj[i].types.categories.length; j++)  {
      for (let k = 0; k < cats.length; k++) {
        //console.log(obj[i].types.categories[j].name)
        if(obj[i].types.categories[j].name === cats[k]) {
          datatuple.push(k + Math.random());
          datatuple.push(obj[i].rating.rating);
          dataset.push(datatuple);
          datatuple = [];
        }
      }   
    } 
  }


  let test = dataset.map(({ 0: x, 1: y }) => ({ x, y : 50*y}));
  test = transformDatapoints(test);

  let test1 = kmeansAlgo(test, 3);
  console.log(test1);

  var margin = { top: 60, right: 60, bottom: 60, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  d3.select("#scatterplot > svg").remove();
  var svg = d3
    .select("#scatterplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(responsivefy)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -30)
    .attr("text-anchor", "middle")
    .style("font-family", "Helvetica")
    .style("font-size", 20)
    .text("Scatter Plot");

  // Add X axis
  var x = d3.scaleLinear().domain([0, 51]).range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear().domain([380, 430]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // X label
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .style("font-family", "Helvetica")
    .style("font-size", 14)
    .text("Average Game Length");

  // Y label
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(-40," + height / 2 + ")rotate(-90)")
    .style("font-family", "Helvetica")
    .style("font-size", 14)
    .text("Rating");

  // Add dots
  svg
    .append("g")
    .selectAll("dot")
    .data(test1)
    .enter()
    .append("circle")
    .attr("cx", (d) => {
      return x(d.x);
    })
    .attr("cy", (d) => {
      return y(d.y);
    })
    .attr("r", 2)
    .style("fill", (d) => {
      if (d.centroid_index === 0) {
        return "#FF0000";
      } else if (d.centroid_index === 1) {
        return "#FFA500";
      } else if (d.centroid_index === 2) {
        return "#FFFF00";
      } else if (d.centroid_index === 3) {
        return "#00FF00";
      } else if (d.centroid_index === 4) {
        return "#00FFFF";
      } else if (d.centroid_index === 5) {
        return "#0000FF";
      } else if (d.centroid_index === 6) {
        return "#FF00FF";
      } else if (d.centroid_index === 7) {
        return "#800080";
      } else if (d.centroid_index === 8) {
        return "#FFD700";
      } else {
        return "#00FF7F";
      }
    });

  document.getElementById('inputField').style.display = "block";
}

function getUniqueMinimumAges(dataFile) {
  console.log(typeof dataFile);
  console.log(dataFile);
}

function createBarChart(original_data) {
  var dict = {};

  for (i = 0; i < original_data.length; i++) {
    // json_data[i]["minage"];
    var currentEntry = original_data[i]["minage"];
    if (dict[currentEntry] === undefined) {
      dict[currentEntry] = 1;
    } else {
      dict[currentEntry] = dict[currentEntry] + 1;
    }
  }
  var data = [];
  for (const [key, value] of Object.entries(dict)) {
    data.push({ minAge: key, frequency: value });
  }
  console.log(data);

  var margin = { top: 60, right: 60, bottom: 60, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // Add the bars to the chart
  d3.select("#barchart-plot > svg").remove();
  var svg = d3
    .select("#barchart-plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(responsivefy)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  // Title for Barchart
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -30)
    .attr("text-anchor", "middle")
    .style("font-family", "Helvetica")
    .style("font-size", 20)
    .text("Bar Chart");

  // Add X axis 
  var x = d3
    .scaleBand()
    .domain(data.map((d) => d.minAge))
    .range([0, width])
    .padding(0.2);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear().domain([0, 40]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // X label
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .style("font-family", "Helvetica")
    .style("font-size", 14)
    .text("Minimum Age");

  // Y label
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(-40," + width / 2 + ")rotate(-90)")
    .style("font-family", "Helvetica")
    .style("font-size", 14)
    .text("Frequency");

  // Show the bars
  svg
  .selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", (d) => x(d.minAge))
  .attr("y", (d) => y(d.frequency))
  .attr("width", x.bandwidth())
  .attr("height", (d) => height - y(d.frequency))
  .attr("fill", "steelblue");
}

function getScatterPlotData() {
  socket.emit("getScatterPlotData", "boardgames_100");
}
function getBarChartData() {
  socket.emit("getBarChartData", "boardgames_100");
}

socket.on("receiveScatterPlotData", (data) => {
  createScatterplot(data);
});

socket.on("receiveBarchartData", (data) => {
  createBarChart(data);
});

function responsivefy(svg) {
  const container = d3.select(svg.node().parentNode),
    width = parseInt(svg.style("width"), 10),
    height = parseInt(svg.style("height"), 10),
    aspect = width / height;

  svg
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMinYMid")
    .call(resize);

  d3.select(window).on("resize." + container.attr("id"), resize);

  function resize() {
    const w = parseInt(container.style("width"));
    svg.attr("width", w);
    svg.attr("height", Math.round(w / aspect));
  }
}
