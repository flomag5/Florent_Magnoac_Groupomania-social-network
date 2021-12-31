//--- Définition logique métier pour la ressource "post" ---//

// Importation 
const db = require("../models");
const Post = db.posts;
const Comment = db.comment;
const Op = db.Sequelize.Op;
const fs = require("fs");
const { posts } = require("../models");

// Routes CRUD pour les posts

// Créer nouveau post
exports.createPost = (req, res, next) => {

    // Création d'un post
    const post = {
        title: req.body.title,
        content: req.body.content,
        image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        userId: req.body.userId
    };
    // Sauvegarde post dans la database
    Post.create(post)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Une erreur est survenue lors de la création du post."
            });
        });
};


// Voir tous les posts
exports.getAllPosts = (req, res, next) => {
    Post.findAll({ include: ["comment"] })
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
};


// Trouver un seul post
exports.getOnePost = (req, res, next) => {
    Post.findOne({ where: { id: req.params.id } })
        .then(post => res.status(200).json(post))
        .catch(error => res.status(400).json({ error }))
};


// Modifier un post par l'Id de la requête
exports.modifyPost = (req, res, next) => {
    const id = req.params.id;
    Post.findOne({ where: { id: id } })
        .then(post => {
            if (req.userId == post.UserId) {
                const updatePost = {
                    title: req.body.title,
                    content: req.body.content
                }
                if (req.file) {
                    updatePost.image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                }
                Post.update(updatePost, { where: { id: id } })
                    .then(() => res.status(200).json({ message: 'Post modifié !' }))
                    .catch(error => res.status(400).json({ error }))
            } else {
                return res.status(403).json({
                    'error': 'UnAuthorize'
                });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};



// Supprimer un post 
exports.deletePost = (req, res, next) => {

    Post.findOne({
        where: {
            id: req.params.id,
        }
    })
        .then(post => {
            if (req.userId == post.UserId) {

                const filename = post.image.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Post.destroy({
                        where: {
                            id: req.params.id
                        }
                    }).then(() => res.status(200).json({
                        message: 'Post supprimé !'
                    }))
                        .catch(error => res.status(400).json({
                            error
                        }));
                });
            } else {
                res.status(403).json({
                    'error': 'UnAuthorize'
                })
            }
        })
        .catch(error => res.status(500).json({
            error
        }));
};
