const Bluebird = require('bluebird');
const Individual = Bluebird.promisifyAll(require("../models/individual"));
const fs = Bluebird.promisifyAll(require('fs'));
const fetch = require("node-fetch");


// module.exports.getIndividualAnalyticsLanding = Bluebird.coroutine(function*(req, res){
//     console.log("Individual analytics")
//     var list = [];
//     var list2 = [];
//
//     fs.readdirSync("./Dataset_22_March_2020/revisions").forEach(file => {
//         list.push(file.replace('.json',''));
//         console.log(file);
//     });
//     try {
//         const files = list;
//         Bluebird.map(
//             files,
//             Bluebird.coroutine(function *(filename) {
//                 console.log("applying coroutine");
//                 Individual.getNumberRevised(filename, function(error, result) {
//                     if (error) {
//                         console.log("Error");
//                     }
//                     else {
//                         console.log(result);
//                         list2.push(result);
//                     }
//
//                 });
//             }),
//             {concurrency: 10} // You can increase concurrency here
//         );
//         console.log("Test");
//         // while (list2.length != list.length) {
//         // console.log("infinite");
//         // }
//     }
//     finally {
//         console.log("Reached finally");
//         console.log(list2);
//         res.render('individual_analytics_landing.pug',{list:list2})
//     }
// });

module.exports.getIndividualAnalyticsLanding = Bluebird.coroutine(function*(req, res){
    console.log("Individual analytics")
    const list = [];
    const list2 = [];
    const list3 = [];
    // res.render('individual_analytics_landing.pug');
    fs.readdirSync("./Dataset_22_March_2020/revisions").forEach(file => {
        list.push(file.replace('.json',''));
        console.log(file);
    });
    try {
        const files = list;
        yield Bluebird.map(
            files,
            Bluebird.coroutine(function *(filename) {
                console.log("applying coroutine");
                list2.push(yield Individual.getNumberRevised(filename));
            }),
            {concurrency: 10} // You can increase concurrency here
        );
        console.log("Test");
    }
    finally {
        console.log("Reached finally");
        console.log(list2);

        for (var i = 0; i < list2.length; i++) {
            list3[i] = list2[i][0]._id + ", Number Of Edits: " + list2[i][0].numOfEdits;
            console.log(list3[i]);
        }
        res.render('individual_analytics_landing.pug',{list:list3});
    }
});


module.exports.getIndividualAnalyticsSPA = Bluebird.coroutine(function*(req, res){
    console.log("Individual analytics")
    const list = [];
    const list2 = [];
    const list3 = [];
    // res.render('individual_analytics_landing.pug');
    fs.readdirSync("./Dataset_22_March_2020/revisions").forEach(file => {
        list.push(file.replace('.json',''));
        console.log(file);
    });
    try {
        const files = list;
        yield Bluebird.map(
            files,
            Bluebird.coroutine(function *(filename) {
                console.log("applying coroutine");
                list2.push(yield Individual.getNumberRevised(filename));
            }),
            {concurrency: 10} // You can increase concurrency here
        );
        console.log("Test");
    }
    finally {
        console.log("Reached finally");
        console.log(list2);

        for (var i = 0; i < list2.length; i++) {
            list3[i] = list2[i][0]._id + ", Number Of Edits: " + list2[i][0].numOfEdits;
            console.log(list3[i]);
        }
        response = {
            list:list3
        }
        res.json(response);
    }
});

