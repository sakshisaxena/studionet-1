// Let's first initialize sigma:
var s = new sigma('container');

s.bind('clickStage', function(e) {
  console.log(e.type, e.data.captor);
  addNewContribution();

});

contributionId=0;
var addNewContribution = function(){
  
  var contribution = {
      title: 'New Contribution ' +  ++contributionId,
      body: 'Lorem Ipsum',
      ref: -1, 
      //lastUpdatedParam: Date.now(),
      refType: '',
      //edittedParam: false,
      labels: 'question', //tags
      contributionTypes: 'video'
  };

  console.log(contribution);

  $.ajax({
    type: "POST",
    url: "/api/contributions/new",
    data: contribution,
    success: function(data){ console.log(data); } /*,
    dataType: ""*/
  });

  

}
/*s = new sigma({
  graph: g,
  renderer: {
    container: document.getElementById('graph-container'),
    type: 'canvas'
  },
  settings: {
    doubleClickEnabled: false,
    minEdgeSize: 0.5,
    maxEdgeSize: 4,
    enableEdgeHovering: true,
    edgeHoverColor: 'edge',
    defaultEdgeHoverColor: '#000',
    edgeHoverSizeRatio: 1,
    edgeHoverExtremities: true,
  }
});
// Bind the events:
s.bind('overNode outNode clickNode doubleClickNode rightClickNode', function(e) {
  console.log(e.type, e.data.node.label, e.data.captor);
});
s.bind('overEdge outEdge clickEdge doubleClickEdge rightClickEdge', function(e) {
  console.log(e.type, e.data.edge, e.data.captor);
});
s.bind('clickStage', function(e) {
  console.log(e.type, e.data.captor);
});
s.bind('doubleClickStage rightClickStage', function(e) {
  console.log(e.type, e.data.captor);
});

$('.sigma-scene').click( function(){
  alert("graph clicked");
})*/


var getColor = function(node){

    if(node.label == 'user')
      return 'blue';
    if(node.label == 'module')
      return 'yellow';
    if(node.label == 'contribution')
      return 'purple';

}

var getSize = function(node){

    if(node.label == 'user')
      return Math.round(10+Math.random(0, 1)*16);
    if(node.label == 'module')
      return 20;
    if(node.label == 'contribution')
      return Math.round(15+Math.random(0, 1)*10);

}

jQuery.get('/api/all', function(data){

  if (!data) console.log('error getting json graph data', error);

  var linkId = 0;

  data.nodes.map( function(node){
      s.graph.addNode({
        // Main attributes:
        id: node.id,
        label: node.title,
        // Display attributes:
        x: Math.random()*40,
        y: Math.random()*40,
        size: getSize(node),
        color: getColor(node)
      });
  }); 

  data.links.map( function(link){
      
      s.graph.addEdge({
      id: linkId,
      color: '#ccc',
      type: 'curve',
      // Reference extremities:
      source: link.source.id,
      target: link.target.id
      });



      linkId++;
  }); 


/*
  s.settings({
    edgeColor: 'default',
    defaultEdgeType: 'curve'
    defaultEdgeColor: '#999',
    defaultNodeColor: '#DDD'
  });*/

  // Refresh the graph to see the changes:
  s.refresh();

});


// api/new
/*      contributionTitleParam: req.body.title,
      contributionBodyParam: req.body.body,
      contributionRefParam: req.body.ref, 
      lastUpdatedParam: Date.now(),
      refTypeParam: req.body.refType,
      edittedParam: false,
      contributionLabelParam: req.body.labels, //tags
      contributionTypesParam: req.body.contributionTypes*/




var newContribution = function(){
  $.post( "ajax/test.html", function( data ) {
    $( ".result" ).html( data );
  });  
}
