var mongoose = require('./analytics_db')
var txtGet = require('./getAdmins')
mongoose.Promise = require('bluebird')

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

var admins = txtGet.readAdmins()
var bots = txtGet.readBots()

var UserAdmin = ""

var author = ""

var article = ""

var usrAdmin = function setUser(usr){
    console.log("The User has BEEN SET")
    UserAdmin = usr
}

// var AuthorSet = function setAuthor(usr){
//     console.log("The Author has BEEN SET")
//     author = usr
// }


var AuthorArticleSet = function setAuthorArticle(usr,art){
    console.log("The Author has BEEN SET")
    author = usr
    article = art
}
//Promise testing, doesn't affect code at the moment just ignore returned promise

RevisionSchema.statics.getOverallArticles = async function(){

    return Promise.all([

        this.aggregate([
            {$group:{_id:"$title", numOfEdits: {$sum:1}}},
            {$sort:{numOfEdits:1}}
            ]),  
        this.aggregate([
            {$group:{_id:"$title", numOfEdits: {$sum:1}}},
            {$sort:{numOfEdits:-1}}
            ])
    ])

}

RevisionSchema.statics.getTopRevised = function(callback){
    
    return new Promise((resolve, reject) => { 
    this.aggregate([
        {$group:{_id:"$title", numOfEdits: {$sum:1}}},
        {$sort:{numOfEdits:-1}}
        ]).exec(callback)
    })
}


RevisionSchema.statics.getBottomRevised = function(callback){
    
    return new Promise((resolve, reject) => { 
    this.aggregate([
        {$group:{_id:"$title", numOfEdits: {$sum:1}}},
        {$sort:{numOfEdits:1}}
        ]).exec(callback)
    })
}

RevisionSchema.statics.getNonBotAdmin = function(callback){
    
    return this.find().distinct("user",{'isAdmin':{$eq:true}},{'isBot':{$eq:false}}).exec(callback)
}

RevisionSchema.statics.getUserAdmin = function(callback){
    
    return this.find({'user':UserAdmin}).exec(callback)
}

/////////////////////////////3/4
RevisionSchema.statics.getAdminRegUserRevs = function(callback){


    return this.aggregate([
        {$match: {$and:[{'isAdmin':{$eq:true}},{'isBot':{$eq:false}},{'anon':{$ne:true}}]}},
        {$group:{_id:"$user", count:{$sum:1}}},
        {$sort:{count:-1}}
        ]).exec(callback)

}

RevisionSchema.statics.getNonAdminRegUserRevs = function(callback){


    return this.aggregate([
        {$match: {$and:[{'isAdmin':{$eq:false}},{'isBot':{$eq:false}},{'anon':{$ne:true}}]}},
        {$group:{_id:"$user", count:{$sum:1}}},
        {$sort:{count:-1}}
        ]).exec(callback)

}

/////////////////////////////////////3/4
RevisionSchema.statics.getAdminRegArticle = function(callback){


    return this.aggregate([
        {$match: {$and:[{'isAdmin':{$eq:true}},{'isBot':{$eq:false}},{'anon':{$ne:true}}]}},
        {$group:{_id:"$title", count:{$sum:1}}},
        {$sort:{count:-1}}
        ]).exec(callback)

}

RevisionSchema.statics.getNonAdminRegArticle = function(callback){


    return this.aggregate([
        {$match: {$and:[{'isAdmin':{$eq:false}},{'isBot':{$eq:false}},{'anon':{$ne:true}}]}},
        {$group:{_id:"$title", count:{$sum:1}}},
        {$sort:{count:-1}}
        ]).exec(callback)

}


