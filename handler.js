var m_width = $("#map").width(),
        width = 938,
        height = 500,
        country,
        state;

d3.csv("data/data3.csv", function(loadedRows) {
    var countryData = [];
    console.log(loadedRows);
    for (i = 0; i < loadedRows.length; i++ ){
        countryData.push(loadedRows[i].Country);
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
        .style({"fill": function(d){ 
            if(countryData.includes(d.properties.name) == false){
                return "grey";
            }
        }, "pointer-events":function(d){ 
                if(countryData.includes(d.properties.name) == false){
                    return "none";
                }
            }
        })
        .attr("d", path)
        .on("click", country_clicked)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);
    });

        function handleMouseOver(d) {
            d3.select(this).attr({
              fill: "#2c7"
            });

          }
            function handleMouseOut(d) {
            d3.select(this).attr({
              fill: "#2a3"
            });
           
          }
    
    function zoomed(country){
        d3.select("#textDiv")
        .style({"display": "block", "font-size": "30px", "font-weight": "bold"})
        .text(country.properties.name);
        
    d3.select("#countryDiv")
        .style("display", "block");

        
var width = 960;
var height = 900;
var radius = 50;
        // Importance in life Family
        d3.csv("data/data3.csv", function(d) {
            
            // strip out relevant fields
            var point = {};
            point.country = d.Country;
            point.very_important = +d["Very happy"];
            point.rather_important = +d["Quite happy"];
            point.not_very_important = +d["Not very happy"];
            point.not_at_all_important = +d["Not at all happy"];
            point.no_answer = d.NA;
            point.dont_know = d.DK;
            point.xpos = d.xpos;
            point.ypos = d.ypos;
            return point;
        }, function(error, data) {
            //console.log(country);
        
             //what country do you want to show?
            for(i = 0; i < data.length; i++){
                if(data[i].country == country.properties.name){
                    data = data[i];
                }
            }
           
            
            var dataset = [
                {label: "Very important", count: data.very_important},
                {label: "Rather Important", count: data.rather_important},
                {label: "Not very important", count: data.not_very_important},
                {label: "Not at all important", count: data.not_at_all_important},
                {label: "Dont know", count: data.dont_know},
                {label: "No answer", count: data.no_answer}
                
            ];
            
            //console.log(dataset)

            var width = 640;
            var height = 630;
            var margin = {top: 10, right: 10, bottom: 10, left: 10};
            var radius = 50;
            var donutWidth = 50;
            var legendRectSize = 20;                                  
            var legendSpacing = 8;                                    

            var color = d3.scale.ordinal()
              .range(["#c2f0f0", "#99e6e6", "#5cd6d6", "#2eb8b8", "#248f8f", "#196666"]);
            
            var svg = d3.select("#countryDiv")                                             //ÄNDRA CHART HÄR
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .append("g")
              .attr("transform", "translate(" + data.xpos + "," + data.ypos + ")");

            var arc = d3.svg.arc()
              .outerRadius(radius);

            var pie = d3.layout.pie()
              .value(function(d) { return d.count; })
              .sort(null);

            var path = svg.selectAll("path")
              .data(pie(dataset))
              .enter()
              .append("path")
              .attr("d", arc)
              .attr("fill", function(d) {
                return color(d.data.label);
              })
            .on("mouseover", function(d){
                d3.select(this).style("visibility", "hidden")
            })
            .on("mouseout", function(d){
                d3.select(this).style("visibility", "visible")
            });
            
            svg.append("text")
              .attr("x", -55)
              .attr("y", -85)
              .text("Importance in life: Family");                                                          //ÄNDRA LABEL HÄR
            
             var legend = svg.selectAll(".legend")                     
              .data(color.domain())                                   
              .enter()                                                
              .append("g")                                            
              .attr("class", "legend")                                
              .attr("transform", function(d, i) {                     
                var height = legendRectSize + legendSpacing;          
                var offset =  height * color.domain().length / 2;     
                var horz = 6 * legendRectSize;                       
                var vert = i * height - offset;                       
                return "translate(" + horz + "," + vert + ")";        
              });                                                     

            legend.append("rect")                                     
          .attr("width", legendRectSize)                          
              .attr("height", legendRectSize)                         
              .style("fill", color)                                   
              .style("stroke", color);                                

            legend.append("text")                                     
              .attr("x", legendRectSize + legendSpacing)              
              .attr("y", legendRectSize - legendSpacing)              
              .text(function(d) { return d; });                       

        });
        
    }
    
    function zoom(xyz, d) {
      g.transition()
        .duration(750)
        .attr("transform", "translate(" + projection.translate()  + ")scale(" + xyz[2] + ")translate(-" + xyz[0] + ",-" + xyz[1] + ")")
        .selectAll(["#countries", "#states", "#cities"])
        .style("stroke-width", 1.0 / xyz[2] + "px")
        .selectAll(".city")
        .attr("d", path.pointRadius(20.0 / xyz[2]));
        if(d){
            setTimeout(1500);
            zoomed(d);
            
        }
        
    }
    
    function get_xyz(d) {
      var bounds = path.bounds(d);
      var w_scale = (bounds[1][0] - bounds[0][0]) / width;
      var h_scale = (bounds[1][1] - bounds[0][1]) / height;
      var z = (.96 / Math.max(w_scale, h_scale))/2;
        
      var x = ((bounds[1][0] + bounds[0][0]) / 2) + (width / z / 3);
      var y = (bounds[1][1] + bounds[0][1]) / 2 + (height / z / 6);
      return [x, y, z];
    }

    function country_clicked(d) {
      state = null;
      if (country) {
        g.selectAll("#" + country.id).style("display", null);
      }

      if (d && country !== d) {
        var xyz = get_xyz(d);
        country = d;
        d3.selectAll("path")
          //.style({"visibility": "hidden"});
          .style({"visibility": function(a){
            if(a.id != d.id){
                return "hidden";
            } else{
                return "visible";
            }
        }});
        zoom(xyz,d);
      } else {
        var xyz = [width / 2, height / 1.5, 1];
        country = null;
        zoom(xyz);
        d3.selectAll("path")
          .style({"visibility": "visible"});
        d3.selectAll("#countryDiv")
          .style("display", "none")
        .select("svg").remove();
          d3.select("#textDiv").remove();
          //.style("display", "none");
          d3.selectAll(".pies").remove();
          
      }

 
    }

    $(window).resize(function() {
      var w = $("#map").width();
      svg.attr("width", w);
      svg.attr("height", w * height / width);
    });
});