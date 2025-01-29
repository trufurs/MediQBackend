import { User } from '../models/user.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const register = asyncHandler(async (req, res) => {
    const { name, email, gender, password, phone } = req.body;
    if (!name || !email || !gender || !password || !phone) {
        console.log(req.body);
        throw new Error('SyntaxError');
    }
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

        throw new Error('MongoError');
    }
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.passwordHash)) {
        const token = jwt.sign(
            { id: user._id, name: user.name ,role: user.role, store_id: user.store_id},
            process.env.JWT_SECRET,
            {
                expiresIn: '30d',
            }
        );
        res.status(200).json({
            message: 'User Logged In',
            token,
        });
    } else {
        throw new Error('ValidationError');
    }
});

export { register ,login};