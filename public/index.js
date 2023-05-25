// this is working because of the import in the html file
// https://socket.io/docs/v4/client -installation/#standalone -build
const socket = io();

let plotted = false;
let changed = false;

socket.on("connect", () => {
  console.log("Connected to the webserver.");
});
socket.on("disconnect", () => {
  console.log("Disconnected from the webserver.");
});

var ldaParameters = new Set(
  ["year",
  "rank",
  "minplayers",
  "maxplayers",
  "minplaytime",
  "maxplaytime",
  "minage",
  "rating",]
)
var ldaOriginalDataCache = []

const cats = [
  "Abstract Strategy",
  "Action / Dexterity",
  "Adventure",
  "American West",
  "Ancient",
  "Animals",
  "Arabian",
  "Bluffing",
  "Card Game",
  "City Building",
  "Civil War",
  "Civilization",
  "Collectible Components",
  "Comic Book / Strip",
  "Deduction",
  "Dice",
  "Economic",
  "Educational",
  "Environmental",
  "Exploration",
  "Fantasy",
  "Farming",
  "Fighting",
  "Horror",
  "Industry / Manufacturing",
  "Mature / Adult",
  "Medical",
  "Medieval",
  "Miniatures",
  "Modern Warfare",
  "Movies / TV / Radio theme",
  "Murder/Mystery",
  "Mythology",
  "Nautical",
  "Negotiation",
  "Novel-based",
  "Pirates",
  "Political",
  "Post-Napoleonic",
  "Prehistoric",
  "Puzzle",
  "Religious",
  "Renaissance",
  "Science Fiction",
  "Space Exploration",
  "Spies/Secret Agents",
  "Territory Building",
  "Transportation",
  "Travel",
  "Video Game Theme",
  "Wargame",
];

function getCat() {
  var x = document.getElementById("catNumber").value;
  document.getElementById("giveCat").innerHTML = cats[x];
}

function transformDatapoints(datapoints) {
  return datapoints.map((datapoint) => ({
    x: datapoint.x,
    y: datapoint.y,
    centroid_index: datapoint.centroid_index,
  }));
}

