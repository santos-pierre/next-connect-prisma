import { Post } from '@prisma/client';
import Image from 'next/image';
import useSWR from 'swr';
import { fetcher } from '../../utils/fetcher';

const images = [
	'https://images.unsplash.com/photo-1547586696-ea22b4d4235d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
	'https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
	'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
];

type PostsData = {
	results: Post[];
	count: number;
	status: number;
};

const PostList = () => {
	const { data, error } = useSWR<PostsData>('/api/v1/posts', fetcher);

	if (error) return <div>failed to load</div>;

	if (!data) return <div>loading...</div>;

	return (
		<div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
			{data.results.map((post, index) => (
				<div key={post.title} className="flex flex-col overflow-hidden rounded-lg shadow-lg">
					<div className="flex-shrink-0">
						<div className="relative h-48 w-full">
							<Image
								src={images[Math.floor(Math.random() * 3)]}
								alt="Post Image"
								layout="fill"
								objectFit="cover"
							/>
						</div>
					</div>
					<div className="flex flex-1 flex-col justify-between bg-white p-6">
						<div className="flex-1">
							<a className="mt-2 block">
								<p className="text-xl font-semibold text-gray-900">{post.title}</p>
								<p className="mt-3 text-base text-gray-500 line-clamp-4">{post.content}</p>
							</a>
						</div>
						<div className="mt-6 flex items-center">
							<div className="ml-3">
								<p className="text-sm font-medium text-gray-900">
									<span className="hover:underline">{post.author}</span>
								</p>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default PostList;
