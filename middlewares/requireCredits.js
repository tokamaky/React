module.exports = (req, res, next) => {
    //to make sure user has logged in
    if(!req.user.credits < 1){
        return res.status(403).send({error: 'Not enough Credits'})
    }

    next();
};