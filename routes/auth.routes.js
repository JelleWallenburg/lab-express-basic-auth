//use express package
const router = require("express").Router();


//use bcryptjs and 10 saltrounds
const bcryptjs =require('bcryptjs');
const saltRounds= 10;

const User = require('../models/User.model');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard');


router.get("/signup", (req, res) => {
    res.render("auth/signup")
});

router.post("/signup", (req, res) =>{
    console.log('req.session', req.session)
    const {username, pass }= req.body;
    console.log(`Username: ${username} & Password ${pass}`);

    bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(pass, salt))
    .then(hashedPassword => {
        console.log(hashedPassword)
        return User.create({
            username,
            password: hashedPassword
        });
    })
    .then(userFromDB => {
        console.log('Newly created user is ', userFromDB)
        res.redirect("signup")
    })
    .catch(error => console.log(error));
});

//login get
router.get('/login', (req, res) =>{
    res.render("auth/login")
})

//login post
router.post('/login', (req, res) =>{
    console.log('req.body', req.body);
    const {username, password} = req.body;

    if (!username || !password){
        res.render("auth/login",{
            errorMessage: 'Please enter both, username and password to login'
        }
        )
    }
    User.findOne({username})
      .then(user => {
      console.log('user', user)
      if (!user) { // if user not found in the Db
        res.render('auth/login', { errorMessage: 'Username is not registered. Try with other username.' });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) { // if entered password matches user password
        const {username} = user;
        console.log(username)
        req.session.currentUser = user; // add property currentUser to my session
        console.log('req.session currentuser  ==>', req.session.currentUser)      
        res.render('auth/profile', {UserInSession: req.session.currentUser});
      } else { // if entered password doesnt match user.password
        res.render('auth/login', { ErrorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => console.log(error));
})

router.get('/main', (req, res) =>{
    try{
        res.render("main")
    }
    catch (error) {
        console.log(error)
    }
})

router.get("/private", isLoggedIn, (req, res, next) => {
    res.render("private");
})


router.post('/logout', isLoggedIn, (req,res) =>{
    req.session.destroy(err => {
      if (err) console.log(err);
      res.redirect('/');
    });
})



//logout post
module.exports = router;

