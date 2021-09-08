require('dotenv').config();
const db = require('./db');

const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');

 // Запускаем сервер на порте, указанном в файле .env, или на порте 4000
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

let notes = [
	{ 
		id: '1',
		content: 'First note',
		author: 'John Smith'
	},
	{ 
		id: '2',
		content: 'Second note',
		author: 'Adam Black'
	},
	{ 
		id: '3',
		content: 'Third note',
		author: 'Jerry White'
	}
];

 // Строим схему с помощью языка схем GraphQL
const typeDefs = gql`
	type Note {
		id: ID!
		content: String!
		author: String!
	}

	type Query {
		hello: String!
		notes: [Note!]!
		note(id: ID!): Note!
	}

	type Mutation {
		newNote(content: String!): Note!
	}
`;
 // Предоставляем функции распознавания для полей схемы 
const resolvers = {
	Query: {
		hello: () => 'Hello World!',
		notes: () => notes,
		note: (parent, args) => {
			return notes.find(note => note.id === args.id);
		}
	},
	Mutation: {
		newNote: (parent, args) => {
			let noteValue = {
				id: String(notes.length + 1),
				content: args.content,
				author: 'Adam Scott'
			};
			notes.push(noteValue);
			return noteValue;
		}
	}
};

const app = express();
// Подключаем БД 
 db.connect(DB_HOST);

 // Настраиваем Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });
// Применяем промежуточное ПО Apollo GraphQL и указываем путь к /api
server.applyMiddleware({ app, path: '/api' });

app.listen({ port }, 
	() => console.log(`Server running at http://localhost:${port}${server.graphqlPath}`)
);