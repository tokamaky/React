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
    passport.authenticate('google')
);

//logout for user
app.get('/api/logout',(req,res) => {
    req.logout();
    res.send(req.user);
});

//get current user's info
app.get('/api/current-user',(req,res) => {
    res.send(req.user);
})
};
