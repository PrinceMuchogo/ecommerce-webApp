import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js';

// login user/ set token
// route POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });


    if (user && (await user.matchPassword(password))) {

        generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            firstname: user.firstname,
            surname: user.surname,
            email: user.email,
            password: user.password
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }

});

// Register new user
// route POST /api/users/signup
const registerUser = asyncHandler(async (req, res) => {
    const { firstname, surname,email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    };

    const user = await User.create({
        firstname,
        surname,
        email,
        password
    });

    if (user) {

        generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            firstname: user.firstname,
            surname: user.surname,
            email: user.email,
            password: user.password
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }

});

// logout user/ set token
// route POST /api/users/logout
const logoutUser = asyncHandler(async (req, res) => {

    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })

    res.status(200).json({
        message: 'User Logged Out'
    });
});

// Get user profile
// route GET /api/users/profile
// access  Private
const getUserProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(401);
        throw new Error('User not found')
    }

    const userProfile = {
        firstname: user.firstname,
        surname: user.surname,
        email: user.email,
        address: user.address,
        country: user.country,
        phoneNumber: user.phoneNmber
    }

    res.status(201).json({
        userProfile
    })




    /*const user = {
        _id: req.user._id,
        firstname: req.user.firstname,
        surname: req.user.surname,
        email: req.user.email
    }
    res.status(200).json(
        user
    );
    */
});

// Update user profile
// route PUT /api/users/profile
// access Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.firstname = req.body.firstname || user.firstname;
        user.surname = req.body.surname || user.surname;
        user.email = req.body.email || user.email;
        user.address = req.body.address || user.address;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        user.country = req.body.country || user.country;


        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            //_id: updatedUser._id,
            firstname: updatedUser.firstname,
            surname: updatedUser.surname,
            email: updatedUser.email,
            address: updatedUser.address,
            phoneNumber: updatedUser.phoneNumber,
            country: updatedUser.country
        })
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


export {
    loginUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
};