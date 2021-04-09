// var mongoose = require('mongoose');
// const Bluebird = require('bluebird');
// var MongoClient = require('mongodb').MongoClient;
// mongoose.connect('mongodb://localhost/Asst2Data', { useNewUrlParser: true }, function () {
//     console.log('mongodb connected');
// });
//
// var RevisionSchema = new mongoose.Schema({
//     title: String,
//     timestamp:String,
//     user:String,
//     anon:String,
//     isAdmin:Boolean,
//     isBot:Boolean
// },{
//     versionKey: false
// });
// var fs = require("fs");
//
// var admins = fs.readFileSync("../../administrators.txt", 'utf8').split('\n');
// var bots = fs.readFileSync("../../bots.txt", 'utf8').split('\n');
//
// var Revision = mongoose.model('Revision', RevisionSchema, 'revisions');
//
// var list = [];
// fs.readdirSync("../../Dataset_22_March_2020/revisions").forEach(file => {
//     console.log(file);
//     list.push(file);
// });
// var json;
// for (var i = 0; i < list.length; i++) {
//     console.log('pushing '+list[i]);
//     fs.readFileAsync("../../Dataset_22_March_2020/revisions/"+list[i], 'utf8')
//         .then(JSON.parse)
//         .then(function(json){
//             Revision.insertMany(json,function(err){
//                 if (err) {
//                     console.log("InsertMany has Erred");
//                 }
//                 else {
//                     console.log("InsertMany has Suceeded");
//                 }
//             })
//         });
//
//
//     // Revision.insertMany(json, {ordered: false, useUnifiedTopology: true },function (err) {
//     //     if (err) {
//     //         console.log("InsertMany has Erred");
//     //     }
//     //     else {
//     //         console.log("InsertMany has Suceeded");
//     //     }
//     //
//     // });
// }
//
//
// Revision.update({},
//     {$set:{isAdmin:false, isBot:false}},{'multi':true}, function(err,result) {
//         if (err) {
//             console.log("Update error!")
//         } else {
//             console.log(result);
//         }
//
//
//         for (var i = 0; i < bots.length; i++) {
//             Revision.update({user: bots[i].trim()},
//                 {isBot: true}, function (err, result) {
//                     if (err) {
//                         console.log("Update error!")
//                     } else {
//                         // console.log(result);
//                     }
//                 });
//         }
//         for (var i = 0; i < admins.length; i++) {
//             Revision.update({user: admins[i].trim()},
//                 {isAdmin: true}, function (err, result) {
//                     if (err) {
//                         console.log("Update error!")
//                     } else {
//                         // console.log(result);
//                     }
//                 });
//         }
//         console.log("finished");
//     });
//
//
//
// module.exports = mongoose;
