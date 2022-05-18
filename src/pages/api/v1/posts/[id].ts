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
	.get('/api/v1/posts/:id', async (req, res) => {
		const post = await prisma.post.findUnique({ where: { id: req.params.id } });

		if (!post) {
			return res.status(404).json({ message: 'Blog post not found', status: 404 });
		}

		return res.status(200).json({ data: post });
	})
	.put('/api/v1/posts/:id', async (req, res) => {
		const updatedPost = await prisma.post.update({ where: { id: req.params.id }, data: { ...req.body } });
		if (!updatedPost) {
			return res.status(404).json({ message: 'Blog post not found', status: 404 });
		}

		return res.status(200).json({ data: updatedPost });
	})
	.delete('/api/v1/posts/:id', async (req, res) => {
		await prisma.post.delete({ where: { id: req.params.id } });

		return res.status(204).end();
	});

export default handler;
