
// this is working because of the import in the html file
// https://socket.io/docs/v4/client -installation/#standalone -build
const socket = io()

socket.on("connect", () => {
  console.log("Connected to the webserver.")
})
socket.on("disconnect", () => {
  console.log("Disconnected from the webserver.")
})
socket.on("example_data", (obj) => {
  let dataset = []
  let datatuple = []
  for(let i = 0; i<40; i++) {
    datatuple.push((obj[i].minplaytime + obj[i].maxplaytime) / 2)
    datatuple.push(obj[i].rating.rating)
    if(datatuple[0] <= 180){
      dataset.push(datatuple)
    }
    datatuple = []
  } 

  var margin = {top: 60, right: 60, bottom: 60, left: 60},
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  d3.select("svg").remove();
  var svg = d3.select("#my_dataviz")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .call(responsivefy)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                
  // Title
  svg.append('text')
    .attr('x', width/2 )
    .attr('y', -30)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Helvetica')
    .style('font-size', 20)
    .text('Scatter Plot');

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 180])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([7.9, 8.7])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));


  // X label
  svg.append('text')
    .attr('x', width/2 )
    .attr('y', height + 40)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Helvetica')
    .style('font-size', 14)
    .text('Average Game Length');

  // Y label
  svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(-40,' + (height/2  )+  ')rotate(-90)')
    .style('font-family', 'Helvetica')
    .style('font-size', 14)
    .text('Rating');

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", (d) => { return x(d[0]); } )
    .attr("cy", (d) => { return y(d[1]); } )
    .attr("r", 4)
    .style("fill", (d) => { 
      return d[0] >= 20 && d[0] < 40 ? '#ade8f4'
        : d[0] >= 40 && d[0] < 60 ? '#90e0ef'
        : d[0] >= 60 && d[0] < 80 ? '#48cae4'
        : d[0] >= 80 && d[0] < 100 ? '#00b4d8'
        : d[0] >= 100 && d[0] < 120 ? '#0096c7'
        : d[0] >= 120 && d[0] < 140 ? '#0077b6'
        : d[0] >= 140 && d[0] < 160 ? '#023e8a'
        : d[0] >= 160 && d[0] < 180 ? '#03045e' 
        : '#03045e'
    })

})

function request_example_data(string) {
  socket.emit("get_data", string)
}

function responsivefy(svg) {
  const container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style('width'), 10),
      height = parseInt(svg.style('height'), 10),
      aspect = width / height;

  svg.attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMinYMid')
      .call(resize);
 
  d3.select(window).on(
      'resize.' + container.attr('id'), 
      resize
  );
 
  function resize() {
      const w = parseInt(container.style('width'));
      svg.attr('width', w);
      svg.attr('height', Math.round(w / aspect));
  }
}