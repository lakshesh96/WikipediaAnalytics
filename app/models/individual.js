/**
 *
 */
var mongoose = require('./analytics_db');
const fs = require('fs');
var RevisionSchema = new mongoose.Schema({
    title: String,
    timestamp:String,
    user:String,
    anon:String,
    isAdmin:Boolean,
    isBot:Boolean
},{
    versionKey: false
});

// var topCNNUserPipeline = [
//     {'$match':{title:"CNN"}},
//     {'$group':{'_id':"$user", 'numOfEdits': {$sum:1}}},
//     {'$sort':{numOfEdits:-1}},
//     {'$limit':5}
// ];
//
// Revision.aggregate(topCNNUserPipeline, function(err, results){
//     if (err){
//         console.log("Aggregation Error")
//     }else{
//         console.log("The top users in CNN is: ");
//         console.log(results)
//     }
// })


RevisionSchema.statics.insertRevisions = function(revision, callback) {

    var Revision = mongoose.model('Revisions', RevisionSchema, 'revisions');
    Revision.insertMany(revision, {ordered: false, useUnifiedTopology: true },function (err) {
        if (err) {
            console.log("InsertMany has Erred");
        }
        else {
            console.log("InsertMany has Suceeded");
        }

    });
    var admins = fs.readFileSync("./administrators.txt", 'utf8').split('\n');
    var bots = fs.readFileSync("./bots.txt", 'utf8').split('\n');

    Revision.update({},
        {$set:{isAdmin:false, isBot:false}},{'multi':true}, function(err,result) {
            if (err) {
                console.log("Update error!")
            } else {
                console.log(result);
            }


            for (var i = 0; i < bots.length; i++) {
                Revision.update({user: bots[i].trim()},
                    {isBot: true}, function (err, result) {
                        if (err) {
                            console.log("Update error!")
                        } else {
                            // console.log(result);
                        }
                    });
            }
            for (var i = 0; i < admins.length; i++) {
                Revision.update({user: admins[i].trim()},
                    {isAdmin: true}, function (err, result) {
                        if (err) {
                            console.log("Update error!")
                        } else {
                            // console.log(result);
                        }
                    });
            }
            console.log("finished");
        });

    // return new Promise(function (resolve, reject) {
    //     resolve();
    // });
}

RevisionSchema.statics.getArticle = function(title,callback){
    return this.aggregate([
        {$match:{title:title}},
        {$sort:{timestamp: -1}},
        {$limit:1}
    ]).exec(callback)
}


RevisionSchema.statics.getArticleTop5Users = function(title,callback){
    return this.aggregate([
        {$match:{title:title}},
        {$group:{'_id':"$user", 'numOfEdits': {$sum:1}}},
        {$sort:{numOfEdits: -1}},
        {$limit:5}
    ]).exec(callback)
}

RevisionSchema.statics.getJson  = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';

    xhr.onload = function() {

        var status = xhr.status;

        if (status == 200) {
            callback(null, xhr.response);
        } else {
            callback(status);
        }
    };

    xhr.send();
};

RevisionSchema.statics.getNumberRevised = function(title, callback) {
    // this.aggregate([
    //     {$group:{'_id':"$title", 'numOfEdits': {$sum:1}}},
    //     {$sort:{numOfEdits:1}},
    //     {$limit:1}
    // ]).exec(callback)
    return this.aggregate([
        {$match:{title:title}},
        {$group:{'_id':"$title", 'numOfEdits': {$sum:1}}},

    ]).exec(callback)

    // return this.aggregate([
    //     {$match:{title:title}},
    //     {$limit:1}
    //     // {$group : {_id:"$title", count:{$sum:1}}}
    // ]).exec(callback)
}

RevisionSchema.statics.getNumberUser= function(title,user,callback) {
    return this.aggregate([
        {$match:{$and:[{title:{$eq:title}},{'user':{$eq:user}}]}},
        {$project: {
                year_: {$year: {$toDate:"$timestamp"}}
            }},
        {$group: {_id: "$year_",totalRevs:{$sum:1}}},
        {$sort:{_id:1}}
    ]).exec(callback)
}


