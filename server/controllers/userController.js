const User = require('../models/User')

exports.getUser = async function (req, res) {
    try {
        const user = await User.find();

        res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        res.status(404).json({
            success: true,
            data: `${error.message}`
        })
    }
}