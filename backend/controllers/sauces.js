const Sauces = require('../models/sauces');
const fs = require('fs');

exports.createThing = (req, res, next) => {
    console.log('req.body.sauces');
    console.log(req.body.sauce);
    const saucesObject = JSON.parse(req.body.sauce);
    delete saucesObject._id;
    const sauces = new Sauces({
        ...saucesObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauces.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};


exports.getOneThing = (req, res, next) => {
    Sauces.findOne({
        _id: req.params.id
    }).then(
        (sauces) => {
            console.log('sauce');
            console.log(sauces);
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.modifyThing = (req, res, next) => {
    const saucesObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };
    Sauces.updateOne({ _id: req.params.id }, {...saucesObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then(sauces => {
            const filename = sauces.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                sauces.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getAllStuff = (req, res, next) => {
    Sauces.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });

        }
    );
};

exports.likedAndDislike = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id }).then((sauces) => {
        let message;
        //si l'utilsateur like la sauce
        if (req.body.like === 1 && !sauces.usersLiked.includes(req.body.userId)) {
            sauces.usersLiked.push(req.body.userId);
            sauces.likes++;
            message = "l'utilisateur aime la sauce !"
        }

        // si l'utilisateur n'aime la sauce 
        if (req.body.like === -1 && !sauces.usersLiked.includes(req.body.userId)) {
            sauces.usersDisliked.push(req.body.userId);
            sauces.dislikes++;
            message = "l'utilisateur n'aime pas la sauce !";
        }

        //si l'utiisateur change d'avis 
        if (req.body.like === 0) {
            if (sauces.usersLiked.includes(req.body.userId)) {
                sauces.usersLiked.pull(req.body.userId);
                sauces.likes--;
                message = "l'utilisateur à retiré son like !";
            } else if (sauces.usersDisliked.includes(req.body.userId)) {
                sauces.usersDisliked.pull(req.body.userId);
                sauces.dislikes--;
                message = "l'utilisateur à retiré son dislike !"
            }
        }
        sauces.save()
            .then(() => res.status(200).json({ message: message }))
            .catch((error) => res.status(500).json({ error }))
    });
}