const passport = require('passport');

module.exports= (app) =>{
app.get(
    '/auth/google',
    passport.authenticate('google',{
        scope:['profile','email']
    })
);

//google sign in application 
app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req,res) => {
        res.redirect('/surveys');
    }
);

//logout for user
app.get('/api/logout',(req,res) => {
    req.logout();
    res.redirect('/');
});

//get current user's info
app.get('/api/current_user',(req,res) => {
    res.send(req.user);
})
};
