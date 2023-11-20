const { Mocktest } = require('../../model');
const pagination = require('../../config/pagination');
const { notFound, badRequest } = require('../../core/utils/error');
const orgService = require('../organization');
const trainerService = require('../trainer');

const findAll = async ({
    page = pagination.page,
    limit = pagination.limit,
    orderBy = pagination.orderBy,
    sortBy = pagination.sortBy,
    userId,
    trainerId,
    organizationId
}) => {
    const sortStr = `${orderBy === 'dsc' ? '-' : ''}${sortBy}`;
    const filter = {
        user: userId,
        trainer: trainerId,
        organization: organizationId,
    };

    const mocktests = await Mocktest.find()
        .sort(sortStr)
        .skip(page * limit - limit)
        .limit(limit)
        .populate('user')
        .populate('trainer')
        .populate('organization');

    return mocktests.map((mocktest) => ({
        ...mocktest._doc,
        id: mocktest.id,
    }));

};

const createMocktest = async ({
    meetingStartAt, userId, trainerId, organizationId, status = 'pending'
}) => {
    if (!userId || !meetingStartAt) {
        throw badRequest('Invalid parameters');
    }

    let mocktestAssignTo = 'trainer';
    if (organizationId) {
        const assignedToOrganization = await orgService.findOne(organizationId);
        mocktestAssignTo = 'organization';
        if (!assignedToOrganization) {
            throw badRequest('Organization not found');
        }
    } else {
        if (!trainerId) {
            throw badRequest('Either organization or trainer is required');
        }

        const assignedToTrainer = await trainerService.findOne(trainerId);
        if (!assignedToTrainer) {
            throw badRequest('Trainer not found');
        }
    }

    const payload = {
        meetingStartAt,
        user: userId,
        mocktestAssignTo,
        trainer: trainerId,
        organization: organizationId,
        status
    };

    const mocktest = new Mocktest(payload);
    await mocktest.save();

    return {
        ...mocktest._doc,
        id: mocktest.id,
    };
}

const findOne = async (id) => {
    if (!id) throw badRequest('Id is required');

    const mocktest = await Mocktest.findById(id)
        .populate('user')
        .populate('trainer')
        .populate('organization');

    if (!mocktest) {
        throw notFound();
    }

    return {
        ...mocktest._doc,
        id: mocktest.id,
    };
}

const updateStatus = async (id, { status, feedback }) => {
    const mocktest = await Mocktest.findById(id);
    if (!mocktest) {
        throw notFound();
    }

    mocktest.status = status;

    if (status == 'approved' && !mocktest.meetingLink) {
        // TODO: generate meeting link
    }

    if (status == 'completed') {
        mocktest.feedback = feedback || mocktest.feedback;
    }

    await mocktest.save();
    return { ...mocktest._doc, id: mocktest.id };
};

const deleteById = async (id) => {
    const doc = await Mocktest.findById(id);
    if (!doc) {
        throw notFound();
    }

    return Mocktest.findByIdAndDelete(id);
}

const count = ({ userId, trainerId, organizationId }) => {
    const filter = {
        user: userId,
        trainer: trainerId,
        organization: organizationId,
    };

    return Mocktest.count();
};

module.exports = {
    findAll,
    createMocktest,
    findOne,
    updateStatus,
    deleteById,
    count,
};
