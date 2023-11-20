const userService = require('../../../lib/user');
const pagination = require('../../../config/pagination');
const { validate } = require('./request');
const query = require('../../../core/utils/query');

const index = async (req, res, next) => {
    const { page, limit, orderBy, sortBy } = query.getPaginateQueryParams(req.query);
    const name = req.query.name || '';
    const email = req.query.email || '';

    try {
        const users = await userService.findAll({
            page,
            limit,
            orderBy,
            sortBy,
            name,
            email,
        });

        const data = query.getTransformedItems({
            items: users,
            selection: ['id', 'name', 'email', 'updatedAt', 'createdAt']
        });

        const total = await userService.count({ name, email });
        const paginate = pagination.getPaginate({
            total, limit, page, path: req.path, query: req.query,
        });

        return res.status(200).json({
            data,
            ...paginate
        });
    } catch (e) {
        next(e);
    }
}

const store = async (req, res, next) => {
    const result = validate(req.body);
    if (result.error != null) {
        const { details } = result.error;
        return res.status(400).send({
            success: false,
            message: "Bad Request",
            errors: details.map(e => ({ field: e.context.key, message: e.message }))
        });
    }

    const { name, email, password, role, status } = result.value;

    try {
        const user = await userService.create({
            name,
            email,
            password,
            role,
            status,
        });

        res.status(201).json({
            success: true,
            message: 'User Created Successfully',
            data: { ...user },
        });
    } catch (e) {
        next(e);
    }
}

const findById = async (req, res, next) => {
    const id = req.params.id;

    try {
        const user = await userService.findOne(id);

        const data = query.getTransformedItem({
            item: user,
            selection: ['id', 'name', 'email', 'updatedAt', 'createdAt']
        });

        return res.status(200).json({
            success: true,
            data: data
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    const id = req.params.id;
    const { name, email } = req.body;

    try {
        const user = await userService.update(id, { name, email });

        const data = query.getTransformedItem({
            item: user,
            selection: ['id', 'name', 'email', 'updatedAt', 'createdAt']
        });

        const response = {
            success: true,
            message: 'User updated successfully',
            data: data
        };

        res.status(200).json(response);
    } catch (e) {
        next(e);
    }
}

const patchById = async (req, res, next) => {
    const id = req.params.id;

    try {
        const user = await userService.updateProperties(id, req.body);

        const data = query.getTransformedItem({
            item: user,
            selection: ['id', 'name', 'email', 'updatedAt', 'createdAt']
        });

        const response = {
            success: true,
            message: 'User updated successfully',
            data: data
        };

        res.status(200).json(response);
    } catch (e) {
        next(e);
    }
}

const deleteById = async (req, res, next) => {
    const id = req.params.id;

    try {
        await userService.deleteById(id);
        res.status(204).end();
    } catch (e) {
        next(e);
    }
}

module.exports = {
    index,
    store,
    findById,
    update,
    patchById,
    deleteById,
}
