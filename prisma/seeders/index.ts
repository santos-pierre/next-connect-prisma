import prisma from '../../src/lib/prisma';
import PostSeeder from './PostSeeder';

const main = async () => {
	await PostSeeder();
};

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
