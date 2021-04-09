
function fillTopArt(){

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(this.response)
        console.log(data)

        $('#TopA').empty()
        var tabl = $('<table>');
        $("#TopA").append(tabl);
        var tablH = $('<thead>');
        $("#TopA").append(tablH);
        var tablR = $('<tr>');
        $("#TopA").append(tablR);
        var titl1 = $('<th>Article</th>');
        $("#TopA").append(titl1);
        var titl2 = $('<th>Number of Revisions</th>');
        $("#TopA").append(titl2);
        var tablr = $('</tr>');
        $("#TopA").append(tablr);
        var tBod = $('<tbody>');
        $("#TopA").append(tBod);

        for(var i = 0; i < data.length; i++){
            var tablR_ = $('<tr>');
            $("#TopA").append(tablR_);
            var artic = $(`<td>${data[i]._id}</td>`);
            $("#TopA").append(artic);
            var revi = $(`<td>${data[i].numOfEdits}</td>`);
            $("#TopA").append(revi);
            var tablr_ = $('<tr>');
            $("#TopA").append(tablr_);
        }

        var tbod = $('</tbody>');
        $("#TopA").append(tbod);
        var tbl = $('</table>');
        $("#TopA").append(tbl);
      }
    };
    xhttp.open("GET", "/Overall/DataTop", true);
    xhttp.send();
}

function fillBotmArt(){

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(this.response)
        console.log(data)
        //$('#BottomA').find().remove();//remove previous table to update with nmber input
        $('#BottomA').empty()
        var tabl = $('<table>');
        $("#BottomA").append(tabl);
        var tablH = $('<thead>');
        $("#BottomA").append(tablH);
        var tablR = $('<tr>');
        $("#BottomA").append(tablR);
        var titl1 = $('<th>Article</th>');
        $("#BottomA").append(titl1);
        var titl2 = $('<th>Number of Revisions</th>');
        $("#BottomA").append(titl2);
        var tablr = $('</tr>');
        $("#BottomA").append(tablr);
        var tBod = $('<tbody>');
        $("#BottomA").append(tBod);

        for(var i = 0; i < data.length; i++){
            var tablR_ = $('<tr>');
            $("#BottomA").append(tablR_);
            var artic = $(`<td>${data[i]._id}</td>`);
            $("#BottomA").append(artic);
            var revi = $(`<td>${data[i].numOfEdits}</td>`);
            $("#BottomA").append(revi);
            var tablr_ = $('<tr>');
            $("#BottomA").append(tablr_);
        }

        var tbod = $('</tbody>');
        $("#BottomA").append(tbod);
        var tbl = $('</table>');
        $("#BottomA").append(tbl);
      }
    };
    xhttp.open("GET", "/Overall/DataBottom", true);
    xhttp.send();
}

function fillLargeSmallRevs(){

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(this.response)
        console.log("LARGESMALL")
        console.log(data)
        console.log(data[0][1])
        ///////////Dsiplay Larger Group and Size ///////
        $('#LargeG').empty()
        var lgrGrp = $('<h4>Group Name: ' + data[0][0] + '</h4>' );
        $("#LargeG").append(lgrGrp);

        var lgrGrpCount = $('<h4>Group Size: ' + data[0][1].toString() + '</h4>');
        $("#LargeG").append(lgrGrpCount);
        ///////////Display Articles of Larger Group/////////////
        var tabl = $('<table>');
        $("#LargeG").append(tabl);
        var tablH = $('<thead>');
        $("#LargeG").append(tablH);
        var tablR = $('<tr>');
        $("#LargeG").append(tablR);
        var titl1 = $('<th>Articles</th>');
        $("#LargeG").append(titl1);
        var tablr = $('</tr>');
        $("#LargeG").append(tablr);
        var tBod = $('<tbody>');
        $("#LargeG").append(tBod);

        for(var i = 0; i < data[0][2].length; i++){
          console.log("Large")
            var tablR_ = $('<tr>');
            $("#LargeG").append(tablR_);
            var artic = $(`<td>${data[0][2][i]._id}</td>`);
            $("#LargeG").append(artic);
            console.log(data[0][2][i]._id)
            var tablr_ = $('</tr>');
            $("#LargeG").append(tablr_);
        }

        var tbod = $('</tbody>');
        $("#LargeG").append(tbod);
        var tbl = $('</table>');
        $("#LargeG").append(tbl);

        ///////////////SMALLER GROUP////////////////

        $('#SmallG').empty()
        var smllrGrp = $('<h4>Group Name: ' + data[1][0] + '</h4>' );
        $("#SmallG").append(smllrGrp);

        var smllrGrpCount = $('<h4>Group Size: ' + data[1][1].toString() + '</h4>');
        $("#SmallG").append(smllrGrpCount);

        var tabl = $('<table>');
        $("#SmallG").append(tabl);
        var tablH = $('<thead>');
        $("#SmallG").append(tablH);
        var tablR = $('<tr>');
        $("#SmallG").append(tablR);
        var titl1 = $('<th>Articles</th>');
        $("#SmallG").append(titl1);
        var tablr = $('</tr>');
        $("#SmallG").append(tablr);
        var tBod = $('<tbody>');
        $("#SmallG").append(tBod);

        for(var i = 0; i < data[1][2].length; i++){
          var tablR_ = $('<tr>');
          $("#SmallG").append(tablR_);
            var artic = $(`<td>${data[1][2][i]._id}</td>`);
            $("#SmallG").append(artic);
            console.log(data[1][2][i]._id)
            var tablr_ = $('</tr>');
            $("#SmallG").append(tablr_);
        }
      }
      /////////////////////////////////////////////
    };
    xhttp.open("GET", "/Overall/DataLSGroup", true);
    xhttp.send();
}

