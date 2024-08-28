// GET Homepage

const Notes = require("../models/Notes")

exports.homepage = async (req, res, next) => {
    const locals = {
        title: 'Note App',
        description: 'Note app - Built with Node js, express js and authentication using oauth'
    }
    const currentYear = new Date().getFullYear();
    res.render('index', {
        currentYear,
        userName: req?.user?.id || null,
        locals
    })
}

// GET About Page
exports.about = async (req, res, next) => {
    const locals = {
        title: 'About - Note App',
        description: 'Note app - Built with Node js, express js and authentication using oauth'
    }

    const currentYear = new Date().getFullYear();
    res.render('about', {
        currentYear,
        userName: req?.user?.id || null,
        locals
    })
}