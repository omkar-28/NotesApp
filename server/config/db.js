const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`Database connection at: ${conn.connection.host}`);
    } catch (error) {
        console.error(error.message)
    }
}

module.exports = connectDB;