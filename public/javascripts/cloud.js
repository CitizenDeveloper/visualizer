$(document).ready(function() {
  $('.button').on('click', function() {
    if (validResponse()) {
      $('.errors').hide()
      $('.answer').show()
      $('.answer svg').remove()

      var submission = JSON.parse($('textarea').val())
      populateAnswer(parseText(submission.join(' ')), '.answer .chart', 700, 400)
    } else {
      $('.errors').show()
    }
  })

  function validResponse() {
    try {
      var submission = $('textarea').val()
        , array = JSON.parse(submission)
      if (!array.constructor === Array) {
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

  function populateAnswer(wordset, element, width, height) {
    var fill = d3.scale.category20b();

    var svg = d3.select(element).append('svg')
      .attr('width', width)
      .attr('height', height);

    var wordset = wordset

    var background = svg.append("g")
      , vis = svg.append("g")
      .attr("transform", "translate(" + [width >> 1, height >> 1] + ")");

    var fontSize = d3.scale.log().range([10, 100]);

    var layout = d3.layout.cloud()
      .size([width, height])
      .timeInterval(10)
      .text(function(d) { return d.key; })
      .font('Impact')
      .fontSize(function(d) { return fontSize(+d.value); })
      .rotate(function(d) { return ~~(Math.random() * 5) * 30 - 60; })
      .padding(1)
      .on('word', progress)
      .on('end', draw)
      .words(wordset)
      .start();

    function progress(d) {
    }

    function draw(data, bounds) {
      scale = bounds ? Math.min(
          width / Math.abs(bounds[1].x - width / 2),
          width / Math.abs(bounds[0].x - width / 2),
          height / Math.abs(bounds[1].y - height / 2),
          height / Math.abs(bounds[0].y - height / 2)) / 2 : 1;
      words = data;
      var text = vis.selectAll('text')
          .data(words, function(d) { return d.text.toLowerCase(); });
      text.transition()
          .duration(1000)
          .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
          .style("font-size", function(d) { return d.size + "px"; });
      text.enter().append("text")
          .attr("text-anchor", "middle")
          .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
          .style("font-size", function(d) { return d.size + "px"; })
          .on("click", function(d) {
            load(d.text);
          })
          .style("opacity", 1e-6)
        .transition()
          .duration(1000)
          .style("opacity", 1);
      text.style("font-family", function(d) { return d.font; })
          .style("fill", function(d) { return fill(d.text.toLowerCase()); })
          .text(function(d) { return d.text; });
      var exitGroup = background.append("g")
          .attr("transform", vis.attr("transform"));
      var exitGroupNode = exitGroup.node();
      text.exit().each(function() {
        exitGroupNode.appendChild(this);
      });
      exitGroup.transition()
          .duration(1000)
          .style("opacity", 1e-6)
          .remove();
      vis.transition()
          .delay(1000)
          .duration(750)
          .attr("transform", "translate(" + [width >> 1, height >> 1] + ")scale(" + scale + ")");
    }
  }

  function parseText(text){
    var stopWords = /^(hadn't)$/

    var punctuation = /[!"&()*+,-\.\/:;<=>?\[\\\]^`\{|\}~]+/g
    var wordSeparators = /[\s\u3031-\u3035\u309b\u309c\u30a0\u30fc\uff70]+/g
    var discard = /^(@|https?:)/
    var maxLength = 30


    function entries(map) {
      var entries = [];
      for (var key in map) entries.push({
        key: key,
        value: map[key]
      });
      return entries;
    };

    function parser(text) {
      var tags = {};
      var cases = {};
      text.split(wordSeparators).forEach(function(word) {
        if (discard.test(word)) return;
        word = word.replace(punctuation, "");
        if (stopWords.test(word.toLowerCase())) return;
        word = word.substr(0, maxLength);
        cases[word.toLowerCase()] = word;
        tags[word = word.toLowerCase()] = (tags[word] || 0) + 1;
      });
      tags = entries(tags).sort(function(a, b) { return b.value - a.value; });
      tags.forEach(function(d) { d.key = cases[d.key]; });
      return tags;
    }

    return parser(text);
  }

  var example = [
    "The",
    "latest",
    "market",
    "research",
    "science",
    "tells",
    "us",
    "that",
    "if",
    "we",
    "want",
    "to",
    "really",
    "connect",
    "with",
    "our",
    "customers",
    "we",
    "should",
    "use",
    "the",
    "same",
    "language",
    "that",
    "they",
    "use.",
    "In",
    "preparation",
    "for",
    "an",
    "upcoming",
    "marketing",
    "campaign",
    "the",
    "Director",
    "of",
    "Marketing",
    "suggests",
    "we",
    "review",
    "our",
    "online",
    "presence",
    "to",
    "confirm",
    "that",
    "we're",
    "using",
    "language",
    "that",
    "resonates",
    "with",
    "our",
    "community.",
    "Citizen",
    "Developer",
    "Visualization",
    "Challenges",
    "Here's",
    "a",
    "word",
    "cloud",
    "of",
    "this",
    "page",
    "This",
    "challenge",
    "invites",
    "you",
    "to",
    "reshape",
    "the",
    "data",
    "exported",
    "so",
    "it",
    "can",
    "be",
    "rendered",
    "as",
    "a",
    "word",
    "cloud.",
    "Once",
    "you",
    "have",
    "that",
    "diagram",
    "you'll",
    "better",
    "understand",
    "what",
    "language",
    "to",
    "use",
    "when",
    "conversing",
    "with",
    "your",
    "customers.",
    "Good",
    "luck!",
    "The",
    "word",
    "cloud",
    "that",
    "you've",
    "chosen",
    "requires",
    "data",
    "encoded",
    "as",
    "an",
    "array",
    "or",
    "list",
    "of",
    "JSON",
    "objects",
    "or",
    "dictionaries",
    "each",
    "with",
    "the",
    "value",
    "of",
    "the",
    "word",
    "and",
    "the",
    "frequency",
    "of",
    "the",
    "words",
    "occurrence.",
    "The",
    "final",
    "output",
    "of",
    "which",
    "will",
    "look",
    "something",
    "like",
    "this"
  ]

  populateAnswer(parseText(example.join(' ')), '.example', 700, 400)
})

