const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.users_get_all = (req, res) => {
	User.find()
		.exec()
		.then(docs => {
			const users = {
				count: docs.length,
				users: docs.map(doc => {
					return {
						nome: doc.nome,
						email: doc.email,
						_id: doc._id,
						data_criacao: doc.data_criacao,
						data_atualizacao: doc.data_atualizacao,
						ultimo_login: doc.ultimo_login,
						token: doc.token,
					}
				}),
			}
			res.status(200).json(users);
		})
		.catch(err => {
			res.status(500).json({
				mensagem: err,
			});
		});
}

exports.users_get_user = (req, res) => {
	const id = req.params.id;

	User.findById(id)
		.exec()
		.then(doc => {
			if (doc) {
				res.status(200).json({
					nome: doc.nome,
					email: doc.email,
					_id: doc._id,
					data_criacao: doc.data_criacao,
					data_atualizacao: doc.data_atualizacao,
					ultimo_login: doc.ultimo_login,
					token: doc.token,
					telefones: doc.telefones.map(tel => {
						return {
							numero: tel.numero,
							ddd: tel.ddd,
						}
					}),
				});
			}
			else {
				res.status(404).json({
					mensagem: "Usuário não encontrado",
				});
			}
		})
		.catch(err => {
			res.status(500).json({ mensagem: err.message });
		});
}

exports.user_signup = (req, res) => {
	User.find({ email: req.body.email })
		.exec()
		.then(user => {
			if (user.length >= 1) {
				return res.status(409).json({
					mensagem: "E-mail já existente",
				});
			}
			else {
				bcrypt.hash(req.body.senha, 10, (err, hash) => {
					if (err) {
						return res.status(500).json({
							mensagem: err.message,
						});
					}
					else {
						const token = jwt.sign(
							{
								email: req.body.email,
							},
							process.env.JWT_KEY,
							{
								expiresIn: "30m",
							},
						)

						const user = new User({
							_id: new mongoose.Types.ObjectId(),
							nome: req.body.nome,
							email: req.body.email,
							senha: hash,
							telefones: req.body.telefones,
							token: token,
						});

						user
							.save()
							.then(result => {
								res.status(201).json({
									message: "Usuário cadastrado com sucesso",
									usuario: {
										nome: result.nome,
										email: result.email,
										_id: result._id,
										data_criacao: result.data_criacao,
										data_atualizacao: result.data_atualizacao,
										ultimo_login: result.ultimo_login,
										token: result.token,
									},
								});
							})
							.catch(err => {
								res.status(500).json({ mensagem: err.message });
							});
					}
				});
			}
		});
}

exports.user_signin = (req, res) => {
	User.find({ email: req.body.email })
		.exec()
		.then(user => {
			if (user.length < 1) {
				return res.status(404).json({
					mensagem: "Usuário e/ou senha inválidos",
				});
			}
			bcrypt.compare(req.body.senha, user[0].senha, (err, result) => {
				if (err) {
					return res.status(401).json({
						mensagem: "Usuário e/ou senha inválidos",
					});
				}

				if (result) {
					const id = user[0]._id;

					const newtoken = jwt.sign(
						{
							email: user[0].email,
						},
						process.env.JWT_KEY,
						{
							expiresIn: "30m",
						},
					)

					User.findOneAndUpdate({ _id: id }, { $set: { token: newtoken, data_atualizacao: new Date(), ultimo_login: new Date() } })
						.exec()
						.then(result => {
							res.status(200).json({
								mensagem: "Usuário autenticado com sucesso",
								usuario: {
									nome: result.nome,
									email: result.email,
									_id: result._id,
									data_criacao: result.data_criacao,
									data_atualizacao: result.data_atualizacao,
									ultimo_login: result.ultimo_login,
									token: newtoken,
								},
							});
						})
						.catch(err => {
							res.status(500).json({
								error: err,
							});
						});
				}
				else {
					res.status(401).json({
						mensagem: "Não autorizado",
					});
				}
			});

		})
		.catch(err => {
			res.status(500).json({
				mensagem: err.message,
			});
		});
}