module.exports.getIndividualAnalyticsResults = Bluebird.coroutine(function*(req, res){
    console.log("Individual analytics")
    query = req.body.articleList;
    article = query.split(", Number Of Edits")[0].trim();
    numberOfEdits = query.split(", Number Of Edits")[1].trim();
    var top5Results;
    var revision;
    // var getTop5Users = Bluebird.coroutine(function* (article) {
    //     console.log("applying coroutine");
    //     return Individual.getArticleTop5Users(article);
    // })
    //
    // var getArticle = Bluebird.coroutine(function* (article) {
    //     console.log("applying coroutine");
    //     return Individual.getArticle(article);
    // })

    top5Results = yield Individual.getArticleTop5Users(article);//getTop5Users(article);
    revision = yield Individual.getArticle(article);//getArticle(article);

    // Individual.getJson("https://ghibliapi.herokuapp.com/films", function(err, result) {
    //     if (err) {
    //         console.log("Something went wrong");
    //     }
    //     else {
    //         console.log(result);
    //     }
    // });
    var today = new Date();
    var dateDeadline = (today.getTime()-86400000);
    var revisionDate = new Date(revision[0]['timestamp']).getTime();
    var pull = false;
    if (dateDeadline > revisionDate)
        pull = true;

    console.log(top5Results);
    console.log(revision);



    console.log("START");

    let timestamp = new Date(revision[0]['timestamp']).toISOString()
    console.log(timestamp + " teim");
    var pullNumber = 0;
    if (pull) {
        var url = "https://en.wikipedia.org/w/api.php";
        var params = {
            action: "query",
            prop: "revisions",
            titles: article,
            rvstart: timestamp,
            rvlimit: "500",
            rvdir: "newer",
            // rvprop: "timestamp|user|comment|content",
            // rvdir: "newer",
            // rvslots: "main",
            // formatversion: "2",
            format: "json"
        };

        url = url + "?origin=*";
        Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

        var pages = [];
        yield fetch(url)
            .then(function(response){return response.json();})
            .then(function(response) {
                console.log("PAGES BY DR DRE")
                console.log(response);
                pages = response.query;

            })
            .catch(function(error){console.log(error);});

        for (var p in pages) {
            console.log(pages[p]);
            var keys = Object.keys(pages[p]);
            for (let i = 0; i < keys.length; i++) {

                for (let k = 0; k < pages[p][keys[i]].revisions.length; k++) {
                    pages[p][keys[i]].revisions[k]['title'] = article;
                }
                console.log(pages[p][keys[i]]);
                pullNumber += pages[p][keys[i]].revisions.length;
                Individual.insertRevisions(pages[p][keys[i]].revisions);

            }
        }
    }

    news = [];
    var pages = [];

    let redditURL = "https://www.reddit.com/r/news/search.json?restrict_sr=true&sort=top&t=all&limit=3&q=";
    redditURL += article;
    yield fetch(redditURL)
        .then(function(response){return response.json();})
        .then(function(response) {
            // console.log(response);
            pages = response.data.children;


        })
        .catch(function(error){console.log(error);});

    console.log(pages);
    for (let i = 0; i < 3 || i < pages.length; i++)
        news[i] = pages[i].data.title;

    console.log("FINISH");
    console.log(news);
    console.log(new Date(revision[0]['timestamp']).toTimeString());
    console.log(new Date(revision[0]['timestamp']).toISOString());
    res.render('individual_analytics_result.pug', {revision: revision, top5Results: top5Results, numberOfEdits: numberOfEdits, pull:pull, pullNumber:pullNumber, news:news})
});



