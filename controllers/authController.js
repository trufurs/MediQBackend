import { User } from '../models/user.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const register = asyncHandler(async (req, res) => {
    const { username, email, password, profile } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({
        username,
        email,
        passwordHash: hashedPassword,
        profile
    });
    if (user) {
        res.status(201).json({
            message: `User Created ${user._id}`,
        });
    } else {
        res.status(400).json({
            message: 'Invalid User Data',
        });
    }
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.passwordHash)) {
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d',
            }
        );
        res.status(200).json({
            message: 'User Logged In',
            token,
        });
    } else {
        res.status(400).json({
            message: 'Invalid Email or Password',
        });
    }
});

export { register ,login};