const authService = require('../../../../lib/auth');

const login = async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const user = await authService.login({ email, password });
		const auth = await authService.attempt(user);

		return res.status(200).json({
			success: true,
			message: 'Login successful',
			data: { ...auth },
		});
	} catch (err) {
		next(err);
	}
}

module.exports = login;
