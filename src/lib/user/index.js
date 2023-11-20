const User = require('../../model/User');
const pagination = require('../../config/pagination');
const { badRequest, notFound } = require('../../core/utils/error');

const findAll = async ({
  page = pagination.page,
  limit = pagination.limit,
  orderBy = pagination.orderBy,
  sortBy = pagination.sortBy,
  name = '',
  email = '',
}) => {
  const sortStr = `${orderBy === 'dsc' ? '-' : ''}${sortBy}`;
  const filter = {
    name: { $regex: name, $options: 'i' },
    email: { $regex: email, $options: 'i' },
  };

  const users = await User.find(filter)
    .sort(sortStr)
    .skip(page * limit - limit)
    .limit(limit);

  return users.map((user) => ({
    ...user._doc,
    id: user.id,
  }));
};

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user ? user : false;
};

const userExist = async (email) => {
  const user = await findUserByEmail(email);
  return user ? true : false;
};

const create = async ({ name, email, password, role = 'user', status = 'approved' }) => {
  if (!name || !email || !password) throw badRequest('Invalid parameters');

  const user = new User({ name, email, password, role, status });
  await user.save();


  delete user._doc['password'];

  return {
    name: user._doc.name,
    email: user._doc.email,
    role: user._doc.role,
    status: user._doc.status,
    createdAt: user._doc.createdAt,
    updatedAt: user._doc.updatedAt,
    id: user.id
  };
};

const findOne = async (id) => {
  if (!id) throw badRequest('Id is required');

  const user = await User.findById(id).populate({
    path: 'createdBy',
    select: ['name', 'email'],
    strictPopulate: false,
  });

  if (!user) {
    throw notFound();
  }

  return {
    ...user._doc,
    id: user.id,
  };
}

const update = async (
  id,
  { name, email }
) => {
  const payload = {
    name,
    email,
  };

  const user = await User.findById(id);

  if (!user) {
    throw notFound();
  }

  user.overwrite(payload);
  await user.save();

  return { ...user._doc, id: user.id };
};

const updateProperties = async (id, { name, email, role, status }) => {
  const user = await User.findById(id);
  if (!user) {
    throw notFound();
  }

  const payload = { name, email, role, status };

  Object.keys(payload).forEach((key) => {
    user[key] = payload[key] ?? user[key];
  });

  await user.save();
  return { ...user._doc, id: user.id };
};

const deleteById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw notFound();
  }

  return User.findByIdAndDelete(id);
}

const count = async ({ name = '', email = '' }) => {
  const filter = {
    name: { $regex: name, $options: 'i' },
    email: { $regex: email, $options: 'i' },
  };

  return User.count(filter);
};

module.exports = {
  findAll,
  findUserByEmail,
  userExist,
  create,
  findOne,
  update,
  updateProperties,
  deleteById,
  count,
};
