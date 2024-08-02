// routes/comment.js
const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// Create a new comment
router.post('/', async (req, res) => {
  const { content, postId, userId } = req.body;
  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId,
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Unable to create comment' });
  }
});

// Get all comments
router.get('/', async (req, res) => {
  try {
    const comments = await prisma.comment.findMany();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch comments' });
  }
});

// Get a single comment by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch comment' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content, postId, userId } = req.body;
  try {
    const comment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { content, postId, userId },
    });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Unable to update comment' });
  }
});

// Delete a comment
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.comment.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete comment' });
  }
});

module.exports = router;
