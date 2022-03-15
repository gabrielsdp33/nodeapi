const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/user');

mongoose.connect("mongodb+srv://accentureuser:" + process.env.MONGO_PW + "@tcc.61kwl.mongodb.net/accusers?retryWrites=true&w=majority", {
	useUnifiedTopology: true,
	useNewUrlParser: true,
});
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Prevent CORS errors
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization",
	);
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "GET, POST");
		return res.status(200).json({});
	}
	next();
});

// Routes
app.use('/user', userRoutes);

// Handling 404 error
app.use((req, res, next) => {
	const error = new Error('Url não encontrada');
	error.status = 404;
	next(error);
});

// Handling any other kind of errors
app.use((error, req, res) => {
	res.status(error.status || 500);
	res.json({
		mensagem: error.message,
	})
});

module.exports = app;