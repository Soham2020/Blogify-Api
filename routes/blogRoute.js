const express = require('express');
const router = express.Router();
const Blogs = require('../models/blogModel');
const auth = require('../middleware/auth');

// Get all the blogs
router.get('/getAll', async (req, res) => {
    try {
        const blogs = await Blogs.find();
        res.json(blogs);
    }catch (err) {
        return res.status(500).json({msg: err.message});
    }
})

// Get Blogs
router.get('/getBlogs', auth, async (req, res) => {
    try {
        const blogs = await Blogs.find({ user_id: req.user.id });
        res.json(blogs);
    }catch (err) {
        return res.status(500).json({msg: err.message});
    }
})

// Create new Blogs
router.post('/createBlogs', auth, async (req, res) => {
    try {
        console.log(req.body);
        const { title, author, category, img, content, date } = req.body;
        const newBlog = new Blogs({
            title, author, category, img, content, date, user_id: req.user.id
        });
        await newBlog.save();
        res.json("Blog Created!!");
    }catch (err) {
        return res.status(500).json({msg: err.message});
    }
})

// Delete Blogs
router.delete('/deleteBlog/:id', auth, async (req, res) => {
    try {
        await Blogs.findByIdAndDelete(req.params.id);
        res.json("Blog deleted!!");
    }catch (err) {
        return res.status(500).json({msg: err.message});
    }
})

// Update blog
router.put('/updateBlog/:id', auth, async (req, res) => {
    try {
        const { title, author, category, img, content, date } = req.body;
        await Blogs.findOneAndUpdate({
            _id: req.params.id
        }, {
            title,
            author,
            category,
            img,
            content,
            date
        });
        res.json("Blog updated!!");
    }catch (err) {
        return res.status(500).json({msg: err.message});
    }
})

// Get Blog by _id
router.get('/getBlog/:id', auth, async (req, res) => {
    try {
        const blog = await Blogs.findById(req.params.id);
        res.json(blog);
    }catch (err) {
        return res.status(500).json({msg: err.message});
    }
})

module.exports = router;