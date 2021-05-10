const db = require('../models');
const Tutorial = db.tutorials;

exports.create = (req, res) => {
    if (!req.body.title) {
        res.status(400).send({ message: "Content cannot be empty!" })
        return;
    }
    const tutorial = new Tutorial({
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    })
    tutorial
        .save(tutorial)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error while creating Tutorial."
            })
        })
}

exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    Tutorial.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error while retrieving tutorials."
            })
        })
}

exports.findOne = (req, res) => {
    const id = req.params.id;

    Tutorial.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "No tutorial with id " + id })
            else res.send(data)
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving tutorial " + id })
        })
}

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Update data cannot be empty!"
        })
    }

    const id = req.params.id;

    Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: "Cannot update Tutorial " + id
                })
            } else res.send({ message: `Tutorial ${id} updated successfully.` })
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating tutorial " + id
            })
        })
}

exports.delete = (req, res) => {
    const id = req.params.id;

    Tutorial.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: "Cannot delete tutorial " + id
                })
            } else {
                res.send({
                    message: `Tutorial ${id} deleted successfully.`
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: `Cannot delete tutorial ${id}`
            })
        })
}

exports.deleteAll = (req, res) => {
    Tutorial.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} tutorials deleted successfully.`
            })
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error while deleting tutorials."
            })            
        })
}

exports.findAllPublished = (req, res) => {
    Tutorial.find({ published: true })
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: 
                    err.message || "Error while retrieving tutorials."
            })
        })
}