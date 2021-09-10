 // Запросим библиотеку mongoose 
const mongoose = require('mongoose');
 // Определяем схему БД заметки
const noteSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: true
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		favoriteCount: {
			type: Number,
			default: 0
		},
		favoritedBy: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
			}
		]
	},
	{
		// Присваиваем поля createdAt и updatedAt c типом данных
		timestamps: true
	}
);
// Определяем модель 'Note' со схемой
const Note = mongoose.model('Note', noteSchema);
// Экспортируем модуль
module.exports = Note;