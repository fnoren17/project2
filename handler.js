var m_width = $("#map").width(),
        width = 938,
        height = 500,
        country,
        state;

d3.csv("data.csv", function(loadedRows) {
    var countryData = [];
    for (i = 0; i < loadedRows.length; i++ ){
        countryData.push(loadedRows[i].id);
    }
var projection = d3.geo.mercator()
        .scale(150)
        .translate([width / 2, height / 1.5]);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select("#map").append("svg")
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("width", m_width)
        .attr("height", m_width * height / width);

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", country_clicked);

    var g = svg.append("g");

d3.json("countries.topo.json", function(error, us) {
      g.append("g")
        .attr("id", "countries")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.countries).features)
        .enter()
        .append("path")
        .attr("id", function(d) { return d.id; })
        .attr("style", function(d){if(countryData.includes(d.id) == false){return "pointer-events:none";} })
        .style({"fill": function(d){ if(countryData.includes(d.id) == false){return "grey";}}, "pointer-events":function(d){ if(countryData.includes(d.id) == false){return "none";}}})
        .attr("d", path)
        .on("click", country_clicked)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);
    });

        function handleMouseOver(d) {
            d3.select(this).attr({
              fill: "#2c7"
            });
            svg.append("text")
            .attr("id", d.id)
            .attr("x", "50%")
            .attr("y", "50%")
            .text(d.properties.name); 
          }
            function handleMouseOut(d) {
            d3.select(this).attr({
              fill: "#2a3"
            });
           d3.select("text").remove();
          }
    function zoom(xyz) {
      g.transition()
        .duration(750)
        .attr("transform", "translate(" + projection.translate() + ")scale(" + xyz[2] + ")translate(-" + xyz[0] + ",-" + xyz[1] + ")")
        .selectAll(["#countries", "#states", "#cities"])
        .style("stroke-width", 1.0 / xyz[2] + "px")
        .selectAll(".city")
        .attr("d", path.pointRadius(20.0 / xyz[2]));
    }
    
    function get_xyz(d) {
      var bounds = path.bounds(d);
      var w_scale = (bounds[1][0] - bounds[0][0]) / width;
      var h_scale = (bounds[1][1] - bounds[0][1]) / height;
      var z = .96 / Math.max(w_scale, h_scale);
      var x = (bounds[1][0] + bounds[0][0]) / 2;
      var y = (bounds[1][1] + bounds[0][1]) / 2 + (height / z / 6);
      return [x, y, z];
    }

    function country_clicked(d) {
      state = null;

      if (country) {
        g.selectAll("#" + country.id).style('display', null);
      }

      if (d && country !== d) {
        d3.selectAll("path")
          .style({"visibility": function(a){
            if(a.id != d.id){
                return "hidden";
            }
        }});
          
        var xyz = get_xyz(d);
        country = d;
        zoom(xyz);
      } else {
        var xyz = [width / 2, height / 1.5, 1];
        country = null;
        zoom(xyz);
        d3.selectAll("path")
          .style({"visibility": "visible"});
      }
    }

    $(window).resize(function() {
      var w = $("#map").width();
      svg.attr("width", w);
      svg.attr("height", w * height / width);
    });
});