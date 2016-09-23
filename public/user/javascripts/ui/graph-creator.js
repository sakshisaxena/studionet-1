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
              'font-size':'15%',
              'background-image': 'data(icon)',
              'background-size': 'cover'
              //'text-outline-width': 0.5,
              //'text-outline-color': 'data(faveColor)',
              //'border': '1px solid black'
              //'background-color': 'data(faveColor)',
              //'color': '#fff'
              //'content': 'data(name)',
            })
            
          .selector(':selected')
            .css({
              'border-width': 2,
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
  return "<h3>" + name + "</h3>" + "<h5>" + type + "</h5>" + "<p>This node has " + neighbours + " connections, -- views, --saves and -- likes.</p>";
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
          node.icon = 'url(http://placehold.it/20x30)'//'url(../../img/worldwide.svg)';
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

          //$('#info-block').show();
          //$('#info-block').html(getHTML(data.name, data.type, directlyConnected.nodes().length));
          
          evt.cyTarget.css({ content: data.name + ' | ' + data.type + ' | ' + directlyConnected.nodes().length + 'connections'
                  //getHTML(data.name, data.type, directlyConnected.nodes().length) 
                          });
    
    });


    cy.on('mouseout','node', function(evt){

      cy.elements().css({ content: " " });

      if(cy.$('node:selected')){
        $('#info-block').html("");
        $('#info-block').hide();      
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

      var route = "/api/" + data.type + "s/" + data.id;

      $('#action-block').hide();
      $('#central-block').hide();

      $.get( route , function( extra_data ) {

            var extra_content;
            if(data.type == "module"){
              extra_content = "";
            }
            else if(data.type == "user"){
              extra_content = ""//JSON.stringify(extra_data);
            }
            else if(data.type == "contribution"){

              $('#action-block').show();

/*              if(extra_content.title = 'Question')
                $('#answer').show();*/


              if(extra_data.description == undefined)
                extra_data.description = "This post doesn't have a short description"
              if(extra_data.content == undefined)
                extra_data.content = "This post has no content!"


              extra_content = "<hr/>" + extra_data.description;
              if(extra_data.content.length > 200){                
                
                $('#read_more').show();
                $('#central-block').html(
                  "<h3>"+node.data.name+"</h3><hr/><p>"+ extra_data.content +"</p>"
                  +"<button id='content-close'>Close</button>");


                //extra_content = extra_content + "<hr/><br><a>Read full...</a>"
              }
              else{
                $('#read_more').hide();
                extra_content = extra_content + "<hr/><br>" + extra_data.content;
              }

            }

            $('#content-block').show();
            $('#content-block').html(
              getHTML(data.name, data.type, directlyConnected.nodes().length)
              + "<p>" +  extra_content + "</p>" );

      });

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


