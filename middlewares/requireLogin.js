module.exports = (req, res, next) => {
    //to make sure user has logged in
    if(!req.user){
        return res.status(401).send({error: 'you must log in!'})
    }

    next();
};