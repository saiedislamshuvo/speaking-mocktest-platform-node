const { userExist, create: createUser, findUserByEmail } = require('../user');
const { generateHash, hashMatched } = require('../../core/utils/hashing');
const { generateToken } = require('./token');
const { badRequest } = require('../../core/utils/error');

const register = async ({ name, email, password }) => {
  const hasUser = await userExist(email);
  if (hasUser) {
    throw badRequest('User already exist');
  }

  password = await generateHash(password);

  return await createUser({ name, email, password });
};

const login = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw badRequest('Invalid Credentials');
  }

  const matched = await hashMatched(password, user.password);
  if (!matched) {
    throw badRequest('Invalid Credentials');
  }

  return user;
};

const attempt = async (user) => {
  if (!user) {
    throw badRequest('Invalid Credentials');
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken({ payload });

  return {
    ...payload,
    access_token: accessToken,
  }
}

module.exports = {
  register,
  login,
  attempt,
};