module.exports.getData1= async function(req,res){
    var val = {'Nitrogen': 0.78, 'Oxygen': 0.21, 'Other': 0.01};
    console.log(req.query.title);
    var title = req.query.title;
    var bar1 = [];
    var a = await(Individual.getNumberAdministrator(title));
    var b = await(Individual.getNumberAnonymous(title));
    var c = await(Individual.getNumberBot(title));
    var d = await(Individual.getNumberRegular(title));
    var min = 9999;
    var max = 0;
    if (a.length != 0) {
        if (a[0]._id < min)
            min = a[0]._id;
        if (a[a.length-1]._id > max)
            max = a[a.length-1]._id
    }
    if (b.length != 0) {
        if (b[0]._id < min)
            min = b[0]._id;
        if (b[b.length-1]._id > max)
            max = b[b.length-1]._id
    }
    if (c.length != 0) {
        if (c[0]._id < min)
            min = c[0]._id;
        if (c[c.length-1]._id > max)
            max = c[c.length-1]._id
    }
    if (d.length != 0) {
        if (d[0]._id < min)
            min = d[0]._id;
        if (d[d.length-1]._id > max)
            max = d[d.length-1]._id
    }


    for (var i = min; i < max; i++) {
        aYear = {
            year:i,
            totalRevs:0
        }
        bYear = {
            year:i,
            totalRevs:0
        }
        cYear = {
            year:i,
            totalRevs:0
        }
        dYear = {
            year:i,
            totalRevs:0
        }
        for (var j = 0; j < a.length; j++)
            if (a[j]._id == i)
                aYear.totalRevs = a[j].totalRevs;
        for (var j = 0; j < b.length; j++)
            if (b[j]._id == i)
                bYear.totalRevs = b[j].totalRevs;
        for (var j = 0; j < c.length; j++)
            if (c[j]._id == i)
                cYear.totalRevs = c[j].totalRevs;
        for (var j = 0; j < d.length; j++)
            if (d[j]._id == i)
                dYear.totalRevs = d[j].totalRevs;
        year = {
            year:aYear.year,
            admins:aYear.totalRevs,
            anons:bYear.totalRevs,
            bots:cYear.totalRevs,
            regulars:dYear.totalRevs
        }

        bar1.push(year);
    }


    var totalAdmins = 0;
    var totalBots = 0;
    var totalAnons = 0;
    var totalRegulars = 0;

    admins = await(Individual.getNumberAdminstratorDistinct(title));
    bots = await(Individual.getNumberBotDistinct(title));
    anons = await(Individual.getNumberAnonymousDistinct(title));
    regulars = await(Individual.getNumberRegularDistinct(title));
    console.log(admins);
    if (admins.length != 0)
         totalAdmins += admins[0].totalUsers;
    if (bots.length != 0)
        totalBots += bots[0].totalUsers;
    if (anons.length != 0)
        totalAnons += anons[0].totalUsers;
    if (regulars.length != 0)
        totalRegulars += regulars[0].totalUsers;
    var pie = {
        totalAdmins: totalAdmins,
        totalAnons: totalAnons,
        totalBots: totalBots,
        totalRegulars: totalRegulars
    }

    response = {

    }
    response.bar1 = bar1;
    response.pie1 = pie;

    top5Results = await Individual.getArticleTop5Users(title);//getTop5Users(article);
    bar2 = []
    for (var i = 0; i < 5; i++) {
        barUser = [];
        var e = await Individual.getNumberUser(title, top5Results[i]._id);
        let min = 9999;
        let max = 0;
        if (e.length != 0) {
            if (e[0]._id < min)
                min = e[0]._id;
            if (e[e.length-1]._id > max)
                max = e[e.length-1]._id
        }
        for (var j = min; j < max; j++) {
            eYear = {
                year:j,
                totalRevs:0
            }
            for (var k = 0; k < e.length; k++)
                if (e[k]._id == j)
                    eYear.totalRevs = e[k].totalRevs;
            barUser.push(eYear);
        }

        user = {
            user: top5Results[i]._id,
            data: barUser
        }
        bar2.push(user);
    }
    response.bar2 = bar2;
    console.log(response);

    res.json(response);
}

// module.exports.getIndividualAnalyticsResults = function(req, res){
//     console.log("Individual analytics")
//     query = req.body.articleList;
//     article = query.split(", Number Of Edits")[0].trim();
//     numberOfEdits = query.split(", Number Of Edits")[1].trim();
//     console.log(article[0]);
//     // console.log(req);
//
//     const top5Results = [];
//     const getTop5Users = Bluebird.coroutine(function *(article) {
//         top5Results.push(yield Individual.getArticleTop5Users(article));
//     });
//     getTop5Users(article);
//
//     console.log("top 5 results");
//     console.log(top5Results);
//     Individual.getArticle(article,function(err,result){
//         if (err || result.length <= 0){
//             console.log("Error in query")
//             res.render('something_went_wrong.pug')
//         }else{
//             console.log("Individual")
//             // console.log(result)
//             revision = result;
//             const timestamp = revision[0]['timestamp'];
//             console.log("TimeStamp is " + timestamp);
//             var today = new Date();
//             var dd = String(today.getDate()).padStart(2, '0');
//             var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
//             var yyyy = today.getFullYear();
//
//             today = mm + '/' + dd + '/' + yyyy;
//             console.log(today);
//             console.log(revision);
//             console.log(revision[0]['article']);
//             res.render('individual_analytics_result.pug',{revision:revision, numberOfEdits: numberOfEdits})
//         }
//     })
// }