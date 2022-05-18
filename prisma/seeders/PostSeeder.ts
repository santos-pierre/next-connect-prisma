import { Post } from '@prisma/client';
import prisma from '../../src/lib/prisma';
import { faker } from '@faker-js/faker';

const PostSeeder = async () => {
	const fakePosts: Omit<Post, 'id' | 'published'>[] = Array(5)
		.fill('')
		.map(() => {
			return {
				author: faker.name.findName(),
				content: faker.lorem.paragraphs(2),
				title: faker.lorem.words(3),
			};
		});

	try {
		await prisma.post.createMany({ data: fakePosts });
	} catch (error) {
		throw error;
	}
};

export default PostSeeder;
