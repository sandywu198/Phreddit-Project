const express = require('express');
const router = express.Router();
const LinkFlair = require('../models/linkflairs');

//get all link flairs
router.get('/', async (req, res) => {
    try {
        const linkFlairs = await LinkFlair.find();
        res.send(linkFlairs);
    } 
    catch (error) {
        res.status(500).send({ message: 'Error getting linkflairs', error });
    }
});

//get a specific link flair
router.get('/:id', getLinkFlair, (req, res) => {
    res.send(res.linkFlair);
});

//create a new link flair
router.post('/', async (req, res) => {
    const linkFlair = new LinkFlair({
        content: req.body.content
    });
  
    try {
        const newLinkFlair = await linkFlair.save();
        res.status(201).send(newLinkFlair);
    } 
    catch (error) {
        res.status(400).send({ message: 'Error creating linkflair', error });
    }
});

//Middleware to get a link flair by ID
async function getLinkFlair(req, res, next) {
    try {
        const linkFlair = await LinkFlair.findById(req.params.id);
        if (linkFlair == null) {
            return res.status(404).send({ message: 'Link flair not found' });
        }
        res.linkFlair = linkFlair;
        next();
    } 
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

module.exports = router;