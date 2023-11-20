const userService = require('../../../lib/user');
const trainerService = require('../../../lib/trainer');
const pagination = require('../../../config/pagination');
const { getPaginateQueryParams } = require('../../../core/utils/query');

const index = async (req, res, next) => {
    const { page, limit, orderBy, sortBy } = getPaginateQueryParams(req.query);

    try {
        const trainers = await trainerService.findAll({
            page,
            limit,
            orderBy,
            sortBy,
        });

        const total = await trainerService.count();
        const paginate = pagination.getPaginate({
            total, limit, page, path: req.path, query: req.query,
        });

        return res.status(200).json({
            trainers,
            ...paginate
        });
    } catch (e) {
        next(e);
    }
}

const store = async (req, res, next) => {
    const { user, organization, status } = req.body;

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

const findById = async (req, res, next) => {
    const id = req.params.id;

    try {
        const trainer = await trainerService.findOne(id);

        return res.status(200).json({
            success: true,
            data: trainer
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    const id = req.params.id;

    try {
        const trainer = await trainerService.updateProperties(id, req.body);

        res.status(200).json({
            success: true,
            message: 'Trainer updated successfully',
            data: trainer
        });
    } catch (e) {
        next(e);
    }
}

const deleteById = async (req, res, next) => {
    const id = req.params.id;

    try {
        await trainerService.deleteById(id);
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
    deleteById,
}
