const Joi = require("joi");

const schema = Joi.object().keys({
    name: Joi.string().min(1).max(30).required(),
    email: Joi.string().min(1).max(30).email().required(),
});

const validate = (data) => {
    const result = schema.validate(data);
    result.value = data;
    return result;
};

module.exports = { validate };