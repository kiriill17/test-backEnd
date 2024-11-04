import PostModel from '../models/Post.js';
import { validationResult } from 'express-validator';

//Вывод всех постов
export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find();

    res.json(posts);
  } catch (err) {
    res.status(500).json({
      message: 'Ошибка получения постов',
    });
    console.log(err);
  }
};

//Создание поста
export const create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(403).json(errors.array());
    }

    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageURL: req.body.imageURL,
      user: req.userId,
    });

    const post = await doc.save();

    res.json({ ...post._doc });
  } catch (err) {
    res.status(500).json({
      message: 'Ошибка создания поста',
      err,
    });
  }
};

//Получение одной статьи
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { vievsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
    ).then((post) => {
      if (!post) {
        return res.status(404).json({
          message: 'статьтя не найдена',
        });
      }

      res.json(post);
    });
  } catch (err) {
    res.status(500).json({
      message: 'Ошибка получения постов',
    });
    console.log(err);
  }
};

//Удалить статью
export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete({
      _id: postId,
    }).then((doc) => {
      if (!doc) {
        return res.status(404).json({
          message: 'статьтя не найдена',
        });
      }

      res.json({
        message: 'Статья удалена',
      });
    });
  } catch (err) {
    res.status(500).json({
      message: 'Ошибка получения постов',
    });
    console.log(err);
  }
};

//Обновление статьи
export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageURL: req.body.imageURL,
      },
    );

    res.json({
      success: 'true',
    });
  } catch (err) {
    res.status(500).json({
      message: 'Ошибка обновления постов',
    });
    console.log(err);
  }
};
