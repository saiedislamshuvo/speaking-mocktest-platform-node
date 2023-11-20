const { Organization } = require('../../model');
const pagination = require('../../config/pagination');
const { notFound, badRequest } = require('../../core/utils/error');

const findAll = async ({
    page = pagination.page,
    limit = pagination.limit,
    orderBy = pagination.orderBy,
    sortBy = pagination.sortBy,
}) => {
    const sortStr = `${orderBy === 'dsc' ? '-' : ''}${sortBy}`;

    const organizations = await Organization.find()
        .populate({ path: 'createdBy', select: ['name', 'email'] })
        .sort(sortStr)
        .skip(page * limit - limit)
        .limit(limit);

    return organizations.map((organization) => ({
        ...organization._doc,
        id: organization.id,
    }));

};

const createOrg = async ({
    name,
    email,
    status = 'pending',
    createdBy,
}) => {
    if (!name || !email || !createdBy) {
        throw badRequest('Invalid parameters');
    }

    const payload = {
        name,
        email,
        status,
        createdBy: createdBy.id,
    };

    const org = new Organization(payload);
    await org.save();

    return {
        ...org._doc,
        id: org.id,
    };
};

const findOne = async (id) => {
    if (!id) throw badRequest('Id is required');

    const organization = await Organization.findById(id).populate({
        path: 'createdBy',
        select: ['name', 'email'],
        strictPopulate: false,
    });

    if (!organization) {
        throw notFound();
    }

    return {
        ...organization._doc,
        id: organization.id,
    };
}

const updateOrCreate = async (
    id,
    { name, email, status = 'pending' }
) => {
    const payload = {
        name,
        email,
        status,
    };

    const organization = await Organization.findById(id);

    if (!organization) {
        const org = await createOrg(payload);
        return {
            organization: org,
            code: 201,
        };
    }

    organization.overwrite(payload);
    await organization.save();

    return { organization: { ...organization._doc, id: organization.id }, code: 200 };
};

const updateProperties = async (id, { name, email, status }) => {
    const organization = await Organization.findById(id);
    if (!organization) {
        throw notFound();
    }

    const payload = { name, email, status };

    Object.keys(payload).forEach((key) => {
        organization[key] = payload[key] ?? organization[key];
    });

    await organization.save();
    return { ...organization._doc, id: organization.id };
};

const deleteById = async (id) => {
    const org = await Organization.findById(id);
    if (!org) {
        throw notFound();
    }

    return Organization.findByIdAndDelete(id);
}

const count = () => {
    return Organization.count();
};


module.exports = {
    findAll,
    createOrg,
    findOne,
    updateOrCreate,
    updateProperties,
    deleteById,
    count,
};
