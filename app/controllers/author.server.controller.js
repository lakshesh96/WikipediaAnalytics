var wiki_ = require("../models/overall")

module.exports.showAuthors = function(req,res){
    // passResults = new Array
    // for(var n = 0; n < inputNum; n++){
    //     console.log("check")
    //     console.log(n)
    // }
    //res.render('analytics.pug',{passResults:passResults})
    //res.end()
    console.log("SHOULD BE AUTHOR")
    var auth = req.query.num;
    console.log(auth)
    wiki_.AuthorSet(auth)

}

module.exports.setArt = function(req,res){

    console.log("SHOULD BE Article")
    var auth = req.query.num;
    console.log(auth)
    wiki_.ArtSet(auth)

}

module.exports.getAuthorArticles = function(req,res){

    console.log("work")

    wiki_.wiki_.getAuthorArticles(function(err,resultAuthArt){

        if(err){

        }else{
        console.log("work2")
        console.log(resultAuthArt)
        res.json(resultAuthArt)
        }
    })
}

module.exports.getAuthorArticlesTimes = function(req,res){

    console.log("work")

    wiki_.wiki_.getAuthorArticleTimestamps(function(err,resultAuthArt){

        if(err){

        }else{
            console.log("work2")
            console.log(resultAuthArt)
            res.json(resultAuthArt)
        }

    })
}