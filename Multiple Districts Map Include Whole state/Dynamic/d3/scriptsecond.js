/* var indiaTopoPromise = d3.json("topojson/india.json");
indiaTopoPromise.then(function(india){
    console.log(india)
}); */


var svg;

var stateAlignmentjson={ "Bihar":{"height":1250,"width":1150} , "Gujarat":{"height":1110,"width":920},"Jharkhand":{"height":1150,"width":1150},"Kerala":{"height":600,"width":1000},"Maharashtra":{"height":960,"width":960},"Rajasthan":{"height":1332,"width":950}};

var width,height;
var jsonDirstrictnames=[];
var topojsonDistrictNames=[];

/*var width = 960,
    height = 960;
var selectedStateID = 21;
var selectedDistrictID = 2; */

var tooltip = d3.select(".d3chartsecond")
                .append("div")
                 .attr("class", "tooltip")       
        .style("opacity", 0);
    
//var unitDataPromise = d3.json("data/unitDetails.json", ({unit, value}) => return ({unit:  value}));
var unitDataPromise = d3.json("topojson/data/unitDetailssecond.json", function(e,d){
        return d.value;
    });
var statePromise = Promise.resolve('{}');//d3.json("topojson/india_states.json");
var districtPromise = d3.json("topojson/india_district.json"); 
var talukaPromise = Promise.resolve('{}');//d3.json("topojson/india_taluk.json"); 

Promise.all([unitDataPromise, statePromise, districtPromise, talukaPromise])

    .then(function(india){
		
		unit_data = india[0];
		var selectedStateName = unit_data.stateName;
		width=stateAlignmentjson[selectedStateName].width;
		height=stateAlignmentjson[selectedStateName].height
		
		
        /************* Create svg ***************/
        svg = d3.select(".d3chartsecond").append("svg")
        .attr("width", width)
        .attr("height", height);

        /************* Prepare projection ***************/
        var projection = d3.geoMercator()
              .scale(width / Math.PI)
              .scale(2400)
              .translate([- width * 2.8, height])
              
        var path = d3.geoPath()
              .projection(projection);
        
        /************* Consolidate data ***************/        
       
		
		var unit_data_map={};
		var unit_data_extract_data=unit_data["unitData"];
        var unit_data_values = unit_data_extract_data.map(function(unit_data_extract_data) { 
                unit_data_map[unit_data_extract_data.unit] = unit_data_extract_data.value;
				jsonDirstrictnames.push(unit_data_extract_data.unit); // note here I am adding districts names 
                return unit_data_extract_data.value;
            });
        
        var minDomain = 0;//d3.min(unit_data_values);
        var maxDomain = 100;//d3.max(unit_data_values);
        
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
                    if( d % 2)
                        return ((d - 1) * 10);
                    else if(d == 10)
                        return (d * 10);
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
        districts = topojson.feature(india[2], india[2].objects.india_district)
        stateDistricts = districts.features.filter(function(d){
            return d.properties.NAME_1 == selectedStateName
        })
        svg.append("g")
            .attr("class", "districts")
            .selectAll("path")
            .data(stateDistricts)
            .enter().append("path")
                .attr("class", function(d){
                    var class_names = 'district ' + d.properties.NAME_1 + ' ' + d.properties.NAME_2 ; 
					
					topojsonDistrictNames.push(d.properties.NAME_2);
                    return class_names
                })
                .attr("fill", function(d){
                        return linearHeatColor(unit_data_map[d.properties.NAME_2]);
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
					/* var data,noData,stateName;
					
                    data = unit_data_map[d.properties.NAME_2];
					stateName=[d.properties.NAME_2];
					
                    if(typeof data == 'undefined'){
                        noData = "Data is not Available for "+stateName;
						document.getElementById("data-tooltip").innerText = noData;
						return tooltip.attr("class","show-data-tooltip")
                    }
					else{
					
                    document.getElementById("data-tooltip").innerText = stateName+":"+data+"%";
                    return tooltip.attr("class","show-data-tooltip")
					} */
					data = unit_data_map[d.properties.NAME_2];
					if(typeof data == 'undefined'){
						noData = "Data is not Available for ";
						tooltip.transition()    
					.duration(200)    
					.style("opacity", .9);    
					tooltip.html(noData+" "+d.properties.NAME_2)  
					.style("left", (d3.event.pageX) + "px")   
					.style("top", (d3.event.pageY - 28) + "px") 
					.style("border","1px solid black")
					.style("width","180px");
					}
					else{
					
					tooltip.transition()    
					.duration(200)    
					.style("opacity", .9);    
					tooltip.html(d.properties.NAME_2+" "+data+"%")  
					.style("left", (d3.event.pageX) + "px")   
					.style("top", (d3.event.pageY - 28) + "px")
					.style("width","120px")
					.style("border","1px solid black");
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
                     tooltip.transition()    
					.duration(500)   
									
					.style("opacity", 0); 
                });
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
            
});