function createScatterplot(obj) {
  let dataset = [];
  let datatuple = [];
  let temp = 0;
  for (let i = 0; i < obj.length; i++) {
    //datatuple.push((obj[i].minplaytime + obj[i].maxplaytime) / 2);
    for (let j = 0; j < obj[i].types.categories.length; j++) {
      for (let k = 0; k < cats.length; k++) {
        //console.log(obj[i].types.categories[j].name)
        if (obj[i].types.categories[j].name === cats[k]) {
          //datatuple.push(k + Math.random());
          datatuple.push(k);
          datatuple.push(obj[i].rating.rating);
          datatuple.push(0);
          dataset.push(datatuple);
          datatuple = [];
        }
      }
    }
  }
  let test = dataset.map(({ 0: x, 1: y, 2: centroid_index }) => ({
    x,
    y: y * 50,
    centroid_index,
  }));
  test = transformDatapoints(test);

  let test1 = kmeansAlgo(test, 5);
  //console.log(test1);

  test1 = test1.map(({ x, y, centroid_index }) => ({
    x,
    y: y / 50,
    centroid_index,
  }));

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
    .text("k-means");

  // Add X axis
  var x = d3.scaleLinear().domain([0, 51]).range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear().domain([7.65, 8.7]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // X label
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .style("font-family", "Helvetica")
    .style("font-size", 14)
    .text("categorys");

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

  document.getElementById("inputField").style.display = "block";
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


function createLDA(original_data) {  
  let preprocessedData = preprocess_data(original_data);
  // console.log(preprocessedData);

  let normalizedData = normalize_data(preprocessedData);
  // console.log(normalizedData);

  let reducedDimensionData = LDA(normalizedData, ldaParameters);

  var margin = { top: 60, right: 60, bottom: 60, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  d3.select("#lda-visualisation > svg").remove();
  var svg = d3
    .select("#lda-visualisation")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(responsivefy)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Title for LDA
  svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", -30)
  .attr("text-anchor", "middle")
  .style("font-family", "Helvetica")
  .style("font-size", 20)
  .text("LDA Visualization");

  console.log(reducedDimensionData.data.to2dArray);
  let temp = reducedDimensionData.data.to2dArray.map( (d) => {
    return {
      "x": d[0],
      "y": d[1]
    }
  })

  console.log("min", d3.min(temp, d=> d.x));
  console.log("max", d3.max(temp, d=> d.x));

  let Y = reducedDimensionData.data;
  // Add X axis
  var x = d3.scaleLinear().domain([ d3.min(temp, d=> d.x), d3.max(temp, d=> d.x)]).range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear().domain([d3.min(temp, d=> d.y), d3.max(temp, d=> d.y)]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  color = d3.scaleOrdinal(d3.schemeDark2)
  shape = d3.scaleOrdinal(d3.symbols.map(s => d3.symbol().size(20).type(s)()))
  const gs = svg.selectAll(".point")
    .data(Y)
    .enter()
    .append("g")
      .attr("class", "point")
      .attr("fill", "none")
      .attr("stroke", (d, i) => color(reducedDimensionData.classes[i]))

  gs.append("path")
    .attr("d", (d, i) => shape("circle"))

  svg.selectAll(".point")
    .data(Y)
    .attr("transform", (([px, py], i) => `translate(${x(px)}, ${y(py)})`))

  // Adding Legends
  const legend = svg.append("g")
  .attr("class", "legend")
  .attr("transform", "translate(" + (width + 20) + "," + (0) + ")");

  const categories = [...new Set(reducedDimensionData.classes)];

  const legendItems = legend.selectAll(".legend-item")
    .data(categories)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => "translate(0," + (i * 20) + ")");

  legendItems.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 5)
    .attr("fill", d => color(d));

  legendItems.append("text")
    .attr("x", 20)
    .attr("y", 5)
    .text(d => d);


}

function ldaParameterUpdate() {
  console.log("Params before:", ldaParameters);

  const yearOptionCheckbox = document.getElementById("year");
  if (yearOptionCheckbox.checked) {
    ldaParameters.add("year")
  } else {
    ldaParameters.delete("year")
  }

  const rankOptionCheckbox = document.getElementById("rank");
  if (rankOptionCheckbox.checked) {
    ldaParameters.add("rank")
  } else {
    ldaParameters.delete("rank")
  }

  const minplayersOptionCheckbox = document.getElementById("minplayers");
  if (minplayersOptionCheckbox.checked) {
    ldaParameters.add("minplayers")
  } else {
    ldaParameters.delete("minplayers")
  }

  const maxplayersOptionCheckbox = document.getElementById("maxplayers");
  if (maxplayersOptionCheckbox.checked) {
    ldaParameters.add("maxplayers")
  } else {
    ldaParameters.delete("maxplayers")
  }

  const minplaytimeOptionCheckbox = document.getElementById("minplaytime");
  if (minplaytimeOptionCheckbox.checked) {
    ldaParameters.add("minplaytime")
  } else {
    ldaParameters.delete("minplaytime")
  }

  const maxplaytimeOptionCheckbox = document.getElementById("maxplaytime");
  if (maxplaytimeOptionCheckbox.checked) {
    ldaParameters.add("maxplaytime")
  } else {
    ldaParameters.delete("maxplaytime")
  }

  const minageOptionCheckbox = document.getElementById("minage");
  if (minageOptionCheckbox.checked) {
    ldaParameters.add("minage")
  } else {
    ldaParameters.delete("minage")
  }

  const ratingOptionCheckbox = document.getElementById("rating");
  if (ratingOptionCheckbox.checked) {
    ldaParameters.add("rating")
  } else {
    ldaParameters.delete("rating")
  }

  console.log("Params after:", ldaParameters)
  console.log("With Cache:", ldaOriginalDataCache)

  createLDA(ldaOriginalDataCache);
}

function changeScatterPlotData() {
  if(plotted === true){
    if(changed === false){
      changed = true
      socket.emit("getScatterPlotData", "boardgames_40");
    }
    else {
      changed = false
    socket.emit("getScatterPlotData", "boardgames_100");
    }
  }
}

function getScatterPlotData() {
  plotted = true;
    socket.emit("getScatterPlotData", "boardgames_100");
}

function getBarChartData() {
  socket.emit("getBarChartData", "boardgames_100");
}
function getDataForLDA() {
  socket.emit("getDataForLDA", "boardgames_100");
}

socket.on("receiveScatterPlotData", (data) => {
  createScatterplot(data);
});

socket.on("receiveBarchartData", (data) => {
  createBarChart(data);
});

socket.on("receiveDataForLDA", (data) => {
  ldaOriginalDataCache = data;
  createLDA(data);
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
