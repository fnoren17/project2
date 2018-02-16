//    var svg = d3.select("svg"),
//    width = 200,
//    height = 200,
//    radius = Math.min(width, height) / 2,
//    
//    g = svg.append("g")
//    .attr("class", "countryData")
//    .attr("transform", "translate(" + width*4 + "," + height/2 +  ")");
//
//function color(n){
//    var colors = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];
//    return colors[n % colors.length];
//}
//
//var pie = d3.layout.pie()
//    .sort(null)
//    .value(function(d) { return d.Very_important; });
//
//var path = d3.svg.arc()
//    .outerRadius(radius - 10)
//    .innerRadius(0);
//
//var label = d3.svg.arc()
//    .outerRadius(radius - 40)
//    .innerRadius(radius - 40);
//
//d3.csv("data.csv", function(error, data) {
//  if (error) throw error;
//
//  var arc = g.selectAll(".arc")
//    .data(pie(data))
//    .enter().append("g")
//    .attr("class", "arc");
//
//  arc.append("path")
//      .attr("d", path)
//      .attr("fill", function(d, i) { return color(i); });
//
//  arc.append("text")
//      .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
//      .attr("dy", "0.35em")
//      .text(function(d) { return d.data.id; });
//});














// SVG variables
var svg = d3.select("#countryDiv").append("svg")
	.attr("width", width)
	.attr("height", height);
var g2 = svg.append("g"); // pie charts

// Projection variables
var projection = d3.geo.mercator()
				   .center([81,22])
				   .scale(800)
				   .translate([width/2,height/2]);
				   
var path = d3.geo.path().projection(projection);

// Pie chart variables:
var arc = d3.svg.arc()
			.innerRadius(0)
			.outerRadius(radius);

var pie = d3.layout.pie()
			.sort(null)
			.value(function(d) { return d; });
			
var color = d3.scale.category10();



// Draw pie charts,
d3.csv("data.csv", function(error, rows) {
	var points = g2.selectAll("g")
		.data(rows.filter(function(a){return a.id == d.properties.name}))
		.enter()
		.append("g")
		.attr("transform",function(d) {return "translate(" + d.posx + "," + d.posy + ")" })
		.attr("class","pies")
		
	points.append("text")
		.attr("y", -radius - 5)
		.text(function(d) { return d.id })
		.style('text-anchor','middle');
		
	var pies = points.selectAll(".pies")
		.data(function(d) { return pie(d.data.split(['-'])); })
		.enter()
		.append('g')
		.attr('class','arc');
	
	pies.append("path")
	  .attr('d',arc)
      .attr("fill",function(d,i){
           return color(i);     
      });
	
});