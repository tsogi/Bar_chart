var margin = { top:0 , right:0 , bottom:20 , left:30 }

var screen_width;
var screen_height;

var chart_container_width;
var chart_container_height;

var chart_width;
var chart_height;

var months = [{"Month":"Jan", "Quantity": 0}, {"Month":"Feb","Quantity": 0}, {"Month":"Mar","Quantity": 0}, {"Month":"Apr","Quantity": 0}, {"Month":"May","Quantity": 0}, {"Month":"Jun","Quantity": 0}, {"Month":"Jul","Quantity": 0}, {"Month":"Aug","Quantity": 0}, {"Month":"Sep","Quantity": 0}, {"Month":"Oct","Quantity": 0}, {"Month":"Nov","Quantity": 0}, {"Month":"Dec","Quantity": 0}];

var month_details = [ { "Day" : "1", "Quantity" :22 }, { "Day" : "2", "Quantity" :16 }, {"Day" : "3", "Quantity" :42}, {"Day" : "4", "Quantity" :19}, {"Day" : "5", "Quantity" :38}, {"Day" : "6", "Quantity" :46}, { "Day" : "7", "Quantity" :25 }, { "Day" : "8", "Quantity" :33 }, { "Day" : "9", "Quantity" :14 }, { "Day" : "10", "Quantity" :16 }, { "Day" : "11", "Quantity" :41 }, { "Day" : "12", "Quantity" :18 }, { "Day" : "13", "Quantity" :8 }, { "Day" : "14", "Quantity" :35 }, { "Day" : "15", "Quantity" :22 }, { "Day" : "16", "Quantity" :29 }, { "Day" : "17", "Quantity" :13 }, { "Day" : "18", "Quantity" :17 }, { "Day" : "19", "Quantity" :46 }, { "Day" : "20", "Quantity" :40 }, { "Day" : "21", "Quantity" :15 }, { "Day" : "22", "Quantity" :27 }, { "Day" : "23", "Quantity" :19 }, { "Day" : "24", "Quantity" :22 }, { "Day" : "25", "Quantity" :29 }, { "Day" : "26", "Quantity" :37 }, { "Day" : "27", "Quantity" :34 }, { "Day" : "28", "Quantity" :38 }, { "Day" : "29", "Quantity" :15 }, { "Day" : "30", "Quantity" :19 }, { "Day" : "31", "Quantity" :9 } ];

// Starting point of the script execution
define_chart_dimensions();
generate_random_months_data();
draw_chart_of_months(months);

window.onresize = function (){
  define_chart_dimensions();
  draw_chart_of_months(months);
}

function draw_chart_of_months(data){
  var horizontal_scale = d3.scaleBand().domain(data.map(function(item){return item.Month})).rangeRound([0,chart_width]);
  var vertical_scale = d3.scaleLinear().domain([0,d3.max(data, function(item){return item.Quantity})]).range([chart_height, 0]);
  var bar_width = chart_width / data.length - chart_width / data.length / 2;
  var bar_horizontal_margin = (chart_width / data.length - bar_width) / 2;
  var xAxis = d3.axisBottom(horizontal_scale);
  var yAxis = d3.axisLeft(vertical_scale);

  var chart = d3.select("#d3_wrapper svg").attr("width", chart_container_width).attr("height", chart_container_height)
    .select("g").attr("width", chart_width).attr("height", chart_height).attr("transform", "translate("+margin.left+", "+margin.top+")");

  d3.select(".x.axis").remove();
  chart.append("g").attr("class", "x axis").attr("transform", "translate(0,"+(chart_container_height - margin.bottom)+")").call(xAxis).call(adjustxAxisTextForMonths);
  d3.select(".y.axis").remove();
  chart.append("g").attr("class", "y axis").call(yAxis);

  var bar = chart.selectAll(".bar").data(data);

  var update = bar.select("rect").attr("x", function(d,i) {return horizontal_scale(d.Month) + bar_horizontal_margin})
    .attr("y", function(d){return vertical_scale(d.Quantity)})
    .attr("width", bar_width)
    .on("mouseover", function(d,i){
        d3.select(this.parentNode).append("text").attr("x", function(d,i) {return horizontal_scale(d.Month) + bar_horizontal_margin + bar_width/2 + 5}).text(d.Quantity).attr("y", function(d){return vertical_scale(d.Quantity) + 15});
      })
    .attr("height", function(d){ return chart_height - vertical_scale(d.Quantity)});

  var enter = bar.enter().append("g").attr("class", "bar");
  enter.append("rect").attr("x", function(d,i) {return horizontal_scale(d.Month) + bar_horizontal_margin})
    .attr("y", function(d){return vertical_scale(d.Quantity)})
    .attr("width", bar_width)
    .on("click", function(d, i) { month_selected(d)})
    .on("mouseover", function(d,i){
        d3.select(this.parentNode).append("text").attr("x", function(d,i) {return horizontal_scale(d.Month) + bar_horizontal_margin + bar_width/2 + 5}).text(d.Quantity).attr("y", function(d){return vertical_scale(d.Quantity) + 15});
      })
    .on("mouseout", function(d,i){
        d3.select(this.parentNode).selectAll("text").remove();
      })
    .transition().delay(function(d,i){return i * 10})
    .attr("height", function(d){ return chart_height - vertical_scale(d.Quantity)}).attr("class", "month_bar");

  var exit = bar.exit();
    exit.select("rect").transition().duration("1000").attr("height", 0);
}

