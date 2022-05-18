import { InvalidFieldErrorResponse } from '../resources/Error';
import { ExtendedRequest, ExtendedResponse, FormErrors } from '../types';
import { AnyObjectSchema, ValidationError } from 'yup';
import { NextHandler } from 'next-connect';

const bodyValidation = (yupValidatorSchema: AnyObjectSchema, errorCode = 422) => {
	return async (req: ExtendedRequest, res: ExtendedResponse, next: NextHandler) => {
		if (!['PATCH', 'POST', 'PUT'].includes(req.method!)) {
			return next();
		}
		try {
			const data = await yupValidatorSchema.validate(req.body, { abortEarly: false });
			req.validatedData = data;
			next();
		} catch (error) {
			if (error instanceof ValidationError) {
				const formattedErrors = error.inner.reduce((errors: FormErrors, error) => {
					let { path, message } = error;
					if (path) {
						if (!errors.hasOwnProperty(path)) {
							errors[path] = [message];
						} else {
							errors[path].push(message);
						}
					}
					return errors;
				}, {});
				res.status(errorCode).json(new InvalidFieldErrorResponse(error.message, formattedErrors));
			}
		}
	};
};

export default bodyValidation;
