const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

router.get('/posts', async (req, res) => {
    try {
      const posts = await prisma.post.findMany({
        include: {
          author: true,
          comments: true,
        },
      });
      res.json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const post = await prisma.post.findUnique({
        where: { id: parseInt(id) },
        include: {
          author: true,
          comments: true,
        },
      });
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json(post);
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;