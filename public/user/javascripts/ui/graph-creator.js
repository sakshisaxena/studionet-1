
function makeGraph(dNodes, dEdges){


    //gray out
    dNodes = dNodes.map(function(e){
      e.data.faveColor =  "green"//'#d9d9d9'
      return e;
    })


    dEdges = dEdges.map(function(e){
      e.data.faveColor = '#d9d9d9';
      return e;
    })


    var cy = cytoscape({
      container: document.getElementById('cy'),
      layout: {
        name: 'cose',
        padding: 10,
        randomize: true
      },
      hideLabelsOnViewport: false,
      style: cytoscape.stylesheet()
        .selector('node')
          .css({
            'shape': 'data(faveShape)',
            'width': 'mapData(weight, 0.1, 3, 1, 7)', 
            'height': 'mapData(weight, 0.1, 3, 1, 7)',   // mapData(property, a, b, c, d)  => specified range a, b; actual values c, d
            //'content': 'data(name)',
            'text-valign': 'center',
            'font-size':'5%',
            'text-outline-width': 0.5,
            'text-outline-color': 'data(faveColor)',
            'background-color': 'data(faveColor)',
            'color': '#fff'
          })
          
        .selector(':selected')
          .css({
            'border-width': 0.5,
            
            'border-color': '#333'
          })
        .selector('edge')
          .css({
            'curve-style': 'bezier',
            //'opacity': 0.666,
            //'width': 'mapData(strength, 70, 100, 2, 5)',
            'width': 'mapData(weight, 0.1, 3, 1, 7)', 
            'target-arrow-shape': 'triangle',
            //'source-arrow-shape': 'circle',
            'line-color': 'data(faveColor)',
            'source-arrow-color': 'data(faveColor)',
            'content' : 'data(label)',
            'font-size':'5%',
            'color': '#d8d8d8',
            'edge-text-rotation': 'autorotate',
            'target-arrow-color': 'data(faveColor)'
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
            'background-color': 'green',
            'line-color': 'green',
            'target-arrow-color':'green'
          }),
      
      elements: {
        nodes: dNodes/*[
          { data: { id: 'm', name: 'AR2521', weight: 3, faveColor: '#112200', faveShape: 'rectangle', type:'module' } },
          { data: { id: 'mod', name: 'Moderator', weight: 3, faveColor: 'red', faveShape: 'ellipse', type:'moderator' } },
          { data: { id: 'ass1', name: 'Assignment1', weight: 3, faveColor: 'green', faveShape: 'triangle', type:'material' } },
          { data: { id: 'res', name: 'study1', weight: 3, faveColor: 'lightblue', faveShape: 'triangle', type:'material' } },
          { data: { id: 'e', name: 'Elaine', weight: 3, faveColor: 'lightblue', faveShape: 'ellipse', type:'student' } },
          { data: { id: 'k', name: 'Kramer', weight: 2, faveColor: 'lightblue', faveShape: 'ellipse', type:'student' } },
          { data: { id: 'g', name: 'George', weight: 3, faveColor: 'lightblue', faveShape: 'ellipse', type:'student' } },
          { data: { id: 's', name: 'Sakshi', weight: 3, faveColor: 'lightblue', faveShape: 'ellipse', type:'student' } },
          { data: { id: 'cE1', name: 'Rendering Techniques', weight: 3, faveColor: 'green', faveShape: 'triangle', type:'contribution' } },
          { data: { id: 'qK1', name: 'Green Houseing examples', weight: 3, faveColor: 'green', faveShape: 'triangle', type:'contribution' } },
          { data: { id: 'cS1', name: 'Deadline?', weight: 3, faveColor: 'green', faveShape: 'triangle', type:'contribution' } },
          { data: { id: 's1', name: 'sol1', weight: 3, faveColor: 'green', faveShape: 'ellipse', type:'submission' } },
          { data: { id: 's1', name: 'sol2', weight: 3, faveColor: 'green', faveShape: 'ellipse', type:'submission' } }
          
        ]*/,
        edges: dEdges/*[
          { data: { source: 'm', target: 'res', faveColor: 'lightblue', strength: 3, label: 'resource' } },
          { data: { source: 'm', target: 'mod', faveColor: 'lightblue', strength: 3, label: 'moderated_by' } },
          { data: { source: 'm', target: 'ass1', faveColor: 'lightblue', strength: 3, label:'assignment' } },
          { data: { source: 'ass1', target: 'mod', faveColor: 'lightblue', strength: 1, label:'created_by' } },
          { data: { source: 'cE1', target: 'e', faveColor: 'lightblue', strength: 1, label:'created_by' } },
          { data: { source: 'e', target: 'g', faveColor: 'lightblue', strength: 3,  label: 'follows' } },
         
          { data: { source: 'e', target: 'm', faveColor: 'lightblue', strength: 3, label: 'student_of' } },
          
          { data: { source: 's', target: 'm', faveColor: 'lightblue', strength: 3, label: 'student_of' } },  
          
          { data: { source: 'k', target: 'm', faveColor: 'lightblue', strength: 3, label: 'student_of' } },
               
          { data: { source: 'g', target: 'm', faveColor: 'lightblue', strength: 3, label: 'student_of' } },
          { data: { source: 's1', target: 'e', faveColor: 'lightblue', strength: 3, label: 'submitted_by' } },
          { data: { source: 's1', target: 'ass1', faveColor: 'lightblue', strength: 3, label: 'submitted_for' } },
          { data: { source: 'qK1', target: 'k', faveColor: 'lightblue', strength: 3, label: 'question_by' } },
          { data: { source: 'qK1', target: 'cE1', faveColor: 'lightblue', strength: 3, label: 'answered_with' } },
          { data: { source: 'cS1', target: 's', faveColor: 'lightblue', strength: 3, label: 'comment_by' } },

          { data: { source: 'cE1', target: 'cS1', faveColor: 'lightblue', strength: 3, label: 'comment_for' } }
        ]*/
      },
      

      ready: function(){
        window.cy = this;
        
        // giddy up
      }
    });

    
}



