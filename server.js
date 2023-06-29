import ticketsFull from './tickets.json' assert { type: 'json' };

import http from 'http';
import Koa from 'koa';
import { koaBody } from 'koa-body';
import cors from '@koa/cors';

let tickets = [...ticketsFull];

const app = new Koa();

app.use(cors());

app.use(
	koaBody({
		urlencoded: true,
		multipart: true
	})
);

app.use(ctx => {
	const { method } = ctx.request.query;

	switch (method) {
		case "allTickets":
			ctx.response.body = JSON.stringify(tickets);
			return;

		case "createTicket":
			const { id, title, description, status, created } = ctx.request.body;
			tickets.push({ id, title, description, status, created });
			ctx.response.body = JSON.stringify("OK");
			return;

		case "ticketById":
			ctx.response.body = JSON.stringify(tickets.find(({ id }) => ctx.request.query.id === id).description);
			return;

		case "deleteTicket":
			const deletedIndex = tickets.findIndex(({ id }) => ctx.request.query.id === id);
			tickets.splice(deletedIndex, 1);
			ctx.response.body = JSON.stringify(deletedIndex);
			return;

		case "editTicket":
			const editedIndex = tickets.findIndex(({ id }) => ctx.request.query.id === id);
			const ticketForEdit = tickets[editedIndex];
			ticketForEdit.title = ctx.request.body.title;
			ticketForEdit.description = ctx.request.body.description;
			ticketForEdit.title = ctx.request.body.title;
			ctx.response.body = JSON.stringify(editedIndex);
			return;

		case "checkTicket":
			const checkedIndex = tickets.findIndex(({ id }) => ctx.request.query.id === id);
			tickets[checkedIndex].status = ctx.request.body.status;
			ctx.response.body = JSON.stringify(checkedIndex);
			return;

		default:
			ctx.response.status = 404;
			return;
	}
});

const server = http.createServer(app.callback());

const port = 7070;

server.listen(port, err => {
	if (err) {
		console.log(err);
		return;
	}

	console.log("Server is listening to " + port);
})