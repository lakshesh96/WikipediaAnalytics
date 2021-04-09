google.charts.load('current', {packages: ['corechart']});



var data

function drawBar1(){

    var options = {'title':"Distribution of users by year",
        'width':800,
        'height':600
    };
    graphData = new google.visualization.DataTable();
    graphData.addColumn('string', 'year');
    graphData.addColumn('number', 'admins');
    graphData.addColumn('number', 'anona');
    graphData.addColumn('number', 'bots');
    graphData.addColumn('number', 'regulars');

    dataBar = data.bar1;

    for (let i = 0; i < dataBar.length; i++)
        graphData.addRow([dataBar[i].year.toString(), dataBar[i].admins,dataBar[i].anons,dataBar[i].bots,dataBar[i].regulars]);


    var chart = new google.visualization.ColumnChart($("#myChart")[0]);
    chart.draw(graphData, options);
}

function drawBar2(person){

    var options = {'title':"Distribution of revisions of user "+dataBar[person].user+" by year",
        'width':800,
        'height':600
    };
    graphData = new google.visualization.DataTable();
    graphData.addColumn('string', 'Year');
    graphData.addColumn('number', 'Revisions');
    dataBar = data.bar2;
    for (let i = 0; i < dataBar[person].data.length; i++)
        graphData.addRow([dataBar[person].data[i].year.toString(),dataBar[person].data[i].totalRevs]);

    var chart = new google.visualization.ColumnChart($("#myChart")[0]);
    chart.draw(graphData, options);
}

function drawPie1(){

    var options = {'title':"Composition of Earth's atmosphere  ",
        'width':800,
        'height':600
    };
    graphData = new google.visualization.DataTable();
    graphData.addColumn('string', 'Element');
    graphData.addColumn('number', 'Percentage');
    $.each(data.pie1, function(key, val) {
        graphData.addRow([key, val]);
    })
    var chart = new google.visualization.PieChart($("#myChart")[0]);
    chart.draw(graphData, options);
}



$(document).ready(function() {

    // data = {
    //     oxygen:.5,
    //     carbon:.5
    // };
    input = {
        title:title
    }

    // $.getJSON('https://ghibliapi.herokuapp.com/films',null, function(rdata) {
    //     console.log(rdata);
    // });

    // $.getJSON('https://www.reddit.com/r/news/search?q=australia&restrict_sr=1',null, function(rdata) {
    //     console.log(rdata);
    // });
    $.getJSON('http://localhost:3000/Individual/getData1',input, function(rdata) {
        console.log(rdata);
        data = rdata;
    });
    $("#bar1").click(function(event){
        event.preventDefault();
        drawBar1();
    })
    $("#bar20").click(function(event){
        event.preventDefault();
        drawBar2(0);
    })
    $("#bar21").click(function(event){
        event.preventDefault();
        drawBar2(1);
    })
    $("#bar22").click(function(event){
        event.preventDefault();
        drawBar2(2);
    })
    $("#bar23").click(function(event){
        event.preventDefault();
        drawBar2(3);
    })
    $("#bar24").click(function(event){
        event.preventDefault();
        drawBar2(4);
    })
    $("#pie1").click(function(event){
        event.preventDefault();
        drawPie1();
    })
});