function draw_chart_of_days(days){
  var horizontal_scale = d3.scaleBand().domain(days.map(function(item){return item.Day})).rangeRound([0,chart_width]);
  var vertical_scale = d3.scaleLinear().domain([0,d3.max(days, function(item){return item.Quantity})]).range([chart_height, 0]);
  var bar_width = chart_width / days.length - chart_width / days.length / 2;
  var bar_horizontal_margin = (chart_width / days.length - bar_width) / 2;
  var xAxis = d3.axisBottom(horizontal_scale);
  var yAxis = d3.axisLeft(vertical_scale);

  var chart = d3.select("#d3_wrapper svg").attr("width", chart_container_width).attr("height", chart_container_height)
    .select("g").attr("width", chart_width).attr("height", chart_height).attr("transform", "translate("+margin.left+", "+margin.top+")");

  var bar = chart.selectAll(".bar").data(days);

  d3.select(".x.axis").remove();
  chart.append("g").attr("class", "x axis").attr("transform", "translate(0,"+(chart_container_height - margin.bottom)+")").call(xAxis).call(adjustxAxisTextForDays);
  d3.select(".y.axis").remove();
  chart.append("g").attr("class", "y axis").call(yAxis);

  var g = bar.enter().append("g").attr("class", "bar");

  g.append("rect").attr("x", function(d,i) {return horizontal_scale(d.Day) + bar_horizontal_margin})
    .attr("y", function(d){return vertical_scale(d.Quantity)})
    .attr("width", bar_width)
    .on("mouseover", function(d,i){
        d3.select(this.parentNode).append("text").attr("x", function(d,i) {return horizontal_scale(d.Day) + bar_horizontal_margin + bar_width/2 + 5}).text(d.Quantity).attr("y", function(d){return vertical_scale(d.Quantity) + 15});
      })
    .on("mouseout", function(d,i){
        d3.select(this.parentNode).selectAll("text").remove();
      })
    .transition().delay(function(d,i){return i * 10})
    .attr("height", function(d){ return chart_height - vertical_scale(d.Quantity)})
    .attr("class", "day_bar");

  var exit = bar.exit();
    exit.select("rect").transition().duration("1000").attr("height", "0");
}

function define_chart_dimensions(){
  screen_width = get_screen_width_height().width;
  screen_height = get_screen_width_height().height;

  chart_container_width = define_chart_container_width(screen_width);
  chart_container_height = define_chart_container_height(screen_height);

  chart_width = chart_container_width - margin.right - margin.left;
  chart_height = chart_container_height - margin.top - margin.bottom;
}

function month_selected(month){
  draw_chart_of_months([]);
  setTimeout(function(){
    d3.selectAll(".chart g").remove();
    d3.select(".chart").append("g");
    draw_chart_of_days(month_details);
    draw_show_months_button();
  }, 1000);
}

function draw_months_back(d){
  draw_chart_of_days([]);
  setTimeout(function(){
    d3.select(".chart").selectAll("*").remove();
    d3.select(".chart").append("g");
    draw_chart_of_months(months);
  }, 1000);
}

function adjustxAxisTextForMonths(selection){
  selection.selectAll("text").attr("transform", "translate(8,0)");
}

function adjustxAxisTextForDays(selection){
  selection.selectAll("text").attr("transform", "translate(4,0)");
}

function generate_random_months_data(){
  for(var i = 0; i < months.length; i++){
    months[i].Quantity = Math.floor(Math.random() * (100 - 0) + 0);
  }
}

function draw_show_months_button(){
  d3.select(".chart").append('text').attr("class", "show_months").attr("x", 130).attr("y", 8).text("Go Back To Months").on("click", function(d){
    draw_months_back();
  });
}

function define_chart_container_width(screen_width){
  if(screen_width > 1000) {
    return 1000;
  } else {
    return screen_width - 30;
  }
}

function define_chart_container_height(screen_height){
  if(screen_height > 500) {
    return 500;
  } else {
    return screen_height - 20;
  }
}

function get_screen_width_height(){
  var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
  return {width:x, height:y}
}
