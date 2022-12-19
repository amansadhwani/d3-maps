/* var indiaTopoPromise = d3.json("topojson/india.json");
indiaTopoPromise.then(function(india){
    console.log(india)
}); */


var svg;

var stateAlignmentjson={ "Bihar":{"height":1250,"width":1150} , "Gujarat":{"height":1110,"width":920},"Jharkhand":{"height":1150,"width":1150},"Kerala":{"height":600,"width":1000},"Maharashtra":{"height":960,"width":960},"Rajasthan":{"height":1332,"width":950},"Madhya Pradesh":{"height":1200,"width":1020},"Andhra Pradesh":{"height":850,"width":1050},"Telangana":{"height":880,"width":1050}};

var width,height;
var jsonDirstrictnames=[];
var topojsonDistrictNames=[];

/*var width = 960,
    height = 960;
var selectedStateID = 21;
var selectedDistrictID = 2; */
console.log('d3', d3.version);
var tooltip = d3.select("#data-tooltip-container")
                .append("div")
                .attr("id", "data-tooltip")
                .attr("class", "hide-data-tooltip")
                .text("Details here!")
    
//var unitDataPromise = d3.json("data/unitDetails.json", ({unit, value}) => return ({unit:  value}));

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
	 statePromise = Promise.resolve('{}');//d3.json("topojson/india_states.json");
	 districtPromise = d3.json(url_for_district); 
	 talukaPromise = Promise.resolve('{}');//d3.json("topojson/india_taluk.json");
Promise.all([unitDataPromise, statePromise, districtPromise, talukaPromise])

    .then(function(india){
		
		unit_data = india[0];
		var selectedStateName = unit_data.stateName;
		width=stateAlignmentjson[selectedStateName].width;
		height=stateAlignmentjson[selectedStateName].height
		
		
        /************* Create svg ***************/
        svg = d3.select(".d3chart").append("svg")
        .attr("width", width)
        .attr("height", height);

        /************* Prepare projection ***************/
        var projection = d3.geoMercator()
			.scale(width / Math.PI)
              .scale(2200)
              .translate([- width * 2.8, height]) 
         /* var projection = d3.geoMercator().fitSize([1110, 920], geojson);   */
        var path = d3.geoPath()
              .projection(projection);
        
        /************* Consolidate data ***************/     
		//var coordinates = projection([73.7898,19.9975]);
		//var coordinates1 = projection([74.6546,20.3069]);
		var coordinates = projection([69.8597,23.7337]);
		var coordinates1 = projection([72.8311,21.1702]);
		
		
		
       
		
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
		
		
        
        //Get Unit data first
        /* unit_data = {
        // Create empty object for holding dataset
            const mapUnitData = {};
             
            // Create property for each Unit, give it value
            unit_data.forEach(d => (mapUnitData[d.unit] = +d.value));

            return rateById;
        } */
        
            
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
                
        /*************  Data for Taluka ***************/ 
        /* taluka = topojson.feature(india[3], india[3].objects.india_taluk)
        talukas = taluka.features.filter(function(d){
            return d.properties.ID_1 == selectedStateID
        }) */
        /* svg.append("g")
                .attr("class", "taluka")
                .selectAll("path")
                .data(talukas)
            .enter().append("path")
                .attr("class", function(d){	
                    var class_names = 'taluk ' + d.properties.NAME_1 + " " + d.properties.NAME_2 + " " + d.properties.NAME_3 ; 
                    return class_names
                })
                .attr("d", path) */
                
        /*************  Data for Districts ***************/ 
        districts = topojson.feature(india[2], india[2].objects.state)
		console.log(districts);
        stateDistricts = districts.features.filter(function(d){
            return d.properties.State_Name == selectedStateName
        })
        svg.append("g")
            .attr("class", "districts")
            .selectAll("path")
            .data(stateDistricts)
            .enter().append("path")
                .attr("class", function(d){
                    var class_names = 'district ' + d.properties.State_Name + ' ' + d.properties.Dist_Name ; 
					
					topojsonDistrictNames.push(d.properties.Dist_Name);
                    return class_names
                })
                .attr("fill", function(d){
                        return linearHeatColor(unit_data_map[d.properties.Dist_Name]);
                })
                .attr("d", path)
/*                 .on('mouseenter', function(d, i) {
                    //var currentPath = this;
                    //d3.select(this).attr("class", "darken");
                    return tooltip.attr("class","show-data-tooltip")
                }) */
                .on('mouseover', function(d, i) {
                    //var currentPath = this;
                    //d3.select(this).attr("class", "darken");
                    //d3.select("#data-tooltip");
					var data,noData,stateName,amount;
					//amount=unit_data_map_amount[d.properties.Dist_Name];
						
                    data = unit_data_map[d.properties.Dist_Name];
					data1 = "ABC";
				
					stateName=[d.properties.Dist_Name];
					
                    if(typeof data1 == 'undefined'){
                        noData = "Data is not Available for "+stateName;
						document.getElementById("data-tooltip").innerText = noData;
						return tooltip.attr("class","show-data-tooltip")
                    }
					else{
					
                    document.getElementById("data-tooltip").innerText = stateName+":"+data+"%" ;
					//document.getElementById("data-tooltip").innerText ="ABC"+":"+data1+"%" ;
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
				
				  function handleMouseOver(d, i) {  // Add interactivity
				  
					console.log("data here")
					document.getElementById("data-tooltip").innerText = "Nandgaon : 260% ";
					//document.getElementById("data-tooltip").innerText ="ABC"+":"+data1+"%" ;
                    return tooltip.attr("class","show-data-tooltip")
          }
				
				svg.append("circle")
				
            .attr("cx", coordinates[0])
            .attr("cy", coordinates[1])
            .attr("r", 5)
			.on("mouseover", handleMouseOver)
            .style("fill", "#5FB333");
			//
			
		svg.append("circle")
            .attr("cx", coordinates1[0])
            .attr("cy", coordinates1[1])
            .attr("r", 5)
            .style("fill", "#5FB333");
			
        /*************  Data for States ***************/
        //states = topojson.feature(india[1], india[1].objects.india_states)
        /* svg.append("g")
            .attr("class", "states")
            .selectAll("path")
            .data(states.features)
            .enter().append("path")
                .attr("d", path) */
        
        //Give outline for Selected State
        /* svg.append("path")
            .datum(topojson.mesh(india[1], india[1].objects.india_states, function(a,b){
                if(a == b || a.properties.ID_1 == selectedStateID)
                return true;
            }))
            .attr("class", "outline")
            .attr("d", path) */
			
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


