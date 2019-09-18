const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Hub = require('../models/Hub');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


// GET all
router.get('/', (req, res) => {
    Hub.findAll({ order: [['id', 'DESC']] })
        .then(hubs => {
            res.render('hubs', { hubs });
        })
        .catch(err => console.log('ERROR: ' + err))
});

//GET ADD FORM
router.get('/add', (req, res) => res.render('add'));


// POST data
// Add a hub
router.post('/add', (req, res) => {
    let { title, technologies, description, budget, contact_email } = req.body;
    let errors = [];

    if (!title) {
        errors.push({ text: 'Please enter a title' });
    }

    if (!technologies) {
        errors.push({ text: 'Please enter a technologies' });
    }

    if (!description) {
        errors.push({ text: 'Please enter a description' });
    }

    if (!budget) {
        errors.push({ text: 'Please enter a budget' });
    }

    if (!contact_email) {
        errors.push({ text: 'Please enter a contact_email' });
    }

    if (errors.length > 0) {
        res.render('add', {
            errors,
            title,
            technologies,
            description,
            budget,
            contact_email
        })
    } else {
        if (!budget) {
            budget = 'Unknown';
        } else {
            budget = `$${budget}`;
        }

        technologies = technologies.toLowerCase().replace(/, /g, ',');

        //Insert into PG table
        Hub.create({
            title,
            technologies,
            budget,
            description,
            contact_email
        })
            .then(hub => res.redirect('/hubs'))
            .catch(err => console.error(err))
    }
});


// GET SEARCH
router.get('/search', (req, res) => {
    let { term } = req.query;

    term = term.toLowerCase();

    Hub.findAll({ where: { technologies: { [Op.like]: '%' + term + '%' } } })
        .then(hubs => res.render('hubs', { hubs }))
        .catch(err => console.log(err));
});

// GET update
router.get('/update/:id', (req, res) => {
    Hub.findByPk(req.params.id)
        .then(hub => res.render('hub', { hub }))
        .catch(err => console.log(err))
});

// PUT/UPDATE hub by id
router.post('/update/:id', (req, res) => {
    Hub.findOne({ where: { id: req.params.id } })
        .then(hub => {
            let success = [];

            hub.title = req.body.title;
            hub.technologies = req.body.technologies;
            hub.budget = req.body.budget;
            hub.description = req.body.description;
            hub.contact_email = req.body.contact_email;

            hub.save().then(updateHub => {
                console.log('Updated Successfully');
                res.redirect('/hubs')
            });

        })
        .catch(err => console.log(err));
});


// DELETE hub
router.delete('/delete/:id', (req, res) => {
    Hub.findByPk(req.params.id)
        .then(hub => {
            hub.destroy().then(deleteHub => {
                console.log('Deleted Successfully');
                res.redirect('/hubs');
            })
        })
        .catch(err => console.log(err));
});



module.exports = router;