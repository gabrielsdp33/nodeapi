const jwt = require('jsonwebtoken');

const User = require('../models/user');

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" "); // Removes "Bearer" Word from header value
		// Check if token was sent
		if (token.length > 0) {
			const decoded = jwt.verify(token[1], process.env.JWT_KEY);

			// Check if the token was sent from the correct user
			User.find({ email: decoded.email })
				.exec()
				.then(doc => {
					if (doc[0].token === token[1]) {
						// Check if the user has signed in less than 30 minutes ago
						const user_ultimo_login = new Date(doc[0].ultimo_login).getTime()
						if ((user_ultimo_login + 1800000) > new Date().getTime()) {
							req.userData = decoded;
							next();
						}
						else {
							return res.status(401).json({
								mensagem: "Sessão inválida",
							});
						}
					}
					else {
						return res.status(401).json({
							mensagem: "Não autorizado",
						});
					}
				});
		}
	}
	catch (error) {
		return res.status(401).json({
			mensagem: "Não autorizado",
		});
	}
};