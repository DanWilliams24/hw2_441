const db = require("../models");
const GameScores = db.gamescores;
const Op = db.Sequelize.Op;

// Create and Save a new Person
exports.create = (req, res) => {
  // determine if request is valid
  if (!req.body.title) {
    res.status(400).send({
      message: "Need id to add to database!"
    });
    return;
  }

  // Create a GameScore
  const gamescore = {
    id: req.body.id,
    name: req.body.name,
    points: req.body.points ? req.body.points : 0
  };

  // Save GameScore in the database
  GameScores.create(gamescore)
    .then(data => {
        res.render('home.pug', {result: data, form_action: '/'})
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the leaderboard."
      });
    });
};

// Retrieve all GameScores from the database.
exports.findAll = (req, res) => {
    const id = req.query.id;
    var condition = id ? { id: { [Op.eq]: `%${id}%` } } : null;
  
    GameScores.findAll({ where: condition })
      .then(data => {
        res.render('home.pug', {result: data, form_action: '/'})
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      });
  };

  exports.findOne = (req, res) => {
    const id = req.params.id;
  
    GameScores.findByPk(id)
      .then(data => {
        res.render('home.pug', {result: data, form_action: '/'})
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving GameScore with id=" + id
        });
      });
  };


// Delete a GameScore with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    GameScores.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "GameScore was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete GameScore with id=${id}. GameScore was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete GameScore with id=" + id
        });
      });
  };

// Delete all GameScores from the database.
exports.deleteAll = (req, res) => {
    GameScores.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} GameScores deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred during removal all GameScores."
        });
      });
  };

