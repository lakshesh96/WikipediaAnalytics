var User = require("../models/user")
var app = require("../../wikiserver")
var Promise = require('bluebird');
var mongoose = require('mongoose');
var mongoose = Promise.promisifyAll(mongoose);

// Logic for Password Reset
module.exports.getSecurityQuestion = function(req, res){
    
    var email = req.body.email;

    User.getUserByEmail(email, function(err,result){
        if (err){
            console.log("Error in query")
        }else{
            if(result != null){
                res.json(result.securityQuestion);
            }
            else{
                console.log("User not found!");
                res.status(404).json({
                    errors: {
                        Username: 'User Not Found',
                    },
                });
            }
        }
    });
}

module.exports.resetPassword = function(req, res){

    var email = req.body.email;
    var securityAnswer = req.body.securityAnswer;
    var newPassword = req.body.newPassword;

    User.getUserByEmail(email, function(err,result){
        if (err){
            console.log("Error in query")
        }else{
            var outcome = false;
            if(result != null){
                if(result.securityAnswer.toLowerCase() != securityAnswer.toLowerCase()){
                    res.status(401).json({
                        errors: {
                            Security: 'Wrong Answer! Please try again.',
                        },
                    });
                }
                else{
                    generateNewUser(newPassword, result, res);
                }
            }
            else{
                console.log("4");
                res.status(404).json({
                    errors: {
                        Security: 'User Not Found',
                    },
                });
            }
        }
    });
}

var generateNewUser = function(newPassword, result, res){
    var newUser = new User();
    newUser.firstName = result.firstName;
    newUser.lastName = result.lastName;
    newUser.email = result.email;
    newUser.password = newUser.generateHash(newPassword);
    newUser.securityQuestion = result.securityQuestion;
    newUser.securityAnswer = result.securityAnswer;
    newUser.save(function(err) {
        console.log("1");
        console.log(err);
        if (err){
            console.log("2");
            res.status(500).json({
                errors: {
                    Security: 'User save failed! Please try again later.',
                },
            });
        }
        else{
            console.log("3");
            User.deleteOne({email: result.email})
                    .then(function(result){
                        console.log(`Deleted ${result.deletedCount} item.`);
                        res.status(201).json({
                            errors: {
                                Security: 'User save failed! Please try again later.',
                            },
                        });
                    })
                    .catch(err => console.error(`Delete failed with error: ${err}`));
        }
    });
}