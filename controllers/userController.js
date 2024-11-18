import {User} from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

const createUser = asyncHandler(async (req, res) => {
    const user = new User({
        username: 'Sample username',
        email: '1@gmail.com',
        passwordHash: 'Sample password hash',
        profile: {
            firstName: 'Sample first name',
            lastName: 'Sample last name',
            dateOfBirth: new Date
        }
    });
    const createdUser = await user.save();
    res.status(201).json(createdUser);
});

const getUser = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

const updateUser = asyncHandler(async (req, res) => {
    const { username, email, passwordHash, profile } = req.body;
    const user = await User.findById(req.params.id);
    if (user) {
        user.username = username;
        user.email = email;
        user.passwordHash = passwordHash;
        user.profile = profile;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        await user.remove();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

module.exports = { createUser, getUser, getUserById, updateUser, deleteUser };