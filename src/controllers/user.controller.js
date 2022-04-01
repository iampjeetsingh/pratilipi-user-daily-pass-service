const User = require('../models/user');
const {attachBigPromise} = require('../lib/big-promise')

const createUser = async (req, res) => {
    let user = new User(req.body);
    user = await user.save();

    return res.json({
        name: user.name,
        email: user.email,
        _id: user._id,
        role: user.role
    });
}

const getAllUsers = async (req, res) => {
    let users = await User.find({}).select("_id name email role")

    return res.json(users)
}

const UserController = {
    createUser,
    getAllUsers
};
attachBigPromise(UserController);
module.exports = UserController;