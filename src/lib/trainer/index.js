
const Trainer = require('../../model/Trainer');
const pagination = require('../../config/pagination');
const { badRequest, notFound } = require('../../core/utils/error');

const findAll = async ({
    page = pagination.page,
    limit = pagination.limit,
    orderBy = pagination.orderBy,
    sortBy = pagination.sortBy,
}) => {
    const sortStr = `${orderBy === 'dsc' ? '-' : ''}${sortBy}`;

    const users = await Trainer.find()
        .populate('user', ['name', 'email'])
        .sort(sortStr)
        .skip(page * limit - limit)
        .limit(limit);

    return users.map((user) => ({
        ...user._doc,
        id: user.id,
    }));
}

const findTrainerByUserId = async (userId) => {
    const trainer = await Trainer.findOne({ user: userId });
    return trainer ? trainer : false;
}

const findTrainersByOrgId = async (id) => {
    const trainers = await Trainer.find({ organization: id });
    return trainers;
}

const createTrainer = async ({ user, organization, status = 'pending' }) => {
    if (!user) throw badRequest('Invalid parameters');
    if (await findTrainerByUserId(user)) {
        throw badRequest('Already trainer exist');
    }

    const trainer = new Trainer({ user, organization, status });
    await trainer.save();

    return { ...trainer._doc, id: trainer.id };
}

const findOne = async (id) => {
    if (!id) throw badRequest('Id is required');

    const trainer = await Trainer.findById(id).populate({
        path: 'user',
        select: ['name', 'email'],
        strictPopulate: false,
    });

    if (!trainer) {
        throw notFound();
    }

    return {
        ...trainer._doc,
        id: trainer.id,
    };
}

const updateProperties = async (id, { organization, status }) => {
    const trainer = await Trainer.findById(id);
    if (!trainer) {
        throw notFound();
    }

    const payload = { organization, status };

    Object.keys(payload).forEach((key) => {
        trainer[key] = payload[key] ?? trainer[key];
    });

    await trainer.save();
    return { ...trainer._doc, id: trainer.id };
}

const updateTrainerByUserId = async (userId, { organization, status }) => {
    const trainer = await findTrainerByUserId(userId);
    if (!trainer) {
        throw notFound();
    }

    const payload = { organization, status };

    Object.keys(payload).forEach((key) => {
        trainer[key] = payload[key] ?? trainer[key];
    });

    await trainer.save();
    return { ...trainer._doc, id: trainer.id };
}

const deleteById = async (id) => {
    const trainer = await Trainer.findById(id);
    if (!trainer) {
        throw notFound();
    }

    return Trainer.findByIdAndDelete(id);
}

const count = async () => {
    return Trainer.count();
}

module.exports = {
    findAll,
    findTrainerByUserId,
    createTrainer,
    findOne,
    updateProperties,
    updateTrainerByUserId,
    findTrainersByOrgId,
    deleteById,
    count,
}
