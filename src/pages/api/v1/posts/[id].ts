import nc from 'next-connect';
import type { ExtendedRequest, ExtendedResponse } from '../../../../types';
import prisma from '../../../../lib/prisma';
import bodyValidation from '../../../../middlewares/bodyValidation';
import { postValidator } from '../../../../validators/PostValidator';
import { NotFoundErrorResponse } from '../../../../resources/Error';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Success } from '../../../../resources/Success';

const handler = nc<ExtendedRequest, ExtendedResponse>({
	attachParams: true,
	onError: (err, _req, res, next) => {
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
			return res.status(404).json(new NotFoundErrorResponse('Blog post not found'));
		}

		return res.status(200).json(new Success(post));
	})
	.put('/api/v1/posts/:id', bodyValidation(postValidator), async (req, res) => {
		try {
			const updatedPost = await prisma.post.update({
				where: { id: req.params.id },
				data: { ...req.body },
			});

			return res.status(200).json(new Success(updatedPost));
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					return res.status(404).json(new NotFoundErrorResponse());
				}
			}

			return res.status(500).end('Craqué');
		}
	})
	.delete('/api/v1/posts/:id', async (req, res) => {
		await prisma.post.delete({ where: { id: req.params.id } });

		return res.status(204).end();
	});

export default handler;
