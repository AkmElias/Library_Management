const jwt = require('jsonwebtoken')

module.exports = function(req,res,next) {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send("access denied!");

    try{
       const veryfied = jwt.verify(token,process.env.TOKEN_SECRET);
       if(veryfied) req.user = veryfied;
       next()
    } catch(err){
        return res.status(400).send("Invalid token!");
    }
}

