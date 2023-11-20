const tokenService = require('../lib/auth/token');
const userService = require('../lib/user');
const { authenticationError } = require('../core/utils/error');

const authenticate = async (req, _res, next) => {
	if (process.env.AUTH_MOCK || false) {
		const user = await userService.findUserByEmail('test@example.com');
		if (!user) {
			next(authenticationError());
		}
		req.user = { ...user._doc, id: user.id };
		return next();
	}

	try {
		const token = req.headers.authorization.split(' ')[1];
		const decoded = tokenService.verifyToken({ token });
		const user = await userService.findUserByEmail(decoded.email);

		if (!user) {
			return next(authenticationError());
		}

		if (user.status !== 'approved') {
			return next(authenticationError(`Your account is ${user.status}`));
		}

		next();
	} catch (e) {
		next(authenticationError());
	}
};

module.exports = authenticate;
