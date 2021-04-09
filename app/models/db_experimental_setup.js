const Bluebird = require('bluebird');
const glob = Bluebird.promisify(require('glob'));
const mongodb = require('mongodb');
const fs = Bluebird.promisifyAll(require('fs'));
const Path = require('path');
const MongoClient = mongodb.MongoClient;
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Asst2Data', { useNewUrlParser: true }, function () {
    console.log('mongodb connected');
});

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

var Revision = mongoose.model('Revision', RevisionSchema, 'revisions');



const insertMillionsFromPath = Bluebird.coroutine(function *(path, mongoConnString) {
    const db = yield MongoClient.connect(mongoConnString);
    console.log(path);
    try {
        const collection = Revision;
        const files = yield glob(Path.join(path, "*.json"));
        yield Bluebird.map(
            files,
            Bluebird.coroutine(function *(filename) {
                console.log("reading", filename);
                const fileContent = yield fs.readFileAsync(filename);
                const obj = JSON.parse(fileContent);

                console.log("inserting", filename);

                Revision.insertMany(obj, {ordered: false, useUnifiedTopology: true },function (err) {
                    if (err) {
                        console.log("InsertMany has Erred");
                    }
                    else {
                        console.log("InsertMany has Suceeded");
                    }

                });
            }),
            {concurrency: 10} // You can increase concurrency here
        );
    } finally {
        var admins = fs.readFileSync("../../administrators.txt", 'utf8').split('\n');
        var bots = fs.readFileSync("../../bots.txt", 'utf8').split('\n');


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
        yield db.close();
    }
});




insertMillionsFromPath("../../Dataset_22_March_2020/revisions/", "mongodb://localhost:27017/database")
    .then(()=>console.log("OK"))
    .catch((err)=>console.log("ERROR", err));