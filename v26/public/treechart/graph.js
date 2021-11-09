var fireData = [];
var genesis;
var test = 10;
var mongoData;

var FireTreeData = []; 

var i = 0,
    duration = 750,
    root;



  //create ordinal scale
const color = d3.scaleOrdinal(d3['schemeSet3']);  



db.collection('employees').onSnapshot(res=> {

  res.docChanges().forEach(change => {

    const doc = {...change.doc.data(), id: change.doc.id};

    switch (change.type) {
      case 'added':
        fireData.push(doc);
        break;
      case 'modified':
        const index = fireData.findIndex(item => item.id == doc.id);
        fireData[index] = doc;
        break;
      case 'removed':
        fireData = fireData.filter(item => item.id !== doc.id);
        break;
      default:
        break;
    }

  });
  
  genesis = conversion(fireData);   

  // Assigns parent, children, height, depth
root = d3.hierarchy(genesis, function(d) { return d.children; });

root.x0 = dims.height * 2;
root.y0 = 0;

// Collapse after the second level
root.children.forEach(collapse);

update(root);
});




function conversion (element){ 
  
  
  //tree and stratify
 stratify = d3.stratify()
.id(d =>d.name )
.parentId(d => d.parent);


//update ordinal scale domain
color.domain(fireData.map(item =>item.department));

//get updated root Node data  
  fireRootNode = stratify(fireData);
 

 fireRootNode.descendants().forEach((d, i) => {
  d.id = i;
  d._children = d.children;
});
return fireRootNode;
  
};





// Set the dimensions and margins of the diagram
const dims = {height:700, width:1100};



const svg = d3.select('.canvas')
.append('svg')
.attr('width', dims.width + 250)
.attr('height', dims.height + 100)
.call(d3.zoom().on("zoom", function () {
    svg.attr("transform", d3.event.transform)
 }))
 .append("g")
 .attr('transform', 'translate(150, 50)');


// zoom group


const graph = svg.append('g')
.attr('transform', 'translate(50, 50)');




const tree = d3.tree()
.size([dims.width, dims.height+100]);









// declares a tree layout and assigns the size
var treemap = d3.tree().size([dims.height, dims.width]);




// Collapse the node and all it's children
function collapse(d) {
  
  if(d.children) {
    d._children = d.children
    d._children.forEach(collapse)
    d.children = null
  }
}

function update(source) {

  // remove current nodes
  graph.selectAll('.node').remove();
  graph.selectAll('.link').remove();

  

  


  // Assigns the x and y position for the nodes
 
  var mongoData = treemap(root);

  

  
  

  // Compute the new tree layout.
  var nodes = mongoData.descendants(),
      links = mongoData.descendants().slice(1);

      
      

  // Normalize for fixed-depth.
  nodes.forEach(function(d){ d.y = d.depth * 220});

  // ****************** Nodes section ***************************555555555555555555555555555555555555555555555555555555555555555555555

  // Update the nodes...
  var node = svg.selectAll('g.node')
      .data(nodes, function(d) {return d.id || (d.id = ++i); });

  // Enter any new modes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .on('click', click);

  // Add Circle for the nodes
  nodeEnter.append('circle')
      //apply ordinal scale to work out fill
    .attr('fill', d =>color(d.data.data.department))
      .attr('class', 'node')
      .attr('r', 1e-6) 
      .attr('stroke', function(d){
      if (d._children)return "blue"} )
      .attr('stroke-width', function(d){
        if (d._children)return 2} )
        .transition()
    .delay(function(d, i) { return i * 150; })
    .on("start", function repeat() {
        d3.active(this)
            .style("fill", function(d){
              if (d._children)return "lightblue"} )              
          .transition()  
          .duration(350)        
            .style("fill", function(d){
              if (d._children)return "teal"} )          
          .transition()          
            .on("start", repeat);
      });
      

  // Add labels for the nodes
  nodeEnter.append('text')       
      .attr("text-anchor", function(d) {
          return d.children || d._children ? "end" : "start";
      })
      .attr("alignment-baseline", function(d) {
        return d.children || d._children ? "ideographic" : "central";
      })
      .attr('x', function (d){ return d.children || d._children ? -15 : 15})
      .attr('y', function (d){ return d.children || d._children ? 10 : 0})
      //.attr('alignment-baseline', d=>d.children ? 'ideographic':'central' )
      //.attr("x", d => d.children ? -10 : 15)
      //.attr("y", d => d.children ? -15 : 0)
      .attr('fill', 'green')
      .attr("style", "font-size: 1rem")
      .text(function(d) { return d.data.data.name; });

  // UPDATE
  var nodeUpdate = nodeEnter.merge(node);

  // Transition to the proper position for the node
  nodeUpdate.transition()
    .duration(duration)
    .attr("transform", function(d) { 
        return "translate(" + d.y + "," + d.x + ")";
     });

  // Update the node attributes and style
  nodeUpdate.select('circle.node')
    .attr('r', 10)
    .attr('stroke', function(d){
      if (d._children)return "blue"} )
      .attr('stroke-width', function(d){
        if (d._children)return 2} )    
    .attr('cursor', function(d){
      if (d._children)return  'pointer'});


  // Remove any exiting nodes
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
          return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

  // On exit reduce the node circles size to 0
  nodeExit.select('circle')
    .attr('r', 1e-6);

  // On exit reduce the opacity of text labels
  nodeExit.select('text')
    .style('fill-opacity', 1e-6);

  // ****************** links section ***************************

  // Update the links...
  var link = svg.selectAll('path.link')
      .data(links, function(d) { return d.id; });

  // Enter any new links at the parent's previous position.
  var linkEnter = link.enter().insert('path', "g")
      .attr("class", "link")
      .attr('d', function(d){
        var o = {x: source.x0, y: source.y0}
        return diagonal(o, o)
      });

  // UPDATE
  var linkUpdate = linkEnter.merge(link);

  // Transition back to the parent element position
  linkUpdate.transition()
      .duration(duration)
      .attr('d', function(d){ return diagonal(d, d.parent) });

  // Remove any exiting links
  var linkExit = link.exit().transition()
      .duration(duration)
      .attr('d', function(d) {
        var o = {x: source.x, y: source.y}
        return diagonal(o, o)
      })
      .remove();

  // Store the old positions for transition.
  nodes.forEach(function(d){
    d.x0 = d.x;
    d.y0 = d.y;
  });

  // Creates a curved (diagonal) path from parent to the child nodes
  function diagonal(s, d) {

    path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

    return path
  }

  // Toggle children on click.
  function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
    update(d);
  }
}












