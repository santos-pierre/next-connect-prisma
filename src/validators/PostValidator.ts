import * as yup from 'yup';

export const postValidator = yup.object().shape({
	title: yup.string().trim().required().min(3).max(255),
	content: yup.string().trim().min(10).max(1_000),
	author: yup.string().trim().required().min(2).max(64),
});
