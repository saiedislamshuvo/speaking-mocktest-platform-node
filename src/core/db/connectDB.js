const mongoose = require('mongoose');

const connectDB = async () => {
	await mongoose.connect(
		process.env.DATABASE_CONNECTION_URL,
		{ dbName: process.env.DATABASE_NAME },
	);
	console.log('Database connected');
};

module.exports = connectDB;
