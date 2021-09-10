const express = require('express');
const { ApolloServer } = require('apollo-server-express');
require('dotenv').config();
const jwt = require('jsonwebtoken');

// Импортируем локальные модули
const db = require('./db');
const models = require('./models');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

 // Запускаем сервер на порте, указанном в файле .env, или на порте 4000
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const app = express();
// Подключаем БД 
 db.connect(DB_HOST);

 // Настраиваем Apollo Server
const server = new ApolloServer({ 
	typeDefs,
	resolvers,
	context: ({ req }) => {
		// Получаем токен пользователя из заголовков
		const token = req.headers.authorization;
		// Пытаемся извлечь пользователя с помощью токена
		const user = getUser(token);

		console.log(user);
		// Добавление моделей БД и пользователя в context 
 		return { models, user };
	}
});
// Применяем промежуточное ПО Apollo GraphQL и указываем путь к /api
server.applyMiddleware({ app, path: '/api' });

app.listen({ port }, 
	() => console.log(`Server running at http://localhost:${port}${server.graphqlPath}`)
);

// Получаем информацию пользователя из JWT
const getUser = (token) => {
	if (token) {
		try {
			// Возвращаем информацию пользователя из токена 
			return jwt.verify(token, process.env.JWT_SECRET);
		} catch (error) {
			// Если с токеном возникла проблема, выбрасываем ошибку
			new Error('Session invalid');
		}
	}
};