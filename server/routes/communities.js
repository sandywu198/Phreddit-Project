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

// Get communities by user
router.get('/community/:createdBy', async (req, res) => {
    try {
      const { createdBy } = req.params;
      const communities = await Community.find({ createdBy });
      if (communities.length === 0) {
        return res.status(404).send({ message: 'No communities made by this user' });
      }
      res.send(communities);
    } catch (error) {
      console.error('Error fetching communities:', error);
      res.status(500).send({ message: error.message });
    }
});

// Delete community by user
router.delete('/:createdBy', async (req, res) => {
    try {
      const { createdBy } = req.params;
      const result = await Community.deleteMany({ createdBy });
      if (result.deletedCount === 0) {
        return res.status(404).send({ message: 'No communities to delete' });
      }
      res.send({ message: `community was deleted` });
    } catch (error) {
      console.error('Error deleting communities:', error);
      res.status(500).send({ message: error.message });
    }
});

// Delete community by id
router.delete('/:id/community-id', getCommunity, async (req, res) => {
    try {
        await res.community.deleteOne(); // Deletes the community
        res.send({ message: 'Community deleted successfully' });
    } catch (error) {
        console.log('Error deleting community:', error);
        res.status(500).send({ message: 'Error deleting community', error: error.message });
    }
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

// Delete post from community
router.put('/:id/delete-post', async (req, res) => {
    try {
        const communityId = req.params.id;
        const postID = req.body.postID;
        const community = await Community.findOneAndUpdate(
            { _id: communityId },
            { $pull: { postIDs: postID } },
            { new: true } 
        );
        if (!community) {
            return res.send({ message: 'Community not found' });
        }
        res.send(community);
    } catch (error) {
        console.log('Error in reverse PUT route:', error);
        res.status(400).send({ message: 'Error removing post from community', error: error.message });
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

// Edit community fields
router.put('/:id/edit-community', getCommunity, async (req, res) => {
    try {
        const updates = req.body; 
        Object.assign(res.community, updates);
        const updatedCommunity = await res.community.save();
        res.send(updatedCommunity);
    } catch (error) {
        console.log('Error updating community:', error);
        res.status(400).send({ message: 'Error updating community', error: error.message });
    }
});

// Middleware to get community by id
async function getCommunity(req, res, next) {
    try {
        const community = await Community.findById(req.params.id);
        // if (community == null) {
        //     return res.status(404).send({ message: 'Community not found' });
        // }
        res.community = community;
        next();
    } 
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

module.exports = router;