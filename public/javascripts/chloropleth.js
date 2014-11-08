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
        , csv = submission.split(/[,\n]/)

      if (!(csv[0] === 'id' && csv[1] === 'rate' && csv[2] === '1001')) {
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

  function populateAnswer(pathname, element, width, height, rangeMax) {
    var width = width,
        height = height;

    var rateById = d3.map();

    var quantize = d3.scale.quantize()
        .domain([0, rangeMax])
        .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

    var projection = d3.geo.albersUsa()
        .scale(580)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select(element).append("svg")
        .attr("width", width)
        .attr("height", height);

    queue()
        .defer(d3.json, '../public/datasets/chloropleth/us.json')
        .defer(d3.csv, pathname, function(d) {
          rateById.set(d.id, +d.rate);
        })
        .await(ready);

    function ready(error, us) {
      svg.append("g")
          .attr("class", "counties")
        .selectAll("path")
          .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
          .attr("class", function(d) { return quantize(rateById.get(d.id)); })
          .attr("d", path);

      svg.append("path")
          .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
          .attr("class", "states")
          .attr("d", path);
    }

    d3.select(self.frameElement).style("height", height + "px");
  }

  populateAnswer('../public/datasets/chloropleth/burrito.csv', '.example', 700, 300, .50)
  populateAnswer('../public/datasets/chloropleth/unemployment.csv', '.chart', 700, 300, 0.15)
})
