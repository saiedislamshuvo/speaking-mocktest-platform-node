const authService = require('../../../../lib/auth');

const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const user = await authService.register({ name, email, password });
    const auth = await authService.attempt(user);

    return res.status(201).json({
      success: true,
      message: 'Register successful',
      data: { ...auth },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = register;
