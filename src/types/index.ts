import type { NextApiRequest, NextApiResponse } from 'next';

export interface ExtendedRequest extends NextApiRequest {
	params: any;
	validatedData: any;
}
export interface ExtendedResponse extends NextApiResponse {}

export type Post = {
	id: number;
	title: string;
	content: string;
	author: string;
};

export type FormErrors = {
	[key: string]: string[];
};
