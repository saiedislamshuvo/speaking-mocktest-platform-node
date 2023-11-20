const { User } = require('../src/model');

const seedUser = () => {
    const user = new User({
        name: "test",
        email: "test@example.com",
        password: "test1234",
    });
    user.save();
}

module.exports = { seedUser };
