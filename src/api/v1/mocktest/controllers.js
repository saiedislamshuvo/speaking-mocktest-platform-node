const mocktestService = require('../../../lib/mocktest');
const pagination = require('../../../config/pagination');
const { getPaginateQueryParams } = require('../../../core/utils/query');

const index = async (req, res, next) => {
    const { page, limit, orderBy, sortBy } = getPaginateQueryParams(req.query);
    const { userId, trainerId, organizationId } = req.query;
    try {
        const mocktests = await mocktestService.findAll({
            page,
            limit,
            orderBy,
            sortBy,
            userId,
            trainerId,
            organizationId
        });

        const total = await mocktestService.count({ userId, trainerId, organizationId });
        const paginate = pagination.getPaginate({
            total, limit, page, path: req.path, query: req.query,
        });

        return res.status(200).json({
            mocktests,
            ...paginate
        });
    } catch (e) {
        next(e);
    }
}

const store = async (req, res, next) => {
    const { meetingStartAt, trainerId, organizationId } = req.body;

    if (!meetingStartAt) {
        return res.status(400).json({
            success: false,
            message: 'Meeting start at time required',
        });
    }

    try {
        const mocktest = await mocktestService.createMocktest({
            meetingStartAt,
            userId: req.user.id,
            trainerId,
            organizationId,
        });

        return res.status(201).json({
            success: true,
            message: 'Mocktest Created Successfully',
            data: { ...mocktest },
        });
    } catch (e) {
        next(e);
    }
}

const findById = async (req, res, next) => {
    const id = req.params.id;

    try {
        const mocktest = await mocktestService.findOne(id);

        return res.status(200).json({
            success: true,
            data: mocktest
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    const id = req.params.id;
    const { status, feedback } = req.body;

    try {
        const mocktest = await mocktestService.updateStatus(id, { status, feedback });

        res.status(200).json({
            success: true,
            message: 'Mocktest status updated successfully',
            data: mocktest
        });
    } catch (e) {
        next(e);
    }
}

const deleteById = async (req, res, next) => {
    const id = req.params.id;

    try {
        await mocktestService.deleteById(id);
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
