import nc from 'next-connect';
import type { ExtendedRequest, ExtendedResponse } from '../../../../interfaces';
import { posts } from '../../../../data/posts';

const handler = nc<ExtendedRequest, ExtendedResponse>({
	attachParams: true,
	onError: (err, req, res, next) => {
		console.error(err.stack);
		res.status(500).end('Something broke!');
	},
	onNoMatch: (req, res) => {
		res.status(404).end('Page is not found');
	},
})
	.get((_req, res) => {
		return res.json({ datas: posts });
	})
	.post((req, res) => {
		let lastId: number = posts[posts.length - 1].id;
		posts.push({ id: ++lastId, ...req.body });
		return res.status(201).json({ messsage: 'Post created !', status: 200 });
	});

export default handler;
