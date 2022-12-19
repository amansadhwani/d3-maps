var svg;



var width,height;
var jsonDirstrictnames=[];
var topojsonDistrictNames=[];


console.log('d3', d3.version);
var tooltip = d3.select("#data-tooltip-container")
                .append("div")
                .attr("id", "data-tooltip")
                .attr("class", "hide-data-tooltip")
                .text("Details here!")
    


var mystatename,url_for_district;
var statePromise,districtPromise,talukaPromise;

var unitDataPromise = d3.json("topojson/data/unitDetails.json", function(e,d){
        return d.value;
    });

Promise.all([unitDataPromise]) 

.then(function(india){
	unit_data = india[0];
	mystatename = unit_data.stateName;
	url_for_district="topojson/json/"+mystatename+".json";
	//console.log(url_for_district);
	
	 statePromise = Promise.resolve('{}');//d3.json("topojson/india_states.json");
	 districtPromise = d3.json(url_for_district); 
	 url_for_taluka="topojson/india_taluk.json";
	 talukaPromise = d3.json(url_for_taluka);
	 //talukaPromise = Promise.resolve('{}');//d3.json("topojson/india_taluk.json");
Promise.all([unitDataPromise, statePromise, districtPromise, talukaPromise])

    .then(function(india){
		
		unit_data = india[0];
		var selectedStateName = unit_data.stateName;
	
		width=550;
		height=550;
		
		const zoom = d3.zoom()
			.scaleExtent([1, 8])
			.on('zoom', zoomed);
		
        /************* Create svg ***************/
        svg = d3.select(".d3chart").append("svg")
        .attr("width", width)
        .attr("height", height);

        /************* Prepare projection ***************/
        
		  var projection = d3.geoMercator()
            .translate([width / 2, height / 2]);
			

		 
        var path = d3.geoPath()
              .projection(projection);
		
		
		
		
        
        /************* Consolidate data ***************/     
		
		
		
       
		
		var unit_data_map={};
		var unit_data_map_amount={}
		var unit_data_extract_data=unit_data["unitData"];
        var unit_data_values = unit_data_extract_data.map(function(unit_data_extract_data) { 
                unit_data_map[unit_data_extract_data.unit] = unit_data_extract_data.value;
				unit_data_map_amount[unit_data_extract_data.unit] = unit_data_extract_data.amount;
				jsonDirstrictnames.push(unit_data_extract_data.unit); // note here I am adding districts names 
                return unit_data_extract_data.value;
            });
        
		
		var dist_val=[... new Set(unit_data_values)]
		if (Object.keys(dist_val).length <=1)
			{
				dist_val.push(0)
			}  
		
		
		
        var minDomain = d3.min(dist_val);
		//minDomain=Math.round(minDomain);
        var maxDomain = d3.max(dist_val);
		//maxDomain=Math.round(maxDomain);
		
		var firstValue=1;
		var remainValues=Math.round((maxDomain-minDomain)/10);
		var storeValue=minDomain;
		
		
        
        
            
        /*************  Build color scale ***************/
       var linearHeatColor = d3.scaleLinear()
          .domain([minDomain,maxDomain])
          .range(["#FF9999", "#99FF99"])  
                
     var legendGroup = svg.append("g")
            .attr("class", "legend heatScale")
             
        legendGroup
            .selectAll("rect")
            .data([1,2,3,4,5,6,7,8,9,10])
            .enter().append("rect")
                .attr("class", "legend-unit")
                .attr("height", 10)
                .attr("x", 10)
                .attr("y",  d => d * 10)
                .attr("width", 10)
                //.attr("fill", d => color(d[0]));
                .style("fill", function(d, i) { 
                    return linearHeatColor(maxDomain * i / 10 )
                })
            .exit()
     
         legendGroup.selectAll("text")
            .data([1,2,3,4,5,6,7,8,9,10])
            .enter().append("text")
                .attr("class","legend-tick")
                .attr("x", 25)
                .attr("y", d => {
                    if(d == 10)
                        return ( d + 1) * 10 + 5;
                    else 
                        return ( d * 10 )+ 5;
                    })
                .text(function(d) {
					if(firstValue == 1){
						firstValue++;
						return minDomain;
					}
					else if( d % 2){
						storeValue+=(remainValues *2)
                        return Math.round(storeValue);
					}
                    else if(d == 10)
                        return maxDomain; 
                }); 
      
                
        /*************  Data for Districts ***************/ 
        districts = topojson.feature(india[2], india[2].objects.state)
		
		
		talukas = topojson.feature(india[3], india[3].objects.india_taluk)
        stateDistricts = districts.features.filter(function(d){
            return d.properties.State_Name == selectedStateName
        })
		var dis=["Anand","Kheda","Surat"]
		
		stateTalukas = talukas.features.filter(function(d){
            return dis.includes(d.properties.NAME_2);
        })
		console.log(stateTalukas);
		
		
		
		
		 var indiaFeature = {
                type: 'FeatureCollection',
                features: stateDistricts,stateTalukas
            };

            // Compute the feature bounds and centroid
            var bounds = d3.geoBounds(indiaFeature),
                center = d3.geoCentroid(indiaFeature);

            // Compute the angular distance between bound corners
            var distance = d3.geoDistance(bounds[0], bounds[1]),
                scale = height / distance / Math.sqrt(2);
				
			
			
			if(mystatename=="West Bengal"){
			scale=3000;
			}
			
			console.log(scale);
            // Update the projection scale and centroid
		
			/*var marks = [{long:69.8597, lat: 23.7337},{long: 70.6447, lat: 23.5710},{long: 70.1456, lat:24.0454}];*/

			
            var p=projection.scale(scale).center(center);
			
			
			projection.scale(scale).center(center);
			//var coordinates = p([69.8597,23.7337]);
			var coordinates = p([77.2580,28.7184]);
			
			 
			var coordinates1 = p([72.9933,22.9251]);
			
			
			console.log("start");
			console.log(projection.scale(scale).center(center));
			console.log("End");
	svg.call(zoom)
        svg.append("g")
            .attr("class", "districts")
            .selectAll("path")
			.data(stateDistricts)
			.enter().append("path")
			.attr("d", path)
			 .on('mouseover', function(d, i) {
                    //var currentPath = this;
                    //d3.select(this).attr("class", "darken");
                    //d3.select("#data-tooltip");
					var data,noData,stateName,amount;
					//amount=unit_data_map_amount[d.properties.Dist_Name];
						
                    data = unit_data_map[d.properties.Dist_Name];
					
				
					stateName=[d.properties.Dist_Name];
					
                    if(typeof data == 'undefined'){
                        noData = "Data is not Available for "+stateName;
						document.getElementById("data-tooltip").innerText = noData;
						return tooltip.attr("class","show-data-tooltip")
                    }
					else{
					
                    document.getElementById("data-tooltip").innerText = stateName+":"+data+"%" ;
					
                    return tooltip.attr("class","show-data-tooltip")
					}
                })
/*                 .on('mouseleave', function(d, i) {
                    //var currentPath = this;
                    //d3.select(this).attr("class", "darken");
                    return tooltip.attr("class","hide-data-tooltip")
                }) */
                .on('mouseout', function(d, i) {
                    //var currentPath = this;
                    //d3.select(this).attr("class", "darken");
                    document.getElementById("data-tooltip").innerText = "";
                    return tooltip.attr("class","hide-data-tooltip")
                });
			svg.call(zoom)	
		svg.append("g")
            .attr("class", "talukas")
            .selectAll("path")
			.data(stateTalukas)
			.enter().append("path")
             .attr("fill", function(d){
                        return linearHeatColor(unit_data_map[d.properties.NAME_3]);
                })
                .attr("d", path)
			.on('mouseover', function(d, i) {
                   
					var data,noData,stateName,amount;
					
						
                    data = unit_data_map[d.properties.NAME_3];
					
				
					stateName=[d.properties.NAME_3];
					
                    if(typeof data == 'undefined'){
                        noData = "Data is not Available for "+stateName;
						document.getElementById("data-tooltip").innerText = noData;
						return tooltip.attr("class","show-data-tooltip")
                    }
					else{
					
                    document.getElementById("data-tooltip").innerText = stateName+":"+data+"%" ;
					
                    return tooltip.attr("class","show-data-tooltip")
					}
                })

                .on('mouseout', function(d, i) {
                    
                    document.getElementById("data-tooltip").innerText = "";
                    return tooltip.attr("class","hide-data-tooltip")
                });
				
				
			
			
			
	/*svg.selectAll(".mark")
    .data(marks)
    .enter()
	
    .append("image")
    .attr('class','mark')
    .attr('width', 20)
    .attr('height', 20)
    //.attr("xlink:href",'https://cdn3.iconfinder.com/data/icons/softwaredemo/PNG/24x24/DrawingPin1_Blue.png')
	.attr("xlink:href",'./marker.png')
    //.attr("transform", d => `translate(${([d.long,d.lat])}`);
	.attr("transform", function(d) {return "translate(" + p([d.long,d.lat]) + ")";});
		svg.append("circle")
            .attr("cx", coordinates1[0])
            .attr("cy", coordinates1[1])
            .attr("r", 5)
            .style("fill", "#5FB333"); */
			
        /*************  Data for States ***************/
        
			function zoomed() {
      svg
        .selectAll('path') // To prevent stroke width from scaling
        .attr('transform', d3.event.transform);
    }
			


			
			//this for loop is to find weather district names are correct
				for(let i = 0; i < jsonDirstrictnames.length; i++){
    
					if(topojsonDistrictNames.indexOf(jsonDirstrictnames[i]) >=0){
        
						//console.log("found:"+jsonDirstrictnames[i]); do nothing
					}
					else{
						console.log("District not Found :" +jsonDirstrictnames[i]);
					}
				}	 
})




            
});


