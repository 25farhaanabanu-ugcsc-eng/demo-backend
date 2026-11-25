
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
    try {
        const {
            FullName,
            emailAddress,
            password,
            confirmPassword,
            termsAccepted
        } = req.body;

        // Check all fields
        if (!FullName || !emailAddress || !password || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Terms validation
        if (termsAccepted !== true) {
            return res.status(400).json({
                message: "Please accept Terms & Conditions"
            });
        }

        // Password validation
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        // Confirm password
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }

        // Check existing email
        const email = emailAddress.toLowerCase().trim();

        const existingUser = await User.findOne({
            emailAddress: email
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            FullName: FullName.trim(),
            emailAddress: email,
            password: hashedPassword
        });

        // Success response
        res.status(201).json({
            message: "Registration successful",
            user: {
                id: newUser._id,
                FullName: newUser.FullName,
                emailAddress: newUser.emailAddress
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
};


// LOGIN
exports.login = async (req, res) => {
    try {
        const { emailAddress, password } = req.body;

        if (!emailAddress || !password) {
            return res.status(400).json({
                message: "Email and password required"
            });
        }

        // Find user
        const user = await User.findOne({
            emailAddress: emailAddress.toLowerCase().trim()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }
        );

        // Login response
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                FullName: user.FullName,
                emailAddress: user.emailAddress,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};
