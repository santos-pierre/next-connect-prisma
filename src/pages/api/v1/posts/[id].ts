import nc from 'next-connect';
import { posts } from '../../../../data/posts';
import type { ExtendedRequest, ExtendedResponse } from '../../../../interfaces';

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
	.get('/api/v1/posts/:id', (req, res) => {
		const post = posts.find((post) => post.id === +req.params.id);
		if (!post) {
			return res.status(404).json({ message: 'Blog post not found', status: 404 });
		}
		return res.json({ data: post });
	})
	.put('/api/v1/posts/:id', (req, res) => {
		const postIndex = posts.findIndex((post) => post.id === +req.params.id);
		if (postIndex === -1) {
			return res.status(404).json({ message: 'Blog post not found', status: 404 });
		}
		const postToUpdate = posts[postIndex];

		posts[postIndex] = { ...postToUpdate, ...req.body };

		return res.status(204).end();
	})
	.delete('/api/v1/posts/:id', (req, res) => {
		const postIndex = posts.findIndex((post) => post.id === +req.params.id);
		if (postIndex === -1) {
			return res.status(404).json({ message: 'Blog post not found', status: 404 });
		}
		posts.splice(postIndex, 1);

		return res.status(204).end();
	});

export default handler;
