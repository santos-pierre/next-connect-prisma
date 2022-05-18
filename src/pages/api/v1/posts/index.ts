import nc from 'next-connect';
import type { ExtendedRequest, ExtendedResponse } from '../../../../types';
import prisma from '../../../../lib/prisma';
import bodyValidation from '../../../../middlewares/bodyValidation';
import { postValidator } from '../../../../validators/PostValidator';
import { Success, SuccessCollection } from '../../../../resources/Success';

const handler = nc<ExtendedRequest, ExtendedResponse>({
	attachParams: true,
	onError: (err, _req, res, next) => {
		console.error(err.stack);
		res.status(500).end('Something broke!');
	},
	onNoMatch: (_req, res) => {
		res.status(404).end('Page is not found');
	},
})
	.get(async (_req, res) => {
		const count = await prisma.post.count();
		const posts = await prisma.post.findMany();
		return res.status(200).json(new SuccessCollection(posts, count));
	})
	.post(bodyValidation(postValidator), async (req, res) => {
		const newPost = await prisma.post.create({ data: { ...req.validatedData } });
		return res.status(201).json(new Success(newPost, 201));
	});

export default handler;