$(document).ready(function(){



		var dNodes = [];
		var dEdges = [];

		  $.get( "/graph/all", function( data ) {
		      //console.log(data);
		      data.nodes.map( function(node){
		          var id = node.id;
		          var type = node.type;
		          var faveShape;
		          if(type=="module"){
		            faveShape = "rectangle";
		          }
		          if(type=="user")
		          { faveShape = "ellipse";
		          }
		          if(type=="contribution"){
		            faveShape = "triangle";
		          }
		          dNodes.push({ 
		              data: {
		              id: id, name: 'S', weight: 2, faveShape: faveShape, type: type
		            }
		          });

		      })

		      
		      data.links.map(function(edge){

		          var src = edge.source;
		          var des = edge.target;

		          dEdges.push({
		          data: { 
		            source: src, target: des, strength: 3, label: 'student_of' 
		            }

		          });
		      })

		      makeGraph(dNodes, dEdges);
		     
  		})



		 $(window).load(function() {
		   cy.on('mouseover','node', function(evt){
	      var name = evt.cyTarget.data('name');
	      var data = evt.cyTarget.data();
	      console.log( 'tap '+name   );

	      $('#activeUser').html("Type: " + data.type +"<br>Name:"+ data.name + "<br>ID:" + data.id);
	      
	      evt.cyTarget.css({ content: name});
   		 });

	    cy.on('mouseout','node', function(evt){
	      var name = evt.cyTarget.data('name');

	      $('#activeUser').html("");
	      
	      evt.cyTarget.css({ content: ''});
	    });

	    cy.on('tap','node', function(evt){
	     // var name = evt.cyTarget.data('name');

	     // $('#activeUser').html(name);
	      
	      //evt.cyTarget.css({ content: name});
		    	cy.elements().removeClass('highlighted');
		     evt.cyTarget.addClass('highlighted');
		     evt.cyTarget.css({ 'width': 10});

			    var node = evt.cyTarget;
			    var directlyConnected = node.neighborhood();

			    directlyConnected.nodes().addClass('highlighted');

			    node.connectedEdges().addClass('highlighted');
	    });
		 });

}); // on dom ready  


