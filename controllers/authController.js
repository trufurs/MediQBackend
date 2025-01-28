import { User } from '../models/user.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const register = asyncHandler(async (req, res) => {
    const { name, email, gender, password, phone } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({
        name,
        email,
        gender,
        passwordHash: hashedPassword,
        phone
    });
    const check = await user.save();
    if (check) {
        res.status(201).json({
            message: `User Created ${user._id}`,
        });
    } else {
        res.status(404);
        throw new Error('User Not Found');
    }
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.passwordHash)) {
        const token = jwt.sign(
            { id: user._id, username: user.username ,type: user.type},
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
        res.status(400);
        throw new Error('Invalid Credentials');
    }
});

export { register ,login};