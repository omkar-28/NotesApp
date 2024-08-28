exports.isLoggedIn = function (req, res, next) {
    // console.log(req.user)
    if (req.user) {
        next();
    } else {
        return res.status(401).send("Access Denied");
    }
}