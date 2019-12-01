var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../model/user');

module.exports = function(passport){
    // duoc goi khi co request can xac thuc 
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('regular_login', new LocalStrategy({
            // lay 2 thuoc tinh 'email' va 'password' trong request
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true 
        },function(req,username,password,done){
            // tim nguoi dung trong co so du lieu 
            
            User.findOne({'username': req.body.username}, function(err, user){
                if(err){
                    console.log("error when find user");
                    return done(err);
                };
                    
                //check xem user co ton tai k. neu khong ton tai gui lai thong bao khong ton tai
                if(!user){
                    console.log("No user found");
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                };
                    
                // check xem mat khau da dung voi user chua. neu chua dung gui lai thong bao sai mat khau
                if (!user.validPassword(password)){
                    console.log("Oops! Wrong password");
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                };
                
                return done(null, user);
            })
        }
    ))

    //passport cho requet signup 
    passport.use('regular_signup', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true 
    }, function(req, email, password,done){
        process.nextTick(function(){
            User.findOne({username: req.body.username}, function(err, user){
                if (err)
                    return done(err);
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'user  đã tồn tại .'));
                } else {
                    const user = new User({ username: req.body.username, password: req.body.password })
                    user.save(function(err) {
                        if (err){
                            return done(null, false, req.flash('signupMessage', 'da say ra loi'));
                        }else{
                            return done(null, user);
                        }
                        
                    });
                }
            })
        })
    }))
}