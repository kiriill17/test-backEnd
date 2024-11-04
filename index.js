import express from 'express';
import cors from 'cors';
import multer from 'multer'; //подгрузка картинок с бэка
import mongoose from 'mongoose';
import Post from './models/Post.js';
import { ExpressValidator } from 'express-validator';
import { validationResult } from 'express-validator';

import { registerValidation, loginValidation, postCreateValidation } from './validations/auth.js';

import UserModel from './models/User.js';
import checkAuth from './utils/checkAuth.js';

import { register, login, getMe } from './controllers/UserController.js';
import { create, getAll, getOne, remove, update } from './controllers/postController.js';

mongoose
  .connect(
    'mongodb+srv://admin:AZ19za91@clustertest.k6vsa.mongodb.net/blog?retryWrites=true&w=majority&appName=ClusterTest',
  )
  .then(() => {
    console.log('BD OK');
  })
  .catch((err) => {
    console.log('BD error ', err);
  });

const app = express();

//Хранилище:
const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

//Применение логики хранилища на Express:
const upload = multer({ storage });
app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(express.json());

//регистрация и авторизация:
app.post('/auth/login', loginValidation, login);
app.post('/auth/registration', registerValidation, register);
app.get('/auth/me', checkAuth, getMe);

//Роут картинок:
app.post('/uploads', upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

//Посты:
app.get('/posts', postCreateValidation, getAll);
app.get('/posts/:id', postCreateValidation, getOne);
app.post('/posts', postCreateValidation, create);
app.delete('/posts/:id', postCreateValidation, remove);
app.patch('/posts/:id', postCreateValidation, update);

app.listen(7777, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server work');
});
