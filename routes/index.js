

/* GET home page. */
// render home page(./views/index.ejs)
module.exports = function (router,passport){
  router.get('/', function(req, res) {
    if(req.isAuthenticated()){
      res.render('chat',{username: req.body.username});
    }else{
      
      res.render('index',{layout : true});
    }
  });
  
  // xu ly login request 
  
  router.get('/login',checkLogin, function(req, res) {
    
    res.render('login.ejs', { message: req.flash('loginMessage') }); 
  });
  
  router.post('/login', passport.authenticate('regular_login', {
    successRedirect : '/profile',
    failureRedirect : '/login', 
    failureFlash : true
  }));
  
  // xu ly request signup  hien thi form dang ky 
  router.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });
  
  router.post('/signup', passport.authenticate('regular_signup', {
    successRedirect : '/', // Điều hướng tới trang hiển thị profile
    failureRedirect : '/signup', // Trở lại trang đăng ký nếu lỗi
    failureFlash : true 
  }));
  
  //  gui lai thong tin dang ky 
  router.get('/profile', isLoggedIn, function(req, res) {
    res.render('chat.ejs', {
      username: req.user.username // truyền đối tượng user cho profile.ejs để hiển thị lên view
    });
  });
  
  
  //  dang xuat 
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  
  //  check login hay chua 
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
      return next();
    }else{
      res.redirect('/');
    }
  }

  function checkLogin(req, res, next) {
    if (!req.isAuthenticated()){
      return next();
    }else{
      res.redirect('/profile');
    }
  }

}



