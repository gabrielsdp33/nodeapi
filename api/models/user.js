const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	nome: { type: String, required: true },
	email: {
		type: String,
		required: true,
		unique: true,
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
	},
	senha: { type: String, required: true },
	telefones: [{
		numero: { type: Number },
		ddd: { type: Number },
	}],
	token: { type: String, default: "" },
	data_criacao: { type: Date, default: Date.now },
	data_atualizacao: { type: Date, default: new Date() },
	ultimo_login: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);