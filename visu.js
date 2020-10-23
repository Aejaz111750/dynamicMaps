(function(){
//---------Events------------
const zoom = d3.zoom()
			   .scaleExtent([0.3, 7])
			   .on("zoom", zoomHandler);

function zoomHandler(){
	g.attr("transform", d3.event.transform);
}

function clickToZoom(zoomSteps){
	svg.transition()
	   .duration(500)
	   .call(zoom.scaleBy, zoomSteps);
}

d3.select("#btn-zoom--in").on("click", () => clickToZoom(2));
d3.select("#btn-zoom--out").on("click", () => clickToZoom(1 / 2));
//--------End of Events------
	const HOVER_COLOR = "#d36f36";

	var margin = { top:0, left:0, right:0, botton:0 },
		height = 400 - margin.top - margin.botton,
		width = 800 - margin.left - margin.right;


	var svg = d3.select("#map")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.botton)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	const g = svg.call(zoom).append("g");

	d3.queue()
		.defer(d3.json, "counties-10m.json")//"us.json")//"states-albers-10m.json")
		.await(dataManipulations);

	var projection = d3.geoAlbersUsa()
						.translate([ width / 2, height / 2 ])
						.scale(850);

	var path = d3.geoPath()
				 .projection(projection);

	// const color = d3.scaleOrdinal(d3.schemeCategory20c.slice(5,10));
	const color = d3.scaleOrdinal(d3.schemeCategory20b.slice(1,6));


	let mouseOver = function(d){
		d3.select(".state")
		  .transition()
		  .duration(200)
		  .style("opacity", 0.5);
		d3.select(this)
		  .transition()
		  .duration(200)
		  .style("opacity", 1)
		  .style("stroke", "black");
		div.transition()
		   .duration(200)
		   .style("opacity", 0.9);
		div.html(d.properties.name)
		   .style("left", (d3.event.pageX) + "px")
		   .style("top", (d3.event.pageY - 28 ) + "px");
	}

	let mouseOut = function(d){
		d3.select(".state")
		  .transition()
		  .duration(200)
		  .style("opacity", 0.8)
		d3.select(this)
		  .transition()
		  .duration(200)
		  .style("stroke", "transparent")
		div.transition()
		   .duration(300)
		   .style("opacity", 0);
	}

	var div = d3.select("body")
				.append("div")
				.attr("class", "tooltip")
				.style("opacity", 0);

	function dataManipulations(error, data){
		console.log(data);

		// var counties = topojson.feature(data, data.objects.counties).features

		// svg.selectAll(".county")
		//    .data(counties)
		//    .enter().append("path")
		//    .attr("class", "county")
		//    .attr("d", path)	

		// var

		var states = topojson.feature(data, data.objects.states).features;
		console.log(states);

		g.selectAll(".state")
		   .data(states)
		   .enter().append("path")
		   .attr("class", "state")
		   .attr("d", path)
		   .attr("fill", (d, i) => color(i))
		   .style("opacity", 0.8)
		   .on("mouseover", mouseOver)
		   .on("mouseout", mouseOut)
		   // .on("mouseover", function(d){
		   // 	d3.select(this).classed("selected", true)
		   // })
		   // .on("mouseout", function(d){
		   // 	d3.select(this).classed("selected", false)
		   // });

		// var states = topojson.feature(data, data.objects.states).features;
		// g.selectAll(".stateName")
		//    .data(states)
		//    .enter().append("text")
		//    .attr("class", "stateName")
		//    .attr("transform", function(d) {
		//    	// console.log(d.geometry.coordinates);
		//    	return "translate(" + path.centroid(d) + ")";
		//    })
		//    .attr("dy", "1.35em")
		//    .text(function(d){return d.properties.name; });


		   // .attr("transform", d => `translate(${path.centroid(d)})`)
		   // .attr("dx", d => _.get(d, "offset[0]", null))
		   // .attr("dy", d => _.get(d, "offset[1]", null))
		   // .text(d => d.properties.name);
		
	};
})();