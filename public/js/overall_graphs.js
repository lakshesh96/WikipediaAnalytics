google.charts.load('current', {packages: ['corechart']});

var options1 = {'title':"Revisions per year by user type  ",
    'width':900,
    'height':500
};

var options2 = {'title':"Total revisions by user type  ",
    'width':400,
    'height':300
};

var data 

function drawPie(){

  var graphData = google.visualization.arrayToDataTable(data[1]);

  var options = {
    title: 'Total Revisions By User Type'
  };

  var chart = new google.visualization.PieChart($("#myChart")[0]);
  var r= $('<input type="button" value="BarChart" id="togglP"/>');
  chart.draw(graphData, options);
  var total_ = data[1][1][1] + data[1][2][1] + data[1][3][1] + data[1][4][1];

  var data_ = new Array;
  for(var i = 1; i < data[1].length; i++){
    data_.push(data[1][i])
  }

  orderd = data_.sort( (a, b) => {
    return a[1] - b[1]
  });

  var first = orderd[3][1]/total_*100
  var scnd = orderd[2][1]/total_*100
  var third = orderd[1][1]/total_*100
  var four = orderd[0][1]/total_*100
  
  var para= $('<p> The graph shows the revision number distribution by user type,' + 
  'in which ' +total_.toString()+ ' users are taken into consideration for the analysis. From the pie chart, '+ 
  'it is clear that the revisions were made mostly by '+ orderd[3][0] + ' users that cover for '+first+' percent, ' +
  'followed by ' +orderd[2][0]+ ' users with '+scnd+' percent. The ' + orderd[1][0]+ ' users stands at '+third+' percent, ' +
  'which is larger than revisions made by ' + orderd[0][0] + ' users with '+four+' percent.</p>');
  $("#myChart").append(para);
  $("#myChart").append(r);
  $("#togglP").click(function(event){
    drawBar()
  })
}

function drawLine(){
  var graphData = google.visualization.arrayToDataTable(data[0])

  var options = {
      chart: {
        title: 'Revisions per year',
        //subtitle: 'Sales, Expenses, and Profit: 2014-2017',
      },
      //bars: 'vertical', // Required for Material Bar Charts.
      hAxis: {format: 'decimal'},
      width: 1000,
      height: 600,
      colors: ['#1b9e77', '#d95f02']
    };
  var chart = new google.visualization.LineChart($("#myChart")[0]);//////////////..
  var r= $('<input type="button" value="ToggleBar" id="togglB"/>');
  var p= $('<input type="button" value="PieChart" id="togglP"/>');

  //var chart = new google.charts.Bar($("#myChart")[0]);
  //chart.draw(data, google.charts.Bar.convertOptions(options));
  chart.draw(graphData, options)
  $("#myChart").append(r);
  $("#myChart").append(p);
  $("#togglB").click(function(event){
    drawBar()
  })
  $("#togglP").click(function(event){
    drawPie()
  })
 //chart.draw(graphData, options);/////////////////////////////////////
}

function drawBar(){
  var graphData = google.visualization.arrayToDataTable(data[0])

  var options = {
      chart: {
        title: 'Revisions per year',
        //subtitle: 'Sales, Expenses, and Profit: 2014-2017',
      },
      bars: 'vertical', // Required for Material Bar Charts.
      hAxis: {format: 'decimal'},
      width: 1000,
      height: 600,
      colors: ['#1b9e77', '#d95f02']
    };
  var chart = new google.visualization.ColumnChart($("#myChart")[0]);//////////////..
  var r= $('<input type="button" value="ToggleBar" id="togglL"/>');
  var p= $('<input type="button" value="PieChart" id="togglP"/>');

  chart.draw(graphData, options)
  $("#myChart").append(r);
  $("#myChart").append(p);

  $("#togglL").click(function(event){
    console.log("TOGGLE")
    drawLine()
  })
  $("#togglP").click(function(event){
    drawPie()
  })
 //chart.draw(graphData, options);/////////////////////////////////////
}

function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(this.response)
        drawBar();
      }
    };
    xhttp.open("GET", "/Overall/graph", true);
    xhttp.send();
  }

$(document).ready(function() {

})