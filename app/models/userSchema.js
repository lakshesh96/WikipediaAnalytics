var mongoose = require('./analytics_db')

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

var UserSchema = module.exports = mongoose.model('UserSchema', userSchema);