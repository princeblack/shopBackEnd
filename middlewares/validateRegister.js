const { check, validationResult } = require('express-validator');

export const validateRegister = [
    check('username').isLength({ min: 5 }).withMessage('Username must be at least 3 characters long'),
    check('email').isEmail().withMessage('Enter a valid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ];
