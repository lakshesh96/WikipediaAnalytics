

var data;

$(document).ready(function() {

    $.getJSON('http://localhost:3000/Individual/getData1',input, function(rdata) {
        console.log(rdata);
        data = rdata;
    });

    appendList()
});


function appendList(){

    console.log(data);
    // var xhttp = new XMLHttpRequest();
    // xhttp.onreadystatechange = function() {
    //     if (this.readyState == 4 && this.status == 200) {
    //         console.log(data)
    //
    //
    //
    //     }
    // };
    // xhttp.open("GET", "/Overall/DataLHist", true);
    // xhttp.send();

}