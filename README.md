# WikipdiaAnalytics_Group23

The University of Sydney
COMP5347 Web Application Development
Group Assignment 2 - Data Analytics Web Application

# Overview

WikipdiaAnalytics is MEAN Stack based Web Application to demonstrate communication between 3rd party web service 
and use that to implement few sample analytical graphs.
# Tech

  * JavaScript
  
  * MongoDB
  
  * Node.js
  
  * Angular

#Database Preperation
 
	*An npm install and load of the package.json npm dependencies is required for the site to function

	*Having the boolean attributes isBot and isAdmin in every document in your database collection is required for the Overall functionality to work, a system to update them based on the provided administrator and bot text files similar to the one described below is required for correct output.
	
	*Essentially update the boolean values isBot and isAdmin in each document in the database, if the user in the document appears in the corresponding bot or administrator text file
 
isAdmin and isBot boolean variable database update process


Do this after setting up the analytics database following the week 7 tutorial using the provided dataset from the assignment spec.
In robomongo use these two queries 

db.getCollection('revisions').update({}, {$set: {"isAdmin": false}}, false, true)

db.getCollection('revisions').update({}, {$set: {"isAdmin": false}}, false, true)

 *note the 'revisions' name can be changed based to your collection name if it differs

I have provided in the github a getAdmins.js file just place this in your models folder, this can also be used in any functionality code that requires retrieval 
of the list of admins and bots and returns them as an array.

Next: in the analytics.server.controller.js file 

place this code #this is just presuming your model pointer object is named wiki_ e.g. var wiki_ = require("../models/overall")

the wiki_3 name can also be changed as long as it corrsponds to the variable in the model file (e.g. overall.js)

wiki_.wiki_3.botUpdate(function(err,result3){
	if(err){
		console.log("error in update")
	}else{
		console.log(result3);
	}
})

then in the model file that wiki_ was pointing to include this require, these arrays and this function e.g. overall.js


var txtGet = require('./getAdmins')

var admins = txtGet.readAdmins()
var bots = txtGet.readBots()

RevisionSchema.statics.botUpdate = function(callback){

    var store = new Array;
    for(var i = 0; i < bots.length; i++){
    
        store = this.updateMany({ user: bots[i] },
            { $set: { "isBot" : true } }).exec(callback)

    }
    return store;
}


var wiki_3 = mongoose.model('Revision3', RevisionSchema, 'revisions')

make sure wiki_3 is amongst the modules exported e.g.

module.exports = {
    wiki_:wiki_, 
    wiki_2:wiki_2,
    wiki_3:wiki_3
};

it may take a little while to finish the update

after this repeat running the function with bots.length replaced with admins.length and in the query change the set function to { $set: { "isAdmin" : true } }).exec(callback)

once this is complete and you know it works delete or comment out the functions in both files and remove the schema from the module.exports in the model file.