function fillLongHistory(){

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(this.response)
        console.log(data)

        $('#LongestH').empty()
        var tabl = $('<table>');
        $("#LongestH").append(tabl);
        var tablH = $('<thead>');
        $("#LongestH").append(tablH);
        var tablR = $('<tr>');
        $("#LongestH").append(tablR);
        var titl1 = $('<th>Article</th>');
        $("#LongestH").append(titl1);
        var titl2 = $('<th>Age in Days</th>');
        $("#LongestH").append(titl2);
        var tablr = $('</tr>');
        $("#LongestH").append(tablr);
        var tBod = $('<tbody>');
        $("#LongestH").append(tBod);

        for(var i = 0; i < data.length; i++){
            var days = Math.round(data[i].age/1000 / 60 / 60 / 24)
            var tablR_ = $('<tr>');
            $("#LongestH").append(tablR_);
            var artic = $(`<td>${data[i]._id}</td>`);
            $("#LongestH").append(artic);
            var revi = $(`<td>${days}</td>`);
            $("#LongestH").append(revi);
            var tablr_ = $('</tr>');
            $("#LongestH").append(tablr_);
        }

        var tbod = $('</tbody>');
        $("#LongestH").append(tbod);
        var tbl = $('</table>');
        $("#LongestH").append(tbl);

      }
    };
    xhttp.open("GET", "/Overall/DataLHist", true);
    xhttp.send();

}



function fillShortHistory(){

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(this.response)
        console.log(data)

        $('#ShortestH').empty()
        var tabl = $('<table>');
        $("#ShortestH").append(tabl);
        var tablH = $('<thead>');
        $("#ShortestH").append(tablH);
        var tablR = $('<tr>');
        $("#ShortestH").append(tablR);
        var titl1 = $('<th>Article</th>');
        $("#ShortestH").append(titl1);
        var titl2 = $('<th>Age in Days</th>');
        $("#ShortestH").append(titl2);
        var tablr = $('</tr>');
        $("#ShortestH").append(tablr);
        var tBod = $('<tbody>');
        $("#ShortestH").append(tBod);

        for(var i = 0; i < data.length; i++){
            var days = Math.round(data[i].age/1000 / 60 / 60 / 24)
            var tablR_ = $('<tr>');
            $("#ShortestH").append(tablR_);
            var artic = $(`<td>${data[i]._id}</td>`);
            $("#ShortestH").append(artic);
            var revi = $(`<td>${days}</td>`);
            $("#ShortestH").append(revi);
            var tablr_ = $('</tr>');
            $("#ShortestH").append(tablr_);
        }

        var tbod = $('</tbody>');
        $("#ShortestH").append(tbod);
        var tbl = $('</table>');
        $("#ShortestH").append(tbl);

      }
    };
    xhttp.open("GET", "/Overall/DataSHist", true);
    xhttp.send();

}

function cascade(){
  
  fillTopArt()
  fillBotmArt()
  fillLargeSmallRevs()
  fillLongHistory()
  fillShortHistory()

}

function updateNum(){

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      data = JSON.parse(this.response)


    }
  };
  xhttp.open("GET", "/Overall/getNum", true);
  xhttp.send();

}
$(document).ready(function(){

  cascade()

    $('#button').on('click', function(e){
      var parameters = {num: $('#num').val() };
      $.get('/Overall/getNum', parameters, function(result) {
          $('#results').html(result);
          //updateNum()
      });
      cascade()
  });

});
