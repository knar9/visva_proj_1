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
    centroid_index: datapoint.centroid_index  
  }));
}

function createArcDiagram(data){

console.log(data.nodes)
// set the dimensions and margins of the graph
var margin = {top: 0, right: 30, bottom: 50, left: 60},
  width = 900 - margin.left - margin.right,
  height = 550 - margin.top - margin.bottom;

// append the svg object to the body of the page

var svg = d3.select("#arcdiagram")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
  // Read data


// List of node names
var allNodes = data.nodes.map(function(d){return d.title})

// List of groups
var allGroups = data.nodes.map(function(d){return d.grp})
allGroups = [...new Set(allGroups)]

// A color scale for groups:
var color = d3.scaleOrdinal()
  .domain(allGroups)
  .range(d3.schemeSet3);

// A linear scale for node size
var size = d3.scaleLinear()
  .domain([1,10])
  .range([2,10]);

// A linear scale to position the nodes on the X axis
var x = d3.scalePoint()
  .range([0, width])
  .domain(allNodes)

// In my input data, links are provided between nodes -id-, NOT between node names.
// So I have to do a link between this id and the name
var idToNode = {};
data.nodes.forEach(function (n) {
  idToNode[n.id] = n;
});

// Add the links
var links = svg
  .selectAll('mylinks')
  .data(data.links)
  .enter()
  .append('path')
  .attr('d', function (d) {
    start = x(idToNode[d.source].title)    // X position of start node on the X axis
    end = x(idToNode[d.target].title)      // X position of end node
    return ['M', start, height-30,    // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
      'A',                            // This means we're gonna build an elliptical arc
      (start - end)/2, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
      (start - end)/2, 0, 0, ',',
      start < end ? 1 : 0, end, ',', height-30] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
      .join(' ');
  })
  .style("fill", "none")
  .attr("stroke", "grey")
  .style("stroke-width", 1)

// Add the circle for the nodes
var nodes = svg
  .selectAll("mynodes")
  .data(data.nodes.sort(function(a,b) { return +b.n - +a.n }))
  .enter()
  .append("circle")
    .attr("cx", function(d){ return(x(d.title))})
    .attr("cy", height-30)
    .attr("r", function(){ return(size(5))})
    .style("fill", function(d){ return color(d.grp)})
    .attr("stroke", "white")

// And give them a label
var labels = svg
  .selectAll("mylabels")
  .data(data.nodes)
  .enter()
  .append("text")
    .attr("x", 0)
    .attr("y", 0)
    .text(function(d){ return(d.title)} )
    .style("text-anchor", "end")
    .attr("transform", function(d){ return( "translate(" + (x(d.title)) + "," + (height-15) + ")rotate(-45)")})
    .style("font-size", 6)

// Add the highlighting functionality
nodes
  .on('mouseover', function (d) {
    // Highlight the nodes: every node is green except of him
    nodes
      .style('opacity', .2)
    d3.select(this)
      .style('opacity', 1)
    // Highlight the connections
    links
      .style('stroke', function (link_d) { return link_d.source === d.srcElement.__data__.id ? color(d.srcElement.__data__.grp) : '#b8b8b8';})
      .style('stroke-opacity', function (link_d) { return link_d.source === d.srcElement.__data__.id ? 1 : .2;})
      .style('stroke-width', function (link_d) { return link_d.source === d.srcElement.__data__.id ? 4 : 1;})
    labels
      .style("font-size", function(label_d){ return label_d.title === d.srcElement.__data__.title ? 16 : 2 } )
      .attr("y", function(label_d){ return label_d.title === d.srcElement.__data__.title ? 10 : 0 } )

  })
  .on('mouseout', function (d) {
    nodes.style('opacity', 1)
    links
      .style('stroke', 'grey')
      .style('stroke-opacity', .8)
      .style('stroke-width', '1')
    labels
      .style("font-size", 6 )

  })
  .on('click', function (d) {

    var clickedNode = d.srcElement.__data__;
    console.log(clickedNode)
    console.log(data.links)

    let sourceID = clickedNode.id
    var linkedTargetIDs = data.links
      .filter(function(link) {
        return link.source === sourceID;
      })
      .map(function(link) {
        return link.target;
      });

    linkedTargetIDs.push(sourceID)

    console.log("Linked Target IDs:", linkedTargetIDs);
    obj = "boardgames_100"

    getScatterPlotData(obj, linkedTargetIDs)
 })
}

function createBoardgamesData(obj){
  console.log(obj)
  return obj
}

function createScatterplot(obj, IDs) {
  console.log("----------")
  console.log(IDs)
  console.log("----------")
  console.log(obj)
  console.log("----------")

  var filteredData = obj.filter(function(o) {
    return IDs.includes(o.id);
  });
  console.log(filteredData)
  console.log("----------")

  let dataset = [];
  let datatuple = [];
  let temp = 0;
  for (let i = 0; i < filteredData.length; i++) {
    //datatuple.push((obj[i].minplaytime + obj[i].maxplaytime) / 2);
    for (let j = 0; j < filteredData[i].types.categories.length; j++)  {
      for (let k = 0; k < cats.length; k++) {
        //console.log(obj[i].types.categories[j].name)
        if(filteredData[i].types.categories[j].name === cats[k]) {
          //datatuple.push(k + Math.random());
          datatuple.push(k);
          datatuple.push(filteredData[i].rating.rating);
          datatuple.push(0);
          dataset.push(datatuple);
          datatuple = [];
        }
      }   
    } 
  }
  let test = dataset.map(({ 0: x, 1: y, 2: centroid_index }) => ({ x, y: y*50, centroid_index}));
  test = transformDatapoints(test);

  //let test1 = kmeansAlgo(test, 1);
  //console.log(test1);
  let test1 = test;

  test1 = test1.map(({x, y, centroid_index }) => ({ x, y: y/50, centroid_index}))

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

function getArcDiagramData() {
  socket.emit("getArcDiagramData");
}

function getBarChartData() {
  socket.emit("getBarChartData", "boardgames_100");
}

function getScatterPlotData(obj, IDs) {
  plotted = true;
    socket.emit("getScatterPlotData", obj, IDs);
}

function getBoardgamesData(obj) {
    socket.emit("getBoardgamesData", obj);
}

socket.on("receiveBoardgamesData", (data) => {
  createBoardgamesData(data);
});

socket.on("receiveScatterPlotData", (data, IDs) => {
  createScatterplot(data, IDs);
});

socket.on("receiveArcDiagramData", (data) => {
  createArcDiagram(data);
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
