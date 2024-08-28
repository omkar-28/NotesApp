const Note = require('../models/Notes');
const mongoose = require('mongoose');

// Get '/dashboard' 
exports.dashboard = async (req, res, next) => {
    let perPage = 12;
    let page = parseInt(req.query.page) || 1;  // Use req.query.page to get query parameters

    const locals = {
        title: 'Dashboard - Note App',
        description: 'Note app - Built with Node.js, Express.js and authentication using OAuth'
    };

    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        // Fetch notes with pagination
        const notes = await Note.aggregate([
            { $sort: { updatedAt: -1 } },
            { $match: { user: userId } },
            {
                $project: {
                    title: { $substr: ["$title", 0, 30] },  // Fixed $project syntax
                    body: { $substr: ["$body", 0, 100] }
                }
            }
        ])
            .skip(perPage * (page - 1))  // Correctly calculate skip value
            .limit(perPage)
            .exec();

        // Count total notes for pagination
        const count = await Note.countDocuments({ user: userId });

        const currentYear = new Date().getFullYear();
        // Render the page with the fetched notes and pagination info
        res.render('dashboard/index', {
            currentYear,
            userName: req.user.firstName,
            locals,
            notes,
            layout: "../views/layouts/dashboard",
            current: page,
            pages: Math.ceil(count / perPage)
        });
    } catch (error) {
        console.log(error.message);
        res.send("Access denied")
    }
};

// Get Note By param ID
exports.dashboardViewNote = async (req, res, next) => {
    const note = await Note.findById(req.params.id).where({ user: req.user.id }).lean();

    if (note) {
        const currentYear = new Date().getFullYear();
        res.render('dashboard/view-note', {
            currentYear,
            userName: req.user.firstName,
            noteID: req.params.id,
            note,
            layout: "../views/layouts/dashboard",
        })
    } else {
        res.send("Something went wrong")
    }
};

// Get the dasbhboard add New notes page
exports.dashboardAddNoteView = async (req, res) => {
    const currentYear = new Date().getFullYear();
    res.render('dashboard/add', {
        currentYear,
        userName: req.user.firstName,
        layout: "../views/layouts/dashboard",
    })
};

// Post to dashboard add New notes
exports.dashboardAddNote = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        await Note.create({
            title: req.body.title,
            body: req.body.body,
            user: userId
        });
        res.redirect("/dashboard");
    } catch (error) {
        console.log(error.message);
    }
}

// Update notes
exports.dashboardUpdateNote = async (req, res) => {
    try {
        await Note.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: new Date()
        }).where({ user: req.user.id });

        res.redirect("/dashboard");
    } catch (error) {
        console.log(error);
    }
};

// Delete notes
exports.dashboardDeleteNote = async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id).where({ user: req.user.id });

        res.redirect("/dashboard");
    } catch (error) {
        console.log(error)
    }
}

// Search notes views
exports.dashboardSearchView = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        res.render('dashboard/search', {
            currentYear,
            searchResults: "",
            layout: "../views/layouts/dashboard",
        })
    } catch (error) {
        console.log(error)
    }
};

// Search notes Posts methods
exports.dashboardSearchPost = async (req, res) => {
    try {
        const searchText = req.body.searchTerm;
        const searchNoSpecialChars = searchText.replace(/[^a-zA-Z0-9 ]/g, "");

        const note = await Note.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChars, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChars, 'i') } }
            ]
        }).where({ user: req.user.id });

        const currentYear = new Date().getFullYear();
        res.render('dashboard/search', {
            currentYear,
            searchResults: note,
            layout: "../views/layouts/dashboard",
        });

    } catch (error) {
        console.log(error)
    }
}