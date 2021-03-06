(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('.collapsible').collapsible();
  }); // end of document ready
})(jQuery); // end of jQuery name space

var high_list = []

// Set the dimensions of the graph
var margin = {top: 30, right: 0, bottom: 30, left: 122},
    width = 1280 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%Y-%m-%d").parse;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var    yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

var valueline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.high); });
    
  
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" 
            + margin.left 
            + "," + margin.top + ")");

var stock = document.getElementById('stock').value;
var start = document.getElementById('start').value;
var end = document.getElementById('end').value;

var inputURL = "http://query.yahooapis.com/v1/public/yql"+
    "?q=select%20*%20from%20yahoo.finance.historicaldata%20"+
    "where%20symbol%20%3D%20%22"
    +stock+"%22%20and%20startDate%20%3D%20%22"
    +start+"%22%20and%20endDate%20%3D%20%22"
    +end+"%22&format=json&env=store%3A%2F%2F"
    +"datatables.org%2Falltableswithkeys";

    // Get the data 
    d3.json(inputURL, function(error, data){

    var i = 0;
    
    // console.log(m)
    data.query.results.quote.forEach(function(d) {
        d.date = parseDate(d.Date);
        d.high = +d.High;
        d.low = +d.Low;
        // svg.append("circle")
        // .attr("r", (d.high) )
        // .attr("cx",241*i)
        // .attr("cy", 680 - 680*((d.high-44.64)/2.09))
        // .attr("fill", "red")

        // i += 1;

        // console.log(d.high, d.low)
        if (high_list.length <10) {high_list.push(d.high)}        
    });
    console.log(stock)
    console.log(high_list)
    var formated_list = ""
    for (var i = high_list.length - 1; i >= 0; i--) {
        if (i != 0) {formated_list += high_list[i] + ","}
        else{
            formated_list += high_list[i]
        }
    }
    $.ajax({
        type: "GET",
        url: "http://localhost:5000/api/recommendation?tick="+stock+"&highs="+formated_list        
        // data: { tick: stock, location: "Boston" }
    }).done(function (data){
        console.log(data);
        if (data == 1) {
        $('#recommend').replaceWith('<h1 class="center">SELL SELL SELL</h1>');
        console.log(document.getElementById('recommend'))
        } else{
          $('#recommend').replaceWith('<h1 class="center">BUY BUY BUY</h1>');  
        }
    });
    // console.log(d3.max(data.query.results.quote, function(d) { return d.high; }));

    // console.log(data.query.results.quote)
    // Scale the range of the data
    x.domain(d3.extent(data.query.results.quote, function(d) {
        return d.date; }));
    y.domain([
        d3.min(data.query.results.quote, function(d) { return d.low; }), 
        d3.max(data.query.results.quote, function(d) { return d.high; })
    ]);
    console.log(d3.max(data.query.results.quote, function(d) { return d.high; }))
    console.log(d3.min(data.query.results.quote, function(d) { return d.low; }))

    svg.append("path")        // Add the valueline path.
        .attr("class", "line")
        .attr("d", valueline(data.query.results.quote));

    svg.append("g")            // Add the X Axis
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")            // Add the Y Axis
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("text")          // Add the label
        .attr("class", "label")
        .attr("transform", "translate(" + (width+3) + "," 
            + y(data.query.results.quote[0].high) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "steelblue")
        .text("high");

    svg.append("text")          // Add the title shadow
        .attr("x", (width / 2))
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .attr("class", "shadow")
        .style("font-size", "16px")
        .text(stock);
        
    svg.append("text")          // Add the title
        .attr("class", "stock")
        .attr("x", (width / 2))
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(stock);
});




// ** Update data section (Called from the onclick)
function updateData() {

var new_high_list = []
var stock = document.getElementById('stock').value;
var start = document.getElementById('start').value;
var end = document.getElementById('end').value;

var inputURL = "http://query.yahooapis.com/v1/public/yql"+
    "?q=select%20*%20from%20yahoo.finance.historicaldata%20"+
    "where%20symbol%20%3D%20%22"
    +stock+"%22%20and%20startDate%20%3D%20%22"
    +start+"%22%20and%20endDate%20%3D%20%22"
    +end+"%22&format=json&env=store%3A%2F%2F"
    +"datatables.org%2Falltableswithkeys";

    // Get the data again
    d3.json(inputURL, function(error, data){

        data.query.results.quote.forEach(function(d) {
            d.date = parseDate(d.Date);
            d.high = +d.High;
            d.low = +d.Low;
            if (new_high_list.length <=11) {new_high_list.push(d.high)}
        });
        var formated_list = ""
        for (var i = new_high_list.length - 1; i >= 0; i--) {
            if (i != 0) {formated_list += new_high_list[i] + ","}
            else{
                formated_list += new_high_list[i]
            }
        }
        $.ajax({
            type: "GET",
            url: "http://localhost:5000/api/recommendation?tick="+stock+"&highs="+formated_list        
            // data: { tick: stock, location: "Boston" }
        }).done(function (data){
            console.log(data);
            if (data == 1) {
            $('#recommend').replaceWith('<h1 class="center">SELL SELL SELL</h1>');
            console.log(document.getElementById('recommend'))
            } else{
                $('#recommend').replaceWith('<h1 class="center">BUY BUY BUY</h1>');
            }
        });      

        // Scale the range of the data
        x.domain(d3.extent(data.query.results.quote, function(d) {
            return d.date; }));
        y.domain([
            d3.min(data.query.results.quote, function(d) { 
                return d.low; }), 
            d3.max(data.query.results.quote, function(d) { 
                return d.high; })
        ]);

        // Select the section we want to apply our changes to
        var svg = d3.select("body").transition();

        // Make the changes
        svg.select(".line")    // change the line
            .duration(750) 
            .attr("d", valueline(data.query.results.quote));

        svg.select(".label")   // change the label text
            .duration(750)
            .attr("transform", "translate(" + (width+3) + "," 
            + y(data.query.results.quote[0].high) + ")");
 
        svg.select(".shadow") // change the title shadow
            .duration(750)
            .text(stock);  
             
        svg.select(".stock")   // change the title
            .duration(750)
            .text(stock);
     
        svg.select(".x.axis") // change the x axis
            .duration(750)
            .call(xAxis);
        svg.select(".y.axis") // change the y axis
            .duration(750)
            .call(yAxis);

    });
}