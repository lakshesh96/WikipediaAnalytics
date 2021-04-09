var wiki_ = require("../models/overall")
var app = require("../../wikiserver")
var Promise = require('bluebird');
var mongoose = require('mongoose');
var mongoose = Promise.promisifyAll(mongoose);
//var ajxJquery = require("../../public/js/overall_ajax")
var inputNum = 2
var storeRegUsr = []
var initialized_ = false

var global_topArticle = new Array
var global_bottomArticle = new Array
var global_largestGroup = new Array
var global_smallestGroup = new Array
var global_longestH = new Array
var global_shortestH = new Array

//global graph too

//checks to switch initialized variable after each asynchronous Overall query has returned results
var check1 = false
var check2 = false
var check3 = false
var check4 = false
var check5 = false

//Stored intervalID variable for javascript interval check function
var storeIntervalId

var storeIntervalId
module.exports.showLandingPage = function(req, res){
    res.render("landing.pug")
}

module.exports.showAnalyticsPage = function(req,res){
    passResults = new Array
    for(var n = 0; n < inputNum; n++){
        console.log("check")
        console.log(n)
    }
    res.render('analytics.pug',{passResults:passResults})
    res.end()
}

//JS interval function determines whether the initial queries for the overall page have returned
function checkFlag() {
    if(check1 == false && check2 == false && check3 == false && check4 == false && check5 == false) {
        //console.log("Check FALSE")
    } else {
        initialized_ = true
        clearInterval(storeIntervalId)
        //console.log("Check TRUE")
    }
}

