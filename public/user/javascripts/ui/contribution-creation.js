(function() {
  var global, graph, height, update, width,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  width = 960;

  height = 500;

  /* SELECTION - store the selected node
  */

  global = {
    selection: null
  };

  /* create some fake data
  */

  var graph;
  d3.json('/api/all', function(error, data){

    var nodes = data.nodes.map(function(node){
      return { 'id': node.title, 
               'x' : 469 + Math.round(Math.random()*20),
               'y' : 248 + Math.round(Math.random()*20),
               'type' : node.label
             }
    })

    console.log("nodes:", nodes);

    var links = data.links.map(function(link){
      return { 'source': link.source.title, 
               'target': link.target.title
             }
    })

    console.log("links:", links);


    graph = {
      nodes: nodes,
      links: links,
      objectify: (function() {
        /* resolve node IDs (not optimized at all!)
        */
        var l, n, _i, _len, _ref, _results;
        _ref = graph.links;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          l = _ref[_i];
          _results.push((function() {
            var _j, _len2, _ref2, _results2;
            _ref2 = graph.nodes;
            _results2 = [];
            for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
              n = _ref2[_j];
              if (l.source === n.id) {
                l.source = n;
                continue;
              }
              if (l.target === n.id) {
                l.target = n;
                continue;
              } else {
                _results2.push(void 0);
              }
            }
            return _results2;
          })());
        }
        return _results;
      }),
      remove: (function(condemned) {
        /* remove the given node or link from the graph, also deleting dangling links if a node is removed
        */      if (__indexOf.call(graph.nodes, condemned) >= 0) {
          graph.nodes = graph.nodes.filter(function(n) {
            return n !== condemned;
          });
          return graph.links = graph.links.filter(function(l) {
            return l.source.id !== condemned.id && l.target.id !== condemned.id;
          });
        } else if (__indexOf.call(graph.links, condemned) >= 0) {
          return graph.links = graph.links.filter(function(l) {
            return l !== condemned;
          });
        }
      }),
      last_index: 0,
      add_node: (function() {
        var n;
        n = {
          id: graph.last_index++,
          x: width / 2,
          y: height / 2,
          type: 'X'
        };
        return graph.nodes.push(n);
      })
    };

    graph.objectify();

  });

  

  window.createGraph = (function() {

    console.log("creating graph");
    /* create the SVG
    */
    var container, svg;
    svg = d3.select('#graph').append('svg').attr('width', width).attr('height', height);
    /* ZOOM and PAN
    */
    /* create container elements
    */
    container = svg.append('g');
    container.call(d3.behavior.zoom().scaleExtent([0.5, 8]).on('zoom', (function() {
      return global.vis.attr('transform', "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    })));
    global.vis = container.append('g');
    /* create a rectangular overlay to catch events
    */
    /* WARNING rect size is huge but not infinite. this is a dirty hack
    */
    global.vis.append('rect').attr('class', 'overlay').attr('x', -500000).attr('y', -500000).attr('width', 1000000).attr('height', 1000000).on('click', (function(d) {
      /* SELECTION
      */      global.selection = null;
      d3.selectAll('.node').classed('selected', false);
      return d3.selectAll('.link').classed('selected', false);
    }));
    /* END ZOOM and PAN
    */
    global.colorify = d3.scale.category10();
    /* initialize the force layout
    */
    global.force = d3.layout.force().size([width, height]).charge(-400).linkDistance(60).on('tick', (function() {
      /* update nodes and links
      */      global.vis.selectAll('.node').attr('transform', function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
      return global.vis.selectAll('.link').attr('x1', function(d) {
        return d.source.x;
      }).attr('y1', function(d) {
        return d.source.y;
      }).attr('x2', function(d) {
        return d.target.x;
      }).attr('y2', function(d) {
        return d.target.y;
      });
    }));
    /* DELETION - pressing DEL deletes the selection
    */
    /* CREATION - pressing N creates a new node
    */
    d3.select(window).on('keydown', function() {
      if (d3.event.keyCode === 46) {
        if (global.selection != null) {
          graph.remove(global.selection);
          global.selection = null;
          return update();
        }
      } else if (d3.event.keyCode === 78) {
        graph.add_node();
        return update();
      }
    });
    return update();
  });

  update = function() {
    /* update the layout
    */
    var links, new_nodes, nodes;
    global.force.nodes(graph.nodes).links(graph.links).start();
    /* create nodes and links
    */
    /* (links are drawn first to make them appear under the nodes)
    */
    /* also, overwrite the selections with their databound version
    */
    links = global.vis.selectAll('.link').data(graph.links, function(d) {
      return "" + d.source.id + "->" + d.target.id;
    });
    links.enter().append('line').attr('class', 'link').on('click', (function(d) {
      /* SELECTION
      */      global.selection = d;
      d3.selectAll('.link').classed('selected', function(d2) {
        return d2 === d;
      });
      return d3.selectAll('.node').classed('selected', false);
    }));
    links.exit().remove();
    /* also define a drag behavior to drag nodes
    */
    /* dragged nodes become fixed
    */
    nodes = global.vis.selectAll('.node').data(graph.nodes, function(d) {
      return d.id;
    });
    new_nodes = nodes.enter().append('g').attr('class', 'node').call(global.force.drag().on('dragstart', function(d) {
      return d.fixed = true;
    })).on('click', (function(d) {
      /* SELECTION
      */      global.selection = d;
      d3.selectAll('.node').classed('selected', function(d2) {
        return d2 === d;
      });
      return d3.selectAll('.link').classed('selected', false);
    }));
    new_nodes.append('circle').attr('r', 18).attr('stroke', function(d) {
      return global.colorify(d.type);
    }).attr('fill', function(d) {
      return d3.hcl(global.colorify(d.type)).brighter(3);
    });
    /* draw the label
    */
    new_nodes.append('text').text(function(d) {
      return d.id;
    }).attr('dy', '0.35em').attr('fill', function(d) {
      return global.colorify(d.type);
    });
    return nodes.exit().remove();
  };

}).call(this);