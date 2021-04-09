const User = require("../models/user");

// render the login page
exports.getLogin = (req,res,next) => {
    // saved the cookie as a variable for use
    // const isLoggedIn = req
    //     .get('Cookie')
    //     .split(';')[0]
    //     .trim()
    //     .split('=')[1] === 'true';
    console.log(req.session.isLoggedIn0);
    res.render('auth/login', {
        path: '/login',        
        pageTitle: 'Login',
        isAuthenticated: false
    })
    
};

// handle our login post route
exports.postLogin = (req, res, next) => {
    User.findById('6064f211477d333588f9e3cf')
      .then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save((err) => {
            console.log(err);
            res.redirect('/');
        })
      })
      .catch(err => console.log(err));
  };

// handle our login post route
exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
      console.log(err);
      res.redirect('/');
    });
  };