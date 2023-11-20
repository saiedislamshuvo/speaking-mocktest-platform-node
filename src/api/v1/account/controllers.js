const trainerService = require('../../../lib/trainer');
const mocktestService = require('../../../lib/mocktest');

const requestToBecomeTrainer = async (req, res, next) => {
    try {
        await trainerService.createTrainer({
            user: req.user,
        });

        res.status(201).json({
            success: true,
            message: 'Request Submitted Successfully',
        });
    } catch (e) {
        next(e);
    }
}

const myMocktests = async (req, res, next) => {
    try {
        const mocktests = await mocktestService.findAll({
            userId: req.user.id,
        });

        return res.status(201).json({
            success: true,
            data: mocktests
        });
    } catch (e) {
        next(e);
    }
}

module.exports = {
    requestToBecomeTrainer,
    myMocktests,
}
