const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { message } = require('statuses');
const prisma = new PrismaClient();

const JWT_SECRET = "shhhhhhh"



router.post('/register', async (req, res) => {

    const {username, email, password, isAdmin} = req.body;

    try{
        if(!username || !password || !email){
            return res.status(400).json({ message: 'PLEASE PROVIDE ALL THE REQUIRED FIELDS'});
        }
        const exsistingUser = await prisma.user.findUnique({where: {email}});

        if(exsistingUser){
            return res.status(400).json({ message: "USER ALREADY EXISTS!"});
        }

        const hashPassword = await bcrypt.hash(password,10);

        const newUser = await prisma.user.create({
            data:{
                username,
                email,
                password : hashPassword,
                isAdmin: isAdmin || false,

            }
        });

        res.status(201).json(newUser);
    }
    catch{
        res.status(500).json({ message: 'Server error', error });
    }
 
});




router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      if (!email || !password) {
        return res.status(400).json({ message: 'PLEASE ENTER ALL THE FIELDS' });
      }
  
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: 'PLEASE REGISTER FIRST IDIOT!' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin , username: user.username}, JWT_SECRET, { expiresIn: '1h' });
  
      res.status(200).json({ token, user: { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin } });
    } catch (error) {
      console.error('Error in login route:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
