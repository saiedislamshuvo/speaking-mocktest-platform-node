const orgService = require('../../../lib/organization');
const trainerService = require('../../../lib/trainer');
const pagination = require('../../../config/pagination');
const { validate } = require('./request');
const { getPaginateQueryParams, getTransformedItems } = require('../../../core/utils/query');

const index = async (req, res, next) => {
    const { page, limit, orderBy, sortBy } = getPaginateQueryParams(req.query);
    try {
        const organizations = await orgService.findAll({
            page,
            limit,
            orderBy,
            sortBy,
        });

        const data = getTransformedItems({
            items: organizations,
            selection: ['id', 'name', 'email', 'createdBy', 'updatedAt', 'createdAt']
        });

        const total = await orgService.count();
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

    const { name, email, status } = result.value;

    try {
        const org = await orgService.createOrg({
            name,
            email,
            status,
            createdBy: req.user,
        });

        console.log(org)

        return res.status(201).json({
            success: true,
            message: 'Organization Created Successfully',
            data: { ...org }
        });
    } catch (e) {
        next(e);
    }
}

const findById = async (req, res, next) => {
    const id = req.params.id;

    try {
        const org = await orgService.findOne(id);

        return res.status(200).json({
            success: true,
            data: org
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    const id = req.params.id;
    const { name, email, status } = req.body;

    try {
        const { organization, code } = await orgService.updateOrCreate(id, {
            name, email, status
        });

        const response = {
            success: true,
            message: code === 200
                ? 'Organization updated successfully'
                : 'Organization created successfully',
            data: organization
        };

        res.status(code).json(response);
    } catch (e) {
        next(e);
    }
}

const patchById = async (req, res, next) => {
    const id = req.params.id;

    try {
        const organization = await orgService.updateProperties(id, req.body);

        const response = {
            success: true,
            message: 'Organization updated successfully',
            data: organization
        };

        res.status(200).json(response);
    } catch (e) {
        next(e);
    }
}

const deleteById = async (req, res, next) => {
    const id = req.params.id;

    try {
        await orgService.deleteById(id);
        res.status(204).end();
    } catch (e) {
        next(e);
    }
}

const getTrainer = async (req, res, next) => {
    const id = req.params.id;

    try {
        const trainers = await trainerService.findTrainersByOrgId(id);

        return res.status(200).json({
            trainers
        });
    } catch (e) {
        next(e);
    }
}

const createTrainer = async (req, res, next) => {
    const organization = req.params.id;
    const { user } = req.body;

    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'User required',
        });
    }

    try {
        const trainer = await trainerService.createTrainer({
            user: user,
            organization: organization,
            status: status || 'approved',
        });

        return res.status(201).json({
            success: true,
            message: 'Trainer Created Successfully',
            data: trainer,
        });
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
    getTrainer,
    createTrainer,
}
