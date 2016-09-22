/*
 *  Cytoscape Styles
 */
var MODULE_SHAPE = "rectangle";
var USER_SHAPE = "ellipse"
var CONTRIBUTION_SHAPE = "rectangle"

var MODULE_WIDTH = 40, MODULE_HEIGHT = 40;
var USER_WIDTH = 15, USER_HEIGHT = 15; 
var CONTRIBUTION_WIDTH = 25, CONTRIBUTION_HEIGHT = 30;

var MODULE_COLOR = "yellow";
var USER_COLOR = "blue";
var CONTRIBUTION_COLOR = "green";

var EDGE_DEFAULT_COLOR = "#ccc";
var EDGE_SELECTED_COLOR = "blue";
var EDGE_DEFAULT_STRENGTH = 3;
var EDGE_DEFAULT_WEIGHT = 3;

var GRID_GRAPH_LAYOUT = { name : 'grid' };
var CIRCLE_GRAPH_LAYOUT = { name : 'circle' };
var COSE_GRAPH_LAYOUT = { name: 'cose',
                          padding: 10,
                          randomize: true };

var CONCENTRIC_GRAPH_LAYOUT = {  name: 'concentric', 
        concentric: function( node ){
          return node.degree();
        },
        levelWidth: function( nodes ){
          return 1;
        }};

/*
 * Cytoscape Specific Styles
 */
var graph_style = {
      
      container: document.getElementById('cy'),

      ready: function(){
                          window.cy = this;

                          //giddy up
                        },
      
      layout: CONCENTRIC_GRAPH_LAYOUT,
      
      hideLabelsOnViewport: false,
      
      style: 
        cytoscape.stylesheet()
          
          .selector('node')
            .css({
              'shape': 'data(faveShape)',
              'width': 'data(width)', 
              'height': 'data(height)',   // mapData(property, a, b, c, d)  => specified range a, b; actual values c, d
              'text-valign': 'center',
              'font-size':'5%',
              'text-outline-width': 0.5,
              'text-outline-color': 'data(faveColor)',
              //'border': '1px solid black'
              'background-color': 'data(faveColor)',
              //'color': '#fff'
              //'content': 'data(name)',
            })
            
          .selector(':selected')
            .css({
              'border-width': 5,
              'border-color': '#333',
              'width': 'data(width) + 10', 
              'height': 'data(height) + 10',
              'font-size': '14px'
            })
          
          .selector('edge')
            .css({
              'curve-style': 'bezier',
              'width': 'mapData(weight, 0.1, 3, 1, 7)', 
              'target-arrow-shape': 'triangle',
              'line-color': 'data(faveColor)',
              'source-arrow-color': 'data(faveColor)',
              'content' : 'data(label)',
              'font-size':'15%',
              'color': '#d8d8d8',
              'edge-text-rotation': 'autorotate',
              'target-arrow-color': 'data(faveColor)'
              //'source-arrow-shape': 'circle',
              //'opacity': 0.666,
              //'width': 'mapData(strength, 70, 100, 2, 5)',
            })
            
          /*.selector('edge.questionable')
            .css({
              'line-style': 'dotted',
              'target-arrow-shape': 'diamond'
            }) */
          
          .selector('.faded')
            .css({
              'opacity': 0.75,
              'text-opacity': 0.25
            })
          
          .selector('.highlighted')
            .css({
              'line-color': 'green',
              'target-arrow-color':'green',
              'background-color': 'data(faveColor)'
            })
}

/*
 *  Returns HTML Content for the side-info-bar
 */
var getHTML = function(name, type, neighbours){
  return "<h1>" + name + "</h1>" + "<h5>" + type + "</h5>" + "<p>This node has " + neighbours + " connections.</p>";
}

/*
 * Converts normal node from backend into cytoscape-specific format
 */
var createGraphNode = function(node){

    var data = node;

    if(node.type=="module"){
          node.faveShape = MODULE_SHAPE;
          node.faveColor = MODULE_COLOR;
          node.width = MODULE_WIDTH;
          node.height = MODULE_HEIGHT;
    }
    else if(node.type=="user"){ 
          node.faveShape = USER_SHAPE;
          node.faveColor = USER_COLOR;
          node.width = USER_WIDTH;
          node.height = USER_HEIGHT;
    }
    else if(node.type=="contribution"){
          node.faveShape = CONTRIBUTION_SHAPE;
          node.faveColor = CONTRIBUTION_COLOR;
          node.width = CONTRIBUTION_WIDTH;
          node.height = CONTRIBUTION_HEIGHT;
    }

    return  { data: node };
}

/*
 * Converts normal edge from backend into cytoscape-specific format
 */
var createGraphEdge = function(edge){

    edge.strength = EDGE_DEFAULT_STRENGTH;
    edge.faveColor = EDGE_DEFAULT_COLOR;
    edge.weigth = EDGE_DEFAULT_WEIGHT;

    return { data: edge };

}


/*
 * Makes the actual graph and defines functionality on the nodes and edges
 */
var makeGraph = function(dNodes, dEdges){

    console.log("Making Graph");

    graph_style.elements = {
        nodes: dNodes, 
        edges: dEdges
    }

    graph_style.layout = eval($("input[name='layout-radio']:checked").val());
    console.log($("input[name='layout-radio']:checked").val());

    cy = cytoscape( graph_style );

    cy.on('mouseover','node', function(evt){

          var data = evt.cyTarget.data();
          var directlyConnected = evt.cyTarget.neighborhood();
          
          $('#info-block').show();
          $('#info-block').html(getHTML(data.name, data.type, directlyConnected.nodes().length));
          
          evt.cyTarget.css({ content: name});
     });


    cy.on('mouseout','node', function(evt){

        $('#info-block').hide();

    });


    cy.on('tap','node', function(evt){
      
        cy.elements().removeClass('highlighted');
        evt.cyTarget.addClass('highlighted');

        var node = evt.cyTarget;
        var data = node.data();
        var directlyConnected = node.neighborhood();

        $('#info-block').show();
        $('#info-block').html(getHTML(data.name, data.type, directlyConnected.nodes().length));

        directlyConnected.nodes().addClass('highlighted');
        node.connectedEdges().addClass('highlighted');
  
    });
    
}


var refreshGraph = function(){

    // check which layout is selected   
    
    // API Request for Entire Graph
    $.get( "/graph/all", function( data ) {

        makeGraph( 
            data.nodes.map( function(node){ return createGraphNode(node) } ), 
            data.links.map( function(edge){ return createGraphEdge(edge) } )            
        );
       
    })

}


// On document ready
$(document).ready(function(){

    refreshGraph(); 

});


