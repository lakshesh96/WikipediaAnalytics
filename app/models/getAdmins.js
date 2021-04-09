var fs = require("fs");

module.exports.readAdmins = function(req,res){

    var text = fs.readFileSync("./administrators.txt", 'utf8').split('\n');

    return text;
}
module.exports.readBots = function(req,res){

    var text = fs.readFileSync("./bots.txt", 'utf8').split('\n');
    return text;
}