RevisionSchema.statics.getOldestArticles = function(callback){

    return this.aggregate([
        {$group: {
          _id: "$title",
          earliest: { $min:"$timestamp" }
         }},
         {$addFields:{
           age: { $subtract: [new Date(), {$toDate:"$earliest"}] }
           //ageDays: {$divide:[$subtract: [new Date(), {$toDate:"$earliest"},1000 * 60 * 60 * 24 ]}
         }},
         {$sort:{age:-1}}
        ]).exec(callback)
    
    }

    RevisionSchema.statics.getYoungestArticles = function(callback){

        return this.aggregate([
            {$group: {
              _id: "$title",
              earliest: { $min:"$timestamp" }
             }},
             {$addFields:{
               age: { $subtract: [new Date(), {$toDate:"$earliest"}] }
               //ageDays: {$divide:[$subtract: [new Date(), {$toDate:"$earliest"},1000 * 60 * 60 * 24 ]}
             }},
             {$sort:{age:1}}
            ]).exec(callback)
        
        }

    RevisionSchema.statics.getBarGraphAdmins = function(callback){

        return new Promise((resolve, reject) => { 
        this.aggregate([
            {$match: {$and:[{'isAdmin':{$eq:true}},{'isBot':{$eq:false}},{'anon':{$ne:false}}]}},
            {$project: { 
                year_: {$year: {$toDate:"$timestamp"}}
            }},
            {$group: {_id: "$year_",totalRevs:{$sum:1}}},
            {$sort:{year_:1}}
         ]).exec(callback)
        })
        }

    RevisionSchema.statics.getBarGraphReg = function(callback){

        return new Promise((resolve, reject) => { 
        this.aggregate([
            {$match: {$and:[{'isAdmin':{$eq:false}},{'isBot':{$eq:false}},{'anon':{$ne:false}}]}},
            {$project: { 
                year_: {$year: {$toDate:"$timestamp"}}
            }},
            {$group: {_id: "$year_",totalRevs:{$sum:1}}},
            {$sort:{year_:1}}
         ]).exec(callback)
        })
        }
        
    RevisionSchema.statics.getBarGraphBots = function(callback){

        return this.aggregate([
            {$match: {$and:[{'isBot':{$eq:true}}]}},
            {$project: { 
                year_: {$year: {$toDate:"$timestamp"}}
            }},
            {$group: {_id: "$year_",totalRevs:{$sum:1}}},
            {$sort:{year_:1}}
         ]).exec(callback)
        
        }

    RevisionSchema.statics.getBarGraphAnon = function(callback){

        return this.aggregate([
            {$match: {$and:[{'anon':{$ne:true}}]}},
            {$project: { 
                year_: {$year: {$toDate:"$timestamp"}}
            }},
            {$group: {_id: "$year_",totalRevs:{$sum:1}}},
            {$sort:{year_:1}}
         ]).exec(callback)
        
        }
    RevisionSchema.statics.getAnonTotal = function(callback){
        return this.aggregate([
            {$match: {$and:[{'isAdmin':{$eq:false}},{'isBot':{$eq:false}},{'anon':{$ne:true}}]}},
            {$group:{_id:"user", count:{$sum:1}}}
            ]).exec(callback)
    }
    RevisionSchema.statics.getAdminTotal = function(callback){
        return this.aggregate([
            {$match: {$and:[{'isAdmin':{$eq:true}},{'isBot':{$eq:false}},{'anon':{$ne:false}}]}},
            {$group:{_id:"user", count:{$sum:1}}}
            ]).exec(callback)
    }
    RevisionSchema.statics.getBotTotal = function(callback){
        return this.aggregate([
            {$match: {$and:[{'isBot':{$eq:true}},{'anon':{$ne:false}}]}},
            {$group:{_id:"user", count:{$sum:1}}}
            ]).exec(callback)
    }
    RevisionSchema.statics.getRegTotal = function(callback){
        return this.aggregate([
            {$match: {$and:[{'isAdmin':{$eq:false}},{'isBot':{$eq:false}},{'anon':{$ne:false}}]}},
            {$group:{_id:"user", count:{$sum:1}}}
            ]).exec(callback)
    }

    /////////////////////////Author modules
    RevisionSchema.statics.getAuthorArticles = function(callback){
    
        return new Promise((resolve, reject) => { 
        this.aggregate([
            {$match:{'user':author}},
            //{$match:{'user':"RL0919"}},
            {$group:{_id:"$title", numOfEdits: {$sum:1}}},
            {$sort:{numOfEdits:-1}}
            ]).exec(callback)
        })
    }

    RevisionSchema.statics.getAuthorArticleTimestamps = function(callback){
    
        return new Promise((resolve, reject) => { 
        this.aggregate([
            {$match:{$and:[{'user':author},{'title':article}]}},
            {$group:{_id:"$timestamp"}},
            {$sort:{_id:-1}},
            {$limit:20}
            ]).exec(callback)
        })
    }

///this one for DBS UPDATE, adds isAdmin and isBot to the DBS
/*RevisionSchema.statics.botUpdate = function(callback){
    //console.log("start query");
    var store = new Array;
    for(var i = 0; i < bots.length; i++){
    
        store = this.updateMany({ user: bots[i] },
            { $set: { "isBot" : true } }).exec(callback)

    }
    return store;
}*/
/*RevisionSchema3.statics.updateAdmin = function(callback){
    return this.update({}, {$set: {"isAdmin": false}}, false, true)
}*/

//console.log("query received")
var wiki_ = mongoose.model('Revision', RevisionSchema, 'revisions')
//console.log(admins)
module.exports = {
    wiki_:wiki_,
    usrAdmin:usrAdmin,
    AuthorSet: function(usr) {
        console.log("The Author has BEEN SET")
        author = usr
    },
    ArtSet: function(usr) {
        console.log("The Article has BEEN SET")
        article = usr
        console.log(article)
        console.log(author)
    },
    AuthorArticleSet:AuthorArticleSet

};

