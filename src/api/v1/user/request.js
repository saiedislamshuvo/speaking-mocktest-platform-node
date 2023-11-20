const Joi = require("joi");

const schema = Joi.object().keys({
    name: Joi.string().min(1).max(30).required(),
    email: Joi.string().min(1).max(30).email().required(),
    password: Joi.string().min(8).max(30).required(),
    role: Joi.string().valid('user', 'trainer', 'admin'),
    status: Joi.string().valid('pending', 'approved', 'declined', 'blocked'),
});

const validate = (data) => {
    const result = schema.validate(data);
    result.value = data;
    return result;
};

module.exports = { validate };