RevisionSchema.statics.getNumberAdministrator= function(title,callback) {
    return this.aggregate([
        {$match:{$and:[{title:{$eq:title}},{'isAdmin':{$eq:true}}]}},
        {$project: {
                year_: {$year: {$toDate:"$timestamp"}}
            }},
        {$group: {_id: "$year_",totalRevs:{$sum:1}}},
        {$sort:{_id:1}}
    ]).exec(callback)
}

RevisionSchema.statics.getNumberAnonymous  = function(title,callback) {
    return this.aggregate([
        {$match:{$and:[{title:{$eq:title}},{'anon':{$eq:true}}]}},
        {$project: {
                year_: {$year: {$toDate:"$timestamp"}}
            }},
        {$group: {_id: "$year_",totalRevs:{$sum:1}}},
        {$sort:{_id:1}}
    ]).exec(callback)
}
RevisionSchema.statics.getNumberBot = function(title,callback) {
    return this.aggregate([
        {$match: {$and:[{title:{$eq:title}},{'isBot':{$eq:true}}]}},
        {$project: {
                year_: {$year: {$toDate:"$timestamp"}}
            }},
        {$group: {_id: "$year_",totalRevs:{$sum:1}}},
        {$sort:{_id:1}}
    ]).exec(callback)
}


RevisionSchema.statics.getNumberRegular = function(title,callback) {
    return this.aggregate([
        {$match:{$and:[{title:{$eq:title}},{'isAdmin':{$eq:false}},{'isBot':{$eq:false}},{'anon':{$ne:true}}]}},
        {$project: {
                year_: {$year: {$toDate:"$timestamp"}}
            }},
        {$group: {_id: "$year_",totalRevs:{$sum:1}}},
        {$sort:{_id:1}}
    ]).exec(callback)
}

RevisionSchema.statics.getNumberRegularDistinct = function(title,callback) {
    return this.aggregate([
        {$match:{$and:[{title:{$eq:title}},{'isAdmin':{$eq:false}},{'isBot':{$eq:false}},{'anon':{$ne:true}}]}},
        {$group: {_id: {user:"$user",title:"$title"}}},
        {$group:{_id:"$_id.title", totalUsers:{$sum:1}}},
        {$sort:{_id:1}}
    ]).exec(callback)
}

RevisionSchema.statics.getNumberAdminstratorDistinct = function(title,callback) {
    return this.aggregate([
        {$match:{$and:[{title:{$eq:title}},{'isAdmin':{$eq:true}}]}},
        {$group: {_id: {user:"$user",title:"$title"}}},
        {$group:{_id:"$_id.title", totalUsers:{$sum:1}}},
        {$sort:{_id:1}}
    ]).exec(callback)
}

RevisionSchema.statics.getNumberBotDistinct = function(title,callback) {
    return this.aggregate([
        {$match: {$and:[{title:{$eq:title}},{'isBot':{$eq:true}}]}},
        {$group: {_id: {user:"$user",title:"$title"}}},
        {$group:{_id:"$_id.title", totalUsers:{$sum:1}}},
        {$sort:{_id:1}}
    ]).exec(callback)
}

RevisionSchema.statics.getNumberAnonymousDistinct = function(title,callback) {
    return this.aggregate([
        {$match:{$and:[{title:{$eq:title}},{'anon':{$eq:true}}]}},
        {$group: {_id: {user:"$user",title:"$title"}}},
        {$group:{_id:"$_id.title", totalUsers:{$sum:1}}},
        {$sort:{_id:1}}
    ]).exec(callback)
}
// RevisionSchema.statics.getList = function(title,callback){
//
//     return this.find({'title':'Australia'})
//         .sort({'timestamp':-1})
//         .limit(1)
//         .exec(callback)
//
//     // return this.aggregate([
//     //     {$group:{'_id':"Australia", title:"Australia", 'numOfEdits': {$sum:1}}},
//     //     {$sort:{numOfEdits:1}},
//     //     {$limit:2}
//     // ]).exec(callback)
// }

var individual = mongoose.model('individual', RevisionSchema, 'revisions')

module.exports = individual