//Queries for bar, line and pie graphs
module.exports.getOverallGraphData=function(req,res){

    revs = new Array//stores revision data
    comboRevs = new Array//stores revision data
    pieData = new Array//stores pie chart data
    chartData = new Array//Array for both comboRevs and pieData to be passed to jQuery/Ajax function
    pieData.push(['User Type','Total Revisions'])//google chart can build charts based on arrays formatted in which related data shares
    //index value under headers

    //Gets Regular user revision data
    wiki_.wiki_.getBarGraphReg(function(err,resultRegGraph){

        if(err){
            console.log("Query Error")
        }else{
            
            regs = new Array
            for(var i = 0; i < resultRegGraph.length; i++){
                var pair = [parseInt(resultRegGraph[i]._id),parseInt(resultRegGraph[i].totalRevs)]
                regs.push(pair)
            }
            console.log("GRAPHPromise")
            //res.json(regs)
            regsans = regs.sort( (a, b) => {//sorts the data by year
                return a[0] - b[0]
              });
            revs.push(regsans)

            //Gets revision data for Administrators
            wiki_.wiki_.getBarGraphAdmins(function(err,resultAdminGraph){

                if(err){
                    console.log("Querry Error")
                }else{
                    
                    admins = new Array
                     
                    for(var i = 0; i < resultAdminGraph.length; i++){
                        var pair = [parseInt(resultAdminGraph[i]._id),parseInt(resultAdminGraph[i].totalRevs)]
                        admins.push(pair)
                    }
                    console.log("GRAPHPromise")
                    revs.push(admins)///remove revs
                    console.log("sizes")
                    console.log(revs[0].length)
                    console.log(revs[1].length)
                    adminsans = admins.sort( (a, b) => {
                        return a[0] - b[0]
                      });
                      //Gets bot revision data 
                    wiki_.wiki_.getBarGraphBots(function(err,resultBotGraph){
                        if(err){

                        }else{
                            bots_ = new Array
                            for(var i = 0; i < resultBotGraph.length; i++){
                                var pair = [parseInt(resultBotGraph[i]._id),parseInt(resultBotGraph[i].totalRevs)]
                                bots_.push(pair)
                            }
                            botsans = bots_.sort( (a, b) => {
                                return a[0] - b[0]
                              });

                            //anonymous user data
                            wiki_.wiki_.getBarGraphAnon(function(err,resultAnonGraph){

                                if(err){

                                }else{

                                    anons = new Array
                                    for(var i = 0; i < resultAnonGraph.length; i++){
                                        var pair = [parseInt(resultAnonGraph[i]._id),parseInt(resultAnonGraph[i].totalRevs)]
                                        anons.push(pair)
                                    }
                                    anonsans = anons.sort( (a, b) => {
                                        return a[0] - b[0]
                                      });

                                      comboRevs.push(['Year', 'Regular', 'Admin','Bot','Anon'])//formatting for google chart
                                      for(var i = 0; i < resultAdminGraph.length; i++){
                                          if(botsans[i]){
                                            objct = [adminsans[i][0].toString(),regsans[i][1],adminsans[i][1],botsans[i][1],anonsans[i][1]]
                                            comboRevs.push(objct)
                                          }else{//bot revisions begin from 2004 so if bot revision for year doesn't exist pass 0
                                            objct = [adminsans[i][0].toString(),regsans[i][1],adminsans[i][1],0,anonsans[i][1]]
                                            comboRevs.push(objct)
                                          }

                                      }
                                      chartData.push(comboRevs)

                                      //////////////////////////PIE CHART DATA//////////////////////////////////
                                      wiki_.wiki_.getAnonTotal(function(err,resultanontotal){

                                        if(err){
                                            console.log("Error in getAnonTotal query")
                                        }else{
  
                                            anonObj = ['Anonymous',resultanontotal[0].count]
                                            pieData.push(anonObj)
                                            wiki_.wiki_.getAdminTotal(function(err,resultadmintotal){
                                
                                                if(err){
                                        
                                                }else{
                
                                                    adminObj = ['Administrator',resultadmintotal[0].count]
                                                    pieData.push(adminObj)
                
                                                    wiki_.wiki_.getBotTotal(function(err,resultbottotal){
                                
                                                        if(err){
                                                
                                                        }else{    
                
                                                            botObj = ['Bot',resultbottotal[0].count]
                                                            pieData.push(botObj)
                
                                                            wiki_.wiki_.getRegTotal(function(err,resultregtotal){
                                
                                                                if(err){
                                                        
                                                                }else{

                                                                    regObj = ['Regular',resultregtotal[0].count]
                                                                    pieData.push(regObj)
                                                                    console.log(pieData)
                                                                    chartData.push(pieData)
                                                                    res.json(chartData)
                                                                    //pass in json format so ajax/jQuery function in overall_graphs can
                                                                    //acquire data via get request
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

module.exports.getOverallNum = function(req, res){
    console.log("THE BUTTONS PUSHED")
    numz = req.query.num;
    console.log(numz)
    if(numz != 0){
        console.log("NUMBER SET")
        inputNum = parseInt(numz, 10);
    }
}

//begins render of analytics page
module.exports.renderAnalytics = async function(req,res){
    storeIntervalId = setInterval(checkFlag, 500);
    res.render('analytics.pug')
}

//Top revised articles
module.exports.getAnalytics_Top = async function(req,res){

    if(initialized_ == false){
        console.log(check1)
        wiki_.wiki_.getTopRevised(function(err,result1){
            if (err){
                console.log("Error in query")
            }else{
                global_topArticle = result1//store for update
                revision1 = new Array
                for(var n = 0; n < inputNum; n++){
                    revision1[n] = result1[n]
                }
                check1 = true
                res.json(revision1)

            }
        })
    }else{
        //to improve performance once intialization has occured we can use stored global variables to return more articles as the queries
        //are static for the overall section
        revision1 = new Array
        for(var n = 0; n < inputNum; n++){
            revision1[n] = global_topArticle[n]
        }
        res.json(revision1)
    }
}

//Articles with lowest revision count
module.exports.getAnalytics_Bottom = async function(req,res){

    if(initialized_ == false){
        wiki_.wiki_.getBottomRevised(function(err,result1){
            if (err){
                console.log("Error in query")
            }else{
                global_bottomArticle = result1
                revision1 = new Array
                for(var n = 0; n < inputNum; n++){
                    revision1[n] = result1[n]
                }
                check2 = true
                res.json(revision1)

            }
        })
    }else{

        revision1 = new Array
        for(var n = 0; n < inputNum; n++){
            revision1[n] = global_bottomArticle[n]
        }
        res.json(revision1)

    }
}

//Gets the Larger and Smaller group of registered users data simultaneously as one informs the other
//Requires a combination of a few queries and so nesing is used initially
module.exports.getAnalytics_LG_SG = async function(req,res){

    if(initialized_ == false){

        var storeLarge = []
        var storeSmall = []
        wiki_.wiki_.getAdminRegUserRevs(function(err,result1){
            if (err){
                console.log("Error in query getAdminRegUserRevs")
            }else{
                var size1 = result1[0].count
                wiki_.wiki_.getNonAdminRegUserRevs(function(err,result2){
                    if(err){
                        console.log("Error in query getNonAdminRegUserRevs")
                    }else{
                        var size2 = result2[0].count
                        if(size1 > size2){ //if the admin group is larger than the regular group
                            storeLarge.push("Administrators")
                            storeLarge.push(size1.toString())
                            global_largestGroup.push("Administrators")//<-store globally for the article number selection
                            global_largestGroup.push(size1.toString())//<-
                            storeSmall.push("Regular Users")
                            storeSmall.push(size2.toString())
                            global_smallestGroup.push("Regular Users")//<-
                            global_smallestGroup.push(size2.toString())//<-
                            wiki_.wiki_.getAdminRegArticle(function(err,result3){
                                if(err){
                                    console.log("Error in query getAdminRegArticle")
                                }else{
                                    global_largestGroup.push(result3)
                                    wiki_.wiki_.getNonAdminRegArticle(function(err,result4){
                                        if(err){
                                            console.log("Error in query getNonAdminRegArticle")
                                        }else{
                                            global_smallestGroup.push(result3)
                                            bigArt = new Array
                                            smallArt = new Array
                                            for(var j = 0; j < inputNum;j++){
                                                bigArt.push(result4[j])
                                                smallArt.push(result3[j])
                                            }
                                            storeLarge.push(bigArt)
                                            storeLarge.push(inputNum)
                                            storeSmall.push(smallArt)
                                            storeSmall.push(inputNum)
                                            storeRegUsr.push(storeLarge)
                                            storeRegUsr.push(storeSmall)
                                            check3 = true
                                            res.json(storeRegUsr)
                                        }
                                    })
                                }
                            })
                        }else{//else the regular user group is larger than the admin group
                            storeLarge.push("Regular Users")
                            storeLarge.push(size2)
                            global_largestGroup.push("Regular Users")
                            global_largestGroup.push(size2)
                            storeSmall.push("Administrators")
                            storeSmall.push(size1)
                            global_smallestGroup.push("Administrators")
                            global_smallestGroup.push(size1)
                            wiki_.wiki_.getAdminRegArticle(function(err,result3){
                                if(err){
                                    console.log("Error in query getAdminRegArticle")
                                }else{
                                    global_smallestGroup.push(result3)
                                    wiki_.wiki_.getNonAdminRegArticle(function(err,result4){
                                        if(err){
                                            console.log("Error in query getNonAdminRegArticle")
                                        }else{
                                            global_largestGroup.push(result4)
                                            bigArt = new Array
                                            smallArt = new Array
                                            for(var j = 0; j < inputNum;j++){
                                                bigArt.push(result4[j])
                                                smallArt.push(result3[j])
                                            }
                                            storeLarge.push(bigArt)
                                            storeSmall.push(smallArt)
                                            storeRegUsr.push(storeLarge)
                                            storeRegUsr.push(storeSmall)
                                            check3 = true
                                            res.json(storeRegUsr)
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            }
        })
    }else{//Once initial queries have been made further requests for data can be made quickly with this alternate functionality
        bigArt = new Array
        smallArt = new Array
        bigArt.push(global_largestGroup[0])
        bigArt.push(global_largestGroup[1])
        smallArt.push(global_smallestGroup[0])
        smallArt.push(global_smallestGroup[1])
        tempBig = new Array
        tempSmall = new Array
        for(var j = 0; j < inputNum;j++){
            tempBig.push(global_largestGroup[2][j])
            tempSmall.push(global_smallestGroup[2][j])
        }
        bigArt.push(tempBig)
        smallArt.push(tempSmall)
        var streRgUsr = new Array
        streRgUsr.push(bigArt)
        streRgUsr.push(smallArt)
        res.json(streRgUsr)
    }
}

//longest history 
module.exports.getAnalytics_LH = async function(req,res){

    if(initialized_ == false){
        wiki_.wiki_.getOldestArticles(function(err,result1){
            if (err){
                console.log("Error in query")
            }else{
                global_longestH.push(result1)
                revision1 = new Array
                for(var n = 0; n < inputNum; n++){
                    revision1[n] = result1[n]
                }
                check4 = true
                res.json(revision1)
            }
        })
    }else{
        revision1 = new Array
        for(var n = 0; n < inputNum; n++){
            revision1[n] = global_longestH[0][n]
        }
        res.json(revision1)
    }
}

//shortest history
module.exports.getAnalytics_SH = async function(req,res){

    if(initialized_ == false){
        wiki_.wiki_.getYoungestArticles(function(err,result1){
            if (err){
                console.log("Error in query")
            }else{
                global_shortestH.push(result1)
                revision1 = new Array
                for(var n = 0; n < inputNum; n++){
                    revision1[n] = result1[n]
                }
                check5 = true
                res.json(revision1)
            }
        })
    }else{
        revision1 = new Array
        for(var n = 0; n < inputNum; n++){

            revision1[n] = global_shortestH[0][n]
        }
        res.json(revision1)
    }
}
/*
// SignUp Process
module.exports.signUp = function(req, res){

    // todo validateInputFields(req);
    var password = req.body.input_password;
    // todo var encryptedPassword = null;

    // var errors = req.validationErrors();
    if(false){
        // todo implement Modal to display errors and empty out signup form
        //console.log(errors);
    }
    else{
        var newUser = new UserSchema({
            firstName: req.body.input_firstname,
            lastName: req.body.input_lastname,
            email: req.body.input_email,
            password: password,
            securityQuestion: req.body.input_securityQuestion,
            securityAnswer: req.body.input_securityAnswer
        });

        console.log(newUser);

        // Save the New User in Database
        newUser.save(function(error){
            if(error){
                // todo implement Modal to display errors and empty out signup form
                console.log(error);
                console.log("SignUp Unsuccessful!")
                res.redirect('/wiki');
            }
            else{
                // todo Successful Login Modal
                console.log("SignUp Successful!")
                res.redirect('/wiki');
            }
        });
    }
}
*/