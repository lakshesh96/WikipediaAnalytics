var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    securityQuestion:{
        type: String,
        required: true
    },
    securityAnswer:{
        type: String,
        required: true
    }
});

// Use bcrypt library to generate password hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Verify Password
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// Return Security Question based on Email Id
/*
userSchema.statics.getSecurityQuestion = function(email){
    this.findOne({'email': email}, function(err, result) {
        if(err) throw err;
        console.log("Lol" + result);
        return result;
    });
}
*/
userSchema.statics.getUserByEmail = function(email, callback){
    return new Promise((resolve, reject) => { 
        this.findOne({'email': email}).exec(callback);
    })
}

module.exports = mongoose.model('User', userSchema);