import * as Joi from 'joi';

export const userSchema = Joi.object({
    login: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().pattern(/^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,}$/).required(),
    age: Joi.number().min(4).max(130).required(),
    isDeleted: Joi.boolean().required()
});
