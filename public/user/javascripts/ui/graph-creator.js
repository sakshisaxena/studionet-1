/*
 *  Cytoscape Styles
 */
var MODULE_SHAPE = "rectangle";
var USER_SHAPE = "ellipse"
var CONTRIBUTION_SHAPE = "rectangle"

var MODULE_WIDTH = 15, MODULE_HEIGHT = 15;
var USER_WIDTH = 20, USER_HEIGHT = 20; 
var CONTRIBUTION_WIDTH = 15, CONTRIBUTION_HEIGHT = 15;

var MODULE_COLOR = "yellow";
var USER_COLOR = "blue";
var CONTRIBUTION_COLOR = "green";

var EDGE_DEFAULT_COLOR = "#ccc";
var EDGE_SELECTED_COLOR = "blue";
var EDGE_DEFAULT_STRENGTH = 3;
var EDGE_DEFAULT_WEIGHT = 3;

var GRID_GRAPH_LAYOUT = { name : 'grid' };
var DAGRE_GRAPH_LAYOUT = { name : 'dagre' };
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
              'font-size':'15%',
              'background-image': 'data(icon)',
              'background-width': 'data(width)',
              'background-height': 'data(height)'
            })
           
          .selector(':selected')
            .css({
              'border-width': 0.5,
              'border-color': '#333',
              'width': 'data(width) + 10', 
              'height': 'data(height) + 10',
              'font-size': '15%'
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
            })
            
          
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
 * Converts normal node from backend into cytoscape-specific format
 */
var createGraphNode = function(node){

    var data = node;

    if(node.type=="module"){
          node.faveShape = MODULE_SHAPE;
          node.faveColor = MODULE_COLOR;
          node.width = MODULE_WIDTH;
          node.height = MODULE_HEIGHT;
          node.icon = 'url(./img/module.svg)'//'url(../../img/worldwide.svg)';
    }
    else if(node.type=="user"){ 
          node.faveShape = USER_SHAPE;
          node.faveColor = USER_COLOR;
          node.width = USER_WIDTH;
          node.height = USER_HEIGHT;
          node.icon = 'url(./img/user-icon.jpg)';
    }
    else if(node.type=="contribution"){
          node.faveShape = CONTRIBUTION_SHAPE;
          node.faveColor = CONTRIBUTION_COLOR;
          node.width = CONTRIBUTION_WIDTH;
          node.height = CONTRIBUTION_HEIGHT;
          node.icon = 'url(./img/contribution.png)' //'url(../../img/zoom-in.svg/)';
    }
    else {
          node.faveShape = CONTRIBUTION_SHAPE;
          node.faveColor = CONTRIBUTION_COLOR;
          node.width = CONTRIBUTION_WIDTH;
          node.height = CONTRIBUTION_HEIGHT;
          node.icon = 'url(http://placehold.it/20x30)' //'url(../../img/zoom-in.svg/)';
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
      var x = evt.cyPosition.x;
      var y = evt.cyPosition.y;

      var route = "/api/" + data.type + "s/" + data.id;

     
      $('#content-block-hover').hide();

      $.get( route , function( extra_data ) {

            var extra_content;
            if(data.type == "module"){
              extra_content = ":: module-description ::";
            }
            else if(data.type == "user"){
              extra_content = ":: user-tagline ::";
            }
            else if(data.type == "contribution"){

              if(extra_data.content == undefined)
                extra_content = ":: empty ::"
              else{
                if(extra_data.content.length > 200){                
                    extra_content = "Read more...";
                }
                else{
                  extra_content = "<br>" + extra_data.content;
                }
              }

            }
            
            $('#content-block-hover').css('position','absolute');
            $('#content-block-hover').css('top',y);
            $('#content-block-hover').css('left',x);

            $('#content-block-hover').show();


            $('#content-block-hover').html(
              "<h3>" + data.name + "<br>( <span>" + data.type + " )</span>" 
              + "</h3><p class=\'stats\'>:: statistics ::</p>"
              + "<p>" +  (extra_content) + "</p>" );

      });

    });


    cy.on('mouseout','node', function(evt){

      cy.elements().css({ content: " " });

      if(cy.$('node:selected')){
        $('#content-block-hover').html("");
        $('#content-block-hover').hide();    
      }


    });

    cy.on('tap', 'node', function(evt){


      cy.elements().removeClass('highlighted');
      var node = evt.cyTarget;
      var data = node.data();
      var directlyConnected = node.neighborhood();
      node.addClass('highlighted');
      directlyConnected.nodes().addClass('highlighted');
      node.connectedEdges().addClass('highlighted');

      var x = evt.cyPosition.x;
      var y = evt.cyPosition.y;

      console.log("X:"+x);
      console.log("Y:"+y);

      // display modal only if node is a contribution
      if(data.type == 'contribution'){

           var route = "/api/" + data.type + "s/" + data.id;

            $('#action-block').hide();
            $('#central-block').hide();

            $.get( route , function( extra_data ) {


                 data.extra = extra_data;
                  angular.element($('.graph-container')).scope().showDetailsModal(data);

            });


        
      }

    });

    cy.on('click', function(){
        var node = cy.$('node:selected');  

        if(node == undefined){
          $('#action-block').hide();
          $('#content-block').hide();
          $('#central-block').hide();
        }
    })
    
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

    $('#read_more').click(function(){
        $('#central-block').show();
    })

    $('#comment').click(function(){


        var form_string = "Title:<br><input id='post_title' type=\"text\"><br>";
       

        $('#central-block').html(form_string
          + "<br>"
          + "<button id='submit_comment'>Submit</button>"
          + "<button id='content-close'>Cancel</button>");

        $('#central-block').show();
    
        $('#content-close').click(function(){ 
            $('#central-block').hide(); 
            $('#action-block').hide(); 
            $('#content-block').hide(); 

        })

        $('#submit_comment').click(function(){ 

            var body = {};
            body.title = $('#post_title').val();
            body.body = "Lorem ipsum Esse Duis velit commodo aliqua qui cupidatat cillum qui dolore anim non amet.";
            body.ref = '-1'; 
            body.refType = 'text';
            body.labels = 'comment'; //tags
            body.contributionTypes = "";
 
            console.log("submitting", body);

            $.post('/api/contributions', 
                    body,
                    function(data){
                        alert("Done!");
                        refreshGraph();
                    });

        })



    })


});


