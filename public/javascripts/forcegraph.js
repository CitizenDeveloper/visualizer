$(document).ready(function() {
  $('.button').on('click', function() {
    if (validResponse()) {
      $('.errors').hide()
      $('.answer').show()
    } else {
      $('.errors').show()
    }
  })

  function validResponse() {
    try {
      var submission = $('textarea').val()
        , json = JSON.parse(submission)

      json.nodes.forEach(function(el) {
        if (!hasAttributes(el, ['name', 'group'])) throw 'Incorrect!'
      })

      json.links.forEach(function(el) {
        if (!hasAttributes(el, ['source', 'target', 'value'])) throw 'Incorrect!'
      })

      return true
    } catch (e) {
      return false
    }
  }

  function hasAttributes(object, attributes) {
    attributes.forEach(function(attribute) {
      if (!object.hasOwnProperty(attribute)) return false
    })
    return true
  }

  // d3 implementation

  function populateAnswer(graph, element, width, height) {
    var width = width,
        height = height;

    var color = d3.scale.category20();

    var force = d3.layout.force()
        .charge(-120)
        .linkDistance(30)
        .size([width, height]);

    var svg = d3.select(element).append("svg")
        .attr("width", width)
        .attr("height", height);

    force.nodes(graph.nodes).links(graph.links).start()

    var link = svg.selectAll(".link")
        .data(graph.links)
      .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = svg.selectAll(".node")
        .data(graph.nodes)
      .enter().append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .style("fill", function(d) { return color(d.group); })
        .call(force.drag);

    node.append("title")
        .text(function(d) { return d.name; });

    force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    });
  }

  var graph = {
    "nodes" : [
      {"name" : "Cindy", "group" : 1},
      {"name" : "Jonathan", "group" : 2},
      {"name" : "Marilyn", "group" : 2},
      {"name" : "Mark", "group" : 2},
      {"name" : "Robert", "group" : 1},
      {"name" : "Exxon Mobil", "group" : 3},
      {"name" : "Valero Energy", "group" : 3},
      {"name" : "General Electric", "group" : 3},
      {"name" : "Apple", "group" : 3}
    ],
    "links" : [
      {"source" : 0, "target" : 5 , "value" : 1},
      {"source" : 1, "target" : 6 , "value" : 6},
      {"source" : 2, "target" : 7 , "value" : 1},
      {"source" : 2, "target" : 5 , "value" : 1},
      {"source" : 0, "target" : 7 , "value" : 2},
      {"source" : 1, "target" : 7 , "value" : 3},
      {"source" : 2, "target" : 8 , "value" : 4},
      {"source" : 1, "target" : 5 , "value" : 2},
      {"source" : 0, "target" : 8 , "value" : 1}
    ]
  }

  var example = {
    "nodes":[
      {"name":"Myriel","group":1},
      {"name":"Napoleon","group":1},
      {"name":"Mlle.Baptistine","group":1},
      {"name":"Mme.Magloire","group":1},
      {"name":"CountessdeLo","group":1},
      {"name":"Geborand","group":1},
      {"name":"Champtercier","group":1},
      {"name":"Cravatte","group":1},
      {"name":"Count","group":1},
      {"name":"OldMan","group":1},
      {"name":"Labarre","group":2},
      {"name":"Valjean","group":2},
      {"name":"Marguerite","group":3},
      {"name":"Mme.deR","group":2},
      {"name":"Isabeau","group":2},
      {"name":"Gervais","group":2},
      {"name":"Tholomyes","group":3},
      {"name":"Listolier","group":3},
      {"name":"Fameuil","group":3},
      {"name":"Blacheville","group":3},
      {"name":"Favourite","group":3},
      {"name":"Dahlia","group":3},
      {"name":"Zephine","group":3},
      {"name":"Fantine","group":3}
    ],
    "links":[
      {"source":1,"target":0,"value":1},
      {"source":2,"target":0,"value":8},
      {"source":3,"target":0,"value":10},
      {"source":3,"target":2,"value":6},
      {"source":4,"target":0,"value":1},
      {"source":5,"target":0,"value":1},
      {"source":6,"target":0,"value":1},
      {"source":7,"target":0,"value":1},
      {"source":8,"target":0,"value":2},
      {"source":9,"target":0,"value":1},
      {"source":11,"target":10,"value":1},
      {"source":11,"target":3,"value":3},
      {"source":11,"target":2,"value":3},
      {"source":11,"target":0,"value":5},
      {"source":12,"target":11,"value":1},
      {"source":13,"target":11,"value":1},
      {"source":14,"target":11,"value":1},
      {"source":15,"target":11,"value":1},
      {"source":17,"target":16,"value":4},
      {"source":18,"target":16,"value":4},
      {"source":18,"target":17,"value":4},
      {"source":19,"target":16,"value":4},
      {"source":19,"target":17,"value":4},
      {"source":19,"target":18,"value":4},
      {"source":20,"target":16,"value":3},
      {"source":20,"target":17,"value":3},
      {"source":20,"target":18,"value":3},
      {"source":20,"target":19,"value":4},
      {"source":21,"target":16,"value":3},
      {"source":21,"target":17,"value":3},
      {"source":21,"target":18,"value":3},
      {"source":21,"target":19,"value":3},
      {"source":21,"target":20,"value":5},
      {"source":22,"target":16,"value":3},
      {"source":22,"target":17,"value":3},
      {"source":22,"target":18,"value":3},
      {"source":22,"target":19,"value":3},
      {"source":22,"target":20,"value":4},
      {"source":22,"target":21,"value":4},
      {"source":23,"target":16,"value":3},
      {"source":23,"target":17,"value":3},
      {"source":23,"target":18,"value":3},
      {"source":23,"target":19,"value":3},
      {"source":23,"target":20,"value":4},
      {"source":23,"target":21,"value":4},
      {"source":23,"target":22,"value":4},
      {"source":23,"target":12,"value":2},
      {"source":23,"target":11,"value":9}
    ]
  }

  populateAnswer(graph, '.chart', 600, 300)
  populateAnswer(example, '.example', 600, 300)
})
