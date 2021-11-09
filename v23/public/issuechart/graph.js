//diamensions of the donut chart
const dims = { height:300, width:300, radius:150};
const cent = { x:(dims.width/2 + 5), y:(dims.height/2 + 5)};

console.log(db);


const arcTweenEnter = (d) => {
    var i = d3.interpolate(d.endAngle, d.startAngle);

    return function(t){
        d.startAngle = i(t);
        return arcPath(d);
    }
}

const arcTweenExit = (d) => {
    var i = d3.interpolate(d.startAngle, d.endAngle);

    return function(t){
        d.startAngle = i(t);
        return arcPath(d);
    }
}

// use function keyword to allow the use of the "this" keyword
function arcTweenUpdate (d){
    // interpolate between the two objects
    var i = d3.interpolate(this._current, d);

    //update the current prop with the new updated data
    this._current = i(1);

    return function(t){
        return arcPath(i(t));
    }
};

//Event Handlers
const handleMouseOver = (d, i, n) => { // d=data, i= index, n=array
//console.log(n[i]);
d3.select(n[i])
.transition('changeSliceFillColor').duration(300) // Important to name the transaition to avoid multiple transitions interruptions
.attr('fill', '#BCCBDE')
};

const handleMouseOut = (d, i, n) => {
    d3.select(n[i])
    .transition('resetSliceFillColor').duration(300)
    .attr('fill', color(d.data.name))
}

const handleclick = (d) => {
    const id = d.data.id;
    //db.collection('expenses').doc(id).delete();
}









//------------------------Svg container
const svg  = d3.select('.canvas')
.append('svg')
.attr('width', dims.width + 150) // 150px is for the legend to the right
.attr('height', dims.height +30);


// ------------------------Create a group(g) that contains all the graph elements
const graph = svg.append('g')
.attr('transform', `translate(${cent.x},  ${cent.y})`); // template strings used to output dynamic variables inside a string

//------------------------Setup the pie generator with START and END angles data
const pie = d3.pie ()
.sort(null)  // do not resort data
.value(d=> d.total);


//------------------------Setup the Arc generator and pass in the pie genrator data
const arcPath = d3.arc()
.outerRadius(dims.radius)
.innerRadius(dims.radius/2);

const color = d3.scaleOrdinal(['#3FB0AC', '#F7BB07', '#FA255D']);

//------------------------Setup a database listener to alert and send all changes






// Tool Tip
const tip = d3.tip()
.attr('class', 'tip card')
.html(d => {
    let content = `<div class="total"> ${d.data.total}</div>`;
    content+=`<div class="name"> ${d.data.name}</div>`;    
    return content;

});

graph.call(tip);


//--------ADD TEXT COUNTER TO SVG GRAPH-----------------------------
var countText = svg.append("text")
    .attr('transform', `translate(${cent.x-25},  ${cent.y+10})`)    
    .text(0)
    .attr('fill', 'white')  
    .style("font-size", "34px");



//------------------------update function 
const update = (data)=>{ 

    color.domain(data.map(d => d.name)); // update color scheme domain
	

    

    const paths = graph.selectAll('path') //join (pie) data to path elements
    .data(pie(data));

    // Handle the exit sleection
    paths.exit()
    .transition().duration(750)
    .attrTween('d', arcTweenExit)
    .remove();

    // Handle the current DOM path updates
    paths.attr('d', arcPath)
    .transition().duration(750)
    .attrTween('d', arcTweenUpdate);
	
	
	//---------------ANIMATION FOR TEXT COUNTER----------------// 

	var totalCount = 0;
    data.forEach(d => totalCount+=d.total); 
    
    countText.transition()
    .tween("text", function() {
     var selection = d3.select(this);    // selection of node being transitioned
     var start = d3.select(this).text(); // start value prior to transition
     var end = totalCount;                     // specified end value
     var interpolator = d3.interpolateNumber(start,end); // d3 interpolator
     return function(t) { selection.text(Math.round(interpolator(t))); };  // return value     
  })    
  .duration(1000);
	
    
    paths.enter()
    .append('path')
    .attr('class', 'arc')
    //.attr('d', arcPath) // automatically passing the data object for each element in the function
    .attr('stroke', '#fff')
    .attr('stroke-width', 3)
    .attr('fill', d => color(d.data.name))
    .each(function  (d){this._current = d}) // storing the current data on this property to access it if changed
    .transition().duration(750)
    .attrTween("d", arcTweenEnter);

   // ADD EVENTS
   graph.selectAll('path')
   .on('mouseover', (d,i,n ) =>{
       tip.show(d, n[i]);
    handleMouseOver(d,i,n)
   })
   .on('mouseout', (d,i,n) =>{
       tip.hide();
       handleMouseOut(d,i,n)
   })
   .on('click', handleclick);

};

      
update(db);

