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
        , matrix = JSON.parse(submission)

      if (!(
        matrix.length === 8    && matrix.constructor === Array &&
        matrix[0].length === 8 && matrix[0].constructor === Array &&
        matrix[1].length === 8 && matrix[1].constructor === Array &&
        matrix[2].length === 8 && matrix[2].constructor === Array &&
        matrix[3].length === 8 && matrix[3].constructor === Array &&
        matrix[4].length === 8 && matrix[4].constructor === Array &&
        matrix[5].length === 8 && matrix[5].constructor === Array &&
        matrix[6].length === 8 && matrix[6].constructor === Array &&
        matrix[7].length === 8 && matrix[7].constructor === Array
      )) {
        throw 'Incorrect'
      }

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

  function populateAnswer(matrix, element, width, height) {
    var chord = d3.layout.chord()
        .padding(.05)
        .sortSubgroups(d3.descending)
        .matrix(matrix);

    var width = width,
        height = height,
        innerRadius = Math.min(width, height) * .41,
        outerRadius = innerRadius * 1.1;

    var fill = d3.scale.ordinal()
        .domain(d3.range(4))
        .range(["#000000", "#FFDD89", "#957244", "#F26223"]);

    var svg = d3.select(element).append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.append("g").selectAll("path")
        .data(chord.groups)
      .enter().append("path")
        .style("fill", function(d) { return fill(d.index); })
        .style("stroke", function(d) { return fill(d.index); })
        .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
        .on("mouseover", fade(.1))
        .on("mouseout", fade(1));

    var ticks = svg.append("g").selectAll("g")
        .data(chord.groups)
      .enter().append("g").selectAll("g")
        .data(groupTicks)
      .enter().append("g")
        .attr("transform", function(d) {
          return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
              + "translate(" + outerRadius + ",0)";
        });

    ticks.append("line")
        .attr("x1", 1)
        .attr("y1", 0)
        .attr("x2", 5)
        .attr("y2", 0)
        .style("stroke", "#000");

    ticks.append("text")
        .attr("x", 8)
        .attr("dy", ".35em")
        .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
        .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .text(function(d) { return d.label; });

    svg.append("g")
        .attr("class", "chord")
      .selectAll("path")
        .data(chord.chords)
      .enter().append("path")
        .attr("d", d3.svg.chord().radius(innerRadius))
        .style("fill", function(d) { return fill(d.target.index); })
        .style("opacity", 1);

    // Returns an array of tick angles and labels, given a group.
    function groupTicks(d) {
      var k = (d.endAngle - d.startAngle) / d.value;
      return d3.range(0, d.value, 1000).map(function(v, i) {
        return {
          angle: v * k + d.startAngle,
          label: i % 5 ? null : v / 1000 + "k"
        };
      });
    }

    // Returns an event handler for fading a given chord group.
    function fade(opacity) {
      return function(g, i) {
        svg.selectAll(".chord path")
            .filter(function(d) { return d.source.index != i && d.target.index != i; })
          .transition()
            .style("opacity", opacity);
      };
    }
  }

  var example = [
    [11975,  5871, 8916, 2868],
    [ 1951, 10048, 2060, 6171],
    [ 8010, 16145, 8090, 8045],
    [ 1013,   990,  940, 6907]
  ]

  populateAnswer(example, '.example', 700, 600)

  var matrix = [
    [ 0, 0, 0, 0, 0, 1, 1, 1],
    [ 0, 0, 0, 0, 1, 0, 1, 1],
    [ 0, 0, 0, 0, 1, 0, 1, 1],
    [ 0, 0, 0, 0, 1, 0, 1, 1],
    [ 0, 1, 1, 1, 0, 0, 0, 0],
    [ 1, 0, 0, 0, 0, 0, 0, 0],
    [ 1, 1, 1, 1, 0, 0, 0, 0],
    [ 1, 1, 1, 1, 0, 0, 0, 0],
  ]

  var groups = [
    'Internal API',
    'External API',
    'website',
    'course API',
    'customer A',
    'customer B',
    'customer C',
    'customer D'
  ]

  var chart = d3.chart.dependencyWheel();
  d3.select('.chart').datum({
    packageNames: groups,
    matrix: matrix
  }).call(chart);
})
