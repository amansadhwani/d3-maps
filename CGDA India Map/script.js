var width = 650,
    height = 550;
	
var svg;
var unitDataPromise = d3.json("data/unitDetails.json", ({unit, value}) => ({unit: unit, value : +value}));

var statePromise = d3.json("topojson/india_states.json");
//var districtPromise = d3.json("topojson/india_district.json"); 
districtPromise = Promise.resolve('{}');
//var talukaPromise = d3.json("topojson/india_taluk.json"); 
talukaPromise = Promise.resolve('{}');

Promise.all([unitDataPromise, statePromise, districtPromise, talukaPromise])
    .then(function(india){
        console.log(india[1]);
        
        unit_data = india[0];
        
        states = topojson.feature(india[1], india[1].objects.india_states)
       
		
		
		svg = d3.select(".d3chart").append("svg")
        .attr("width", width)
        .attr("height", height);
		var projection = d3.geoMercator()
            .translate([width / 2, height / 2]);
		var path = d3.geoPath()
              .projection(projection);
        
         var tooltip = d3.select("body").append("div") 
					.attr("class", "tooltip")       
					.style("opacity", 0);
		 var indiaFeature = {
                type: 'FeatureCollection',
                features: states
            };

            // Compute the feature bounds and centroid
            var bounds = d3.geoBounds(states),
                center = d3.geoCentroid(states);

            // Compute the angular distance between bound corners
            var distance = d3.geoDistance(bounds[0], bounds[1]),
                //scale = height / distance / Math.sqrt(2);
				scale = 800;
				//projection.scale(scale).center(center);
			var marks = [{long:74.2179, lat: 27.0238},{long: 76.2711, lat: 10.8505},{long: 70.1456, lat:24.0454},{long: 75.7139, lat: 19.7515},{long: 78.2932, lat: 34.2996},{long: 78.6569, lat: 22.9734}];

			
            var p=projection.scale(scale).center(center);
			
			
			projection.scale(scale).center(center);
		


        //Data for States
         svg.append("g")
            .attr("class", "states")
            .selectAll("path")
            .data(states.features)
            .enter().append("path")
                .attr("d", path) 
				 .on("mouseover", function(d) {    
            tooltip.transition()    
            .duration(200)    
            .style("opacity", .9);    
            tooltip.html(d.properties.NAME_1)  
            .style("left", (d3.event.pageX) + "px")   
            .style("top", (d3.event.pageY - 28) + "px");  
          })          
          .on("mouseout", function(d) {   
            tooltip.transition()    
            .duration(500)    
            .style("opacity", 0); 
          });

				    
	svg.selectAll(".mark")
    .data(marks)
    .enter()
	.append("image")
    .attr('class','mark')
    .attr('width', 20)
    .attr('height', 20)
   .attr("xlink:href",'./marker.png')
   .attr("transform", function(d) {return "translate(" + p([d.long,d.lat]) + ")";})
   
  
  
});





    