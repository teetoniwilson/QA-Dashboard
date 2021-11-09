const dims = {height:500, width:1100};

const svg = d3.select('.canvas')
.append('svg')
.attr('width', dims.width + 100)
.attr('height', dims.height + 100);

const graph = svg.append('g')
.attr('transform', 'translate(50, 50)');

//tree and stratify
const stratify = d3.stratify()
.id(d =>d.name )
.parentId(d => d.parent);

const tree = d3.tree()
.size([dims.width, dims.height]);

//create ordinal scale
const color = d3.scaleOrdinal(d3['schemeSet3']);


//update function
const update = (data) =>{

    // remove current nodes
    graph.selectAll('.node').remove();
    graph.selectAll('.link').remove();

    //update ordinal scale domain
    color.domain(data.map(item =>item.department));

    //get updated root Node data
    const rootNode = stratify(data);

    const treeData = tree(rootNode).descendants();


    //get nodes selection and join data
    const nodes = graph.selectAll('.node')
    .data(treeData);

    //get link selection and join new data
    const link = graph.selectAll('.link')
    .data(tree(rootNode).links());

    //enter new links
    link.enter()
    .append('path')    
    .attr('class', 'link')
    .attr('fill', 'none')
    .attr('stroke', '#aaa')
    .attr('stroke-width', 2)
    .attr('d', d3.linkVertical()
    .x(d =>d.x)
    .y(d=>d.y)
    );

    //create enter node groups
    const enterNodes = nodes.enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.x}, ${d.y})`);


    //append rects to enter nodes
    enterNodes.append('rect')
    //apply ordinal scale to work out fill
    .attr('fill', d =>color(d.data.department))
    .attr('stroke', '#555')
    .attr('stroke-width', 2)
    .attr('height', 25)
    .attr('width', d => d.data.name.length * 9)
    .attr('transform', d =>{
        var x  =d.data.name.length * 4.5;
        return `translate(${-x}, -17)`;
    });

    //append name text

    enterNodes.append('text')
    .attr('text-anchor', 'middle')
    .attr('fill', 'green')
    .attr("style", "font-size: 1rem")
    .text(d => d.data.name); 
};


//data & firbase Hook-up (Realtime Listener)
var data = [];


db.collection('employees').onSnapshot(res=> {

  res.docChanges().forEach(change => {

    const doc = {...change.doc.data(), id: change.doc.id};

    switch (change.type) {
      case 'added':
        data.push(doc);
        break;
      case 'modified':
        const index = data.findIndex(item => item.id == doc.id);
        data[index] = doc;
        break;
      case 'removed':
        data = data.filter(item => item.id !== doc.id);
        break;
      default:
        break;
    }

  });

  update(data);
});