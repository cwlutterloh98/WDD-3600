// node built in library
const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
// when you only want specific things from package {}
const { validationResult } = require('express-validator/check')

const User = require("../models/user");

// setup how emails will be delivered

const transporter = nodemailer.createTransport(sendgridTransport({
  // this object is information you get from your send grid account
  auth: {
    // key found under "settings / api keys"
    api_key: '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'
  }
}));

// render the login page
exports.getLogin = (req,res,next) => {
  // get error message if it doesn't exist set to null
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
    res.render('auth/login', {
        path: '/login',        
        pageTitle: 'Login',
        // access the flash message by the key
        errorMessage: message,
        oldInput: {
          email: '',
          password: ''
        },
        validationErrors: []
    })
    
};

// copied from setup
exports.getSignup = (req, res, next) => {
  // same as getlogin
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: ""
    },
      // return another array 
      validationErrors: []
  });
};

// handle our login post route
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // copied from signup
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }

  // find user by looking for matching email
    User.findOne({email: email})      
    .then(user => {
      if (!user) {
        // flash method takes a key and a message
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });     
       }
      // validate the password
      bcrypt.compare(password, user.password)
      .then(doMatch => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
              console.log(err);
              return res.redirect('/');
          });
        }
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password',
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });     
      })
      .catch(err => {
        res.redirect('/login');
      })
      
    })
    .catch(err => {
      const error = new Error('Creating a product failed.')
      error.httpStatusCode = 500;
      return next(error);
  })  };

// copied form setup
exports.postSignup = (req, res, next) => {
  // get request fields by name
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req);
  // isEmpyt method return true or false if you have errors
  if (!errors.isEmpty()) {
    console.log(errors.array())
    // 422 is standard status code for bad validation
    return res.status(422)
    .render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      // array function returns an array of errors you might have
      errorMessage: errors.array()[0].msg,
      oldInput: { 
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword 
      },
      // return another array 
      validationErrors: errors.array()
    });
  }

    // store hashed password
    // value of 12 is how many times it's hashed value of 12 is good
    bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({  
        email: email,
        password: hashedPassword,
        cart: {items: []}
      });
      return user.save();
    })
    // then returns after user saves
    .then(result => {
      res.redirect('/login')
      // sendmail takes a javascript object to configure email
      return transporter.sendMail({
        to: email,
        from: 'add your email here',
        subject: 'signup succeeded',
        html: '<h1>You successfully signed up!</h1>'
      });
    })
    .catch(err => {
      const error = new Error('Creating a product failed.')
      error.httpStatusCode = 500;
      return next(error);
    })
};

// handle our login post route
exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
      console.log(err);
      res.redirect('/');
    });
  };

  exports.getReset = (req, res, next) => {
    // same as getlogin
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
    res.render('auth/reset', {
      path: '/reset',
      pageTitle: 'Reset Password',
      errorMessage: message
    });
  }

  // runs when you click the submit button on reset page
  exports.postReset = (req, res, ext) => {
    // 32 bytes either get an error or a buffer of the bytes
    crypto.randomBytes(32,(err, buffer) => {
      if (err) {
        console.log(err);
        return res.redirect('/reset');
      }
      // create a token with the buffer which stores hex
      const token = buffer.toString('hex');
      // request view we have the request on the email field
      User.findOne({email: req.body.email})
      .then(user => {
        if (!user) {
          // show a flash message in the hidden input box
          req.flash('error', 'No account with that email found.')
          return res.redirect('/reset');
        }
        user.resetToken = token;
        // 3600000ms = 1 hour
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');

        // send that token we sent an email
        transporter.sendMail({
          to: req.body.email,
          from: 'cwlutterloh98@hotmail.com',
          subject: 'Password Reset',
          // use ${} to inject javascript
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link to set a new password</p>

          `
        });
      })
      .catch(err => {
        const error = new Error('Creating a product failed.')
        error.httpStatusCode = 500;
        return next(error);
      })
    })
  };

  // handle get request for new password
  exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({
      resetToken: token,
      // special operator to make sure token is within a certain date
      // $gt stands for greater than
      resetTokenExpiration: {$gt: Date.now()}
    })
    .then(user => {
      // handles errors
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      // renders the new-password page
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      const error = new Error('Creating a product failed.')
      error.httpStatusCode = 500;
      return next(error);
    })
  };

  exports.postNewPassword = (req, res, next) => {
    // extract new password and userid
    const newPassword = req.body.password;
    const userId = req.body.userId
    // want token for security
    const passwordToken = req.body.passwordToken
    let resetUser;

    // reset your user
    User.findOne({
      resetToken: passwordToken, 
      resetTokenExpiration: {$gt: Date.now()},
      _id: userId
      })
      .then(user => {
        resetUser = user;
        // assign a new password to the user
        return bcrypt.hash(newPassword, 12);
      })
      .then(hashedPassword => {
        // these fields need changed others need removed
        resetUser.password = hashedPassword;
        resetUser.resetToken = null;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
      })
      .then(result => {
        // redirect them back to the login page
        res.redirect('/login');
      })
      .catch(err => {
        const error = new Error('Creating a product failed.')
        error.httpStatusCode = 500;
        return next(error);
      })
  }