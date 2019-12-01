const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = mongoose.Schema({
    username: {type:String, unique: true, required: true},
    password: {type:String, required: true}
})
// Auto hash the password before saving
userSchema.pre('save', function (next) {
    const user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err)
            return next(err);
        user.password = hash
        next();
    })
});
userSchema.statics.authenticate = function (username, password, callback) {
    User.findOne({ username: username })
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                return callback(null, false)
            }
            bcrypt.compare(password, user.password, function (err, result) {
                if (result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            })
        }
        )
}
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, user.password);
};
const User = mongoose.model('User', userSchema)
module.exports = User;