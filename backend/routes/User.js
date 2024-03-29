import express from 'express'
import { User,Auth } from '../db/index.js'
const router = express.Router()

// Searching a user
router.get('/', async (req, res) => {
    const { username } = req.query
    const queryObject = {}
    if (username) {
        queryObject.username = { $regex: username, $options: "i" }
    }
    const getUsername = await Auth.find(queryObject)
    const filteredUsers = getUsername.map(user => ({
        _id: user._id,
        username: user.username,
        dp: user.dp,
    }));
    res.json(filteredUsers)
})



/* If we create a new instance,then a new document inside the User model is created which we dont want(we already have the document,which we created when we registered the user)
So we will use the update method
*/
// Creating a profile
router.put('/user-profile/:userDocumentId', async (req, res) => {
    const { college, authId, email, github, leetcode, linkedin, collegeLocation, collegeCity } = req.body
    const { userDocumentId } = req.params
    const updateBody = { college, authId, email, github, leetcode, linkedin, collegeLocation, collegeCity }
    await User.updateOne({ _id: userDocumentId }, updateBody)
})

// Getting a specific user
router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params
        const response = await User.findOne({ username: username })
            .populate({
                path: 'authId',
                model: 'Auth',
                select: 'username dp'
            })
            .exec();
        //* wont use this since we need to populate multiple fields .populate('authId','username')
        res.json(response);
    } catch (error) {
        res.status(403).json(error)
    }
})

// Follow a user(from followers list or followers list)     
router.put('/follow', async (req, res) => {
    const { userDocumentId, followUserId } = req.body
    try {
        // Add followUserId to the following list of userId
        await User.findByIdAndUpdate(userDocumentId, { $addToSet: { following: followUserId } })

        await User.findByIdAndUpdate(followUserId, { $addToSet: { followers: userDocumentId } })
        res.json("User followed Successfully")
    } catch (error) {
        res.status(500).json({ error: "An error occurred while following user" });
    } 
})

// Unfollow a user from followingList
router.put('/unfollow', async (req, res) => {
    console.log("unfollow")
    const { userDocumentId, unfollowUserId } = req.body
    try {
        const updateFollowing = await User.updateOne({ _id: userDocumentId }, { $pull: { following: unfollowUserId } });
        if (!updateFollowing) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updateFollowers = await User.updateOne({ _id: unfollowUserId }, { $pull: { followers: userDocumentId } });
        if (!updateFollowers) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (error) {
        res.status(500).json({message : "Error"})
    }
})

// Remove a user(from followers list)
router.put('/remove', async (req, res) => {
    const { userDocumentId, unfollowUserId } = req.body
    // Remove unfollowUserId from the following list of userDocumentId
    const updateFollowers = await User.updateOne({ _id: userDocumentId }, { $pull: { followers: unfollowUserId } });
    if (!updateFollowers) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Remove userDocumentId from the followers list of unfollowUserId
    const updateFollowing = await User.updateOne({ _id: unfollowUserId }, { $pull: { following: userDocumentId } });

    if (!updateFollowing) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User unfollowed successfully' });

})


// GET FOLLOWERS with their usernames
router.get('/followers/:username', async (req, res) => {
    const { username } = req.params
    try {
        const response = await User.find({username : username})
        const followerIds = response.map(e=>e.followers)
        const followers = await User.find({ _id: { $in: followerIds[0] }}).populate({
            path : "authId",
            select : 'username dp',
            model : "Auth"
        })
        // const followers2 = await User.find({ _id: { $in: followerIds } })
        // const f2 = followers2.map(e=>e.followers)
        // const f3 = followers2.map(e=>e.following)
        // res.json({followers,userFollowers : f2,userFollowing : f3})
        res.json({followers})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

})

// GET FOLLOWING with their usernames
router.get('/following/:username', async (req, res) => {
    const { username } = req.params
    try {
        const response = await User.find({username : username})
        const followingIds = response.map(e => e.following)
        const following = await User.find({ _id: { $in: followingIds[0] }}).populate({
            path : "authId",
            select : 'username dp',
            model : "Auth"
        })
        // const following2 = await User.find({ _id: { $in: followingIds }})
        // const f2 = following2.map(e=>e.followers)
        // const f3 = following2.map(e=>e.following)
        // res.json({following,userFollowers : f2,userFollowing : f3})
        res.json({following})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.post('/followingfollowers/check', async (req, res) => {
    const { userId, myId } = req.body
    try {
        const response = await User.findById(myId)
        const check = response.following.map(e => e._id)
        if (check.length == 0) res.status(200).json("false")
        else {
            check.forEach(element => {
                if (element.toString() == userId) {
                    res.status(200).json("true")
                }
            })
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.post('followingfollowers/fullcheck',async(req,res)=>{
    
})


export default router



