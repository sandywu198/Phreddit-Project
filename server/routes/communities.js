const express = require('express');
const router = express.Router();
const Community = require('../models/communities');
console.log('Community routes loaded');
// Get all communities
router.get('/', async (req, res) => {
    try{
        const communities = await Community.find();
        res.send(communities);
    }
    catch(error){
        res.status(500).send({message: "Error retrieving communities", error});
    }
});

// Get a specific community by ID
router.get('/:id', getCommunity, (req, res) => {
    res.send(res.community);
});

// Add post to community
router.put('/:id', async (req, res) => {
    console.log('PUT request received for community update');
    try {
        const communityId = req.params.id;
        const postID = req.body.postID;
        console.log('Community ID:', req.params.id);
        const community = await Community.findOneAndUpdate(
            { _id: communityId },
            { $push: { postIDs: postID } },
            { new: true }
          );
        res.status(200).send(community);
    } catch (error) {
        console.error('Error in PUT route:', error);
        res.status(400).send({ message: "Error updating community", error: error.message });
    }
});

// Create a new community
router.post('/', async (req, res) =>{
    console.log("\n req.body: ", req.body, "\n");
    const community = new Community({
        name: req.body.name,
        description: req.body.description,
        members: req.body.members,
        createdBy: req.body.createdBy,
    });
    console.log("\n community: ", community, "\n");
    try{
        const newCommunity = await community.save();
        res.status(201).send(newCommunity);
    }
    catch(error){
        res.status(400).send({message: "Error creating community", error});
    }
});

// Middleware to get community by id
async function getCommunity(req, res, next) {
    try {
        const community = await Community.findById(req.params.id);
        if (community == null) {
            return res.status(404).send({ message: 'Community not found' });
        }
        res.community = community;
        next();
    } 
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

module.exports = router;