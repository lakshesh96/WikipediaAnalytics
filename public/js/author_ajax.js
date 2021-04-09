// function hasClass(elem, className) {
//     return elem.classList.contains(className);
// }
function retrieveTimes(){

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(this.response)
        console.log(data)
        $('#AuthArt').empty()
        var headr = $('<h4>Dates and Times of Revisions(Most Recent First)</h4>');
        $("#AuthArt").append(headr);
        var listH = $('<ul>');
        $("#AuthArt").append(listH);

        for(var i = 0; i < data.length; i++){

            var d = new Date(data[i]._id);
            var time = $(`<td>${d}</td>`);
            //var time = $(`<td>${data[i]._id}</td>`);
            $("#AuthArt").append(time);
            var brk = $('<br>');
            $("#AuthArt").append(brk);

        }

        var listh = $('</ul>');
        $("#AuthArt").append(listh);
      }
    };
    xhttp.open("GET", "/Overall/getArtTimes", true);
    xhttp.send();

}

function retrieveArticle(art){
    console.log("Click " + art)
    var parameters = {num: art };
    $.get('/Overall/setAuthorArt', parameters, function(result) {
        $('#authors').html(result);
        //updateNum()
    });
    retrieveTimes()
}

function retrieveAuthArt(){

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(this.response)
        console.log(data)
        $('#AuthArt').empty()
        var headr = $('<h4>Articles Revised by Author</h4>');
        $("#AuthArt").append(headr);
        // for(var i = 0; i < data.length; i++){
        //     var button = $('<button id='+ data[i]._id + 'class="Article_">'+"Article: "+data[i]._id+"Number of Edits: "+data[i].numOfEdits+'</button>')
        //     $("#AuthArt").append(button);
            
        // }

        $("#AuthArt").append(headr);
        var tabl = $('<table id="authTable" class="table table-hover">');
        $("#AuthArt").append(tabl);
        var tablH = $('<thead>');
        $("#AuthArt").append(tablH);
        var tablR = $('<tr>');
        $("#AuthArt").append(tablR);
        var titl1 = $('<th scope="col">Article</th>');
        $("#AuthArt").append(titl1);
        var titl2 = $('<th scope="col">Number of Revisions</th>');
        $("#AuthArt").append(titl2);
        var titl3 = $('<th scope="col">Revision Selector</th>');
        $("#AuthArt").append(titl3);
        var tablr = $('</tr>');
        $("#AuthArt").append(tablr);
        var tBod = $('<tbody>');
        $("#AuthArt").append(tBod);

        for(var i = 0; i < data.length; i++){
            var tablR_ = $('<tr>');
            $("#AuthArt").append(tablR_);
            var artic = $(`<td>${data[i]._id}</td>`);
            $("#AuthArt").append(artic);
            var revi = $(`<td>${data[i].numOfEdits}</td>`);
            $("#AuthArt").append(revi);
            //var button = $('<td><button class="Select"></button></td>');
            //var button = $('<td><input type="checkbox" id="vehicle1" name="check" value='+data[i].numOfEdits.toString()+'></td>');
            //var store = ` onclick="retrieveArticle(${data[i]._id})"`
            //var store = 'onclick="retrieveArticle()"'
            //var output = [store.slice(0, 25), data[i]._id, store.slice(25)].join('');
            
            //var stores = store+store2
            //var button = $('<td><input type="button" class="checkr" value='+data[i]._id + '></td>');
            //button.onclick = retrieveArticle(data[i]._id)
            var button = $("<td>"+"<button id='revitimes' class='btn btn-primary btn-xs' " +
            "onclick='retrieveArticle(\""+
            data[i]._id+
            "\")'>Retrieve Revision Times</button>"+
            "</td>");
            //button.append(` onclick="retrieveArticle(${data[i]._id})"`)
            $("#AuthArt").append(button);
            var tablr_ = $('<tr>');
            $("#AuthArt").append(tablr_);
        }

        var tbod = $('</tbody>');
        $("#AuthArt").append(tbod);
        var tbl = $('</table>');
        $("#AuthArt").append(tbl);
      }
    };
    xhttp.open("GET", "/Overall/getAuthorArt", true);
    xhttp.send();

}

$(document).ready(function(){

    $('#AuthorSearch').on('click', function(e){
        var store = document.querySelector('#auth').value
        var parameters = {num: store };
        $.get('/Overall/getAuthor', parameters, function(result) {
            $('#authors').html(result);
            //updateNum()
        });
        console.log(document.querySelector('#auth').value);
        retrieveAuthArt()
    });

    // $('#check').on('click', function(e){

    //     hasClass('#authTable', 'checkr')

        // var store = document.querySelector('#auth').value
        // var parameters = {num: store };
        // $.get('/Overall/getAuthor', parameters, function(result) {
        //     $('#authors').html(result);
        //     //updateNum()
        // });
        // console.log(document.querySelector('#auth').value);
        // retrieveAuthArt()
//    });



    // $('#AuthorSearch').on('click', function(e){
    //     //var parameters_ = {name: $('#name').val() };
    //     authName = document.querySelector('#auth').value
    //     var parameters_ = {authName: $('#authName').val() };
        
    //     $.get('/Overall/getAuthor', parameters_, function(authName) {
    //         $('#authorz').html(authName);

    //     });
    //     console.log(document.querySelector('#auth').value);

    // });
  
  });