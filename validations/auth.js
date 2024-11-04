import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Слишком короткий пароль').isLength({ min: 5 }),
];

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Слишком короткий пароль').isLength({ min: 5 }),
  body('fullName', 'Слишеом короткое имя').isLength({ min: 3 }),
  body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
];

export const postCreateValidation = [
  body('title', 'Слишком короткий заголовок').isLength({ min: 2 }),
  body('text', 'Слишком короткий пароль').isLength({ min: 5 }).isString(),
  body('imagerUrl', 'Неверная ссылка на картинку').optional().isString(),
];
