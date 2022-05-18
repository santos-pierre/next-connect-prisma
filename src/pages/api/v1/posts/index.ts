import nc from 'next-connect';
import type { ExtendedRequest, ExtendedResponse } from '../../../../interfaces';
import prisma from '../../../../lib/prisma';

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
	.get(async (_req, res) => {
		const posts = await prisma.post.findMany();
		return res.json({ datas: posts });
	})
	.post(async (req, res) => {
		const newPost = await prisma.post.create({ data: { ...req.body } });
		return res.status(201).json({ messsage: 'Post created !', status: 200, data: newPost });
	});

export default handler;
