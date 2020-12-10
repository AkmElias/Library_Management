const express = require('express')
const router = express.Router()
const verify = require('../varifytoken')
const Book = require('../models/Book')
const User = require('../models/User')
const {bookValidation} = require('../validation');

router.get('/', async (req,res) => {
    
    try{
        const books = await Book.find()
        res.status(200).json(books)
    } catch(error) {
        res.status(401).json({message: error})
    }
})

//inserting new Book
router.post('/insertBook', verify, async (req,res) => {
    
    //checking user role
    const librarian = checkRole(req.user);
    if (!librarian) return res.status(401).send("You are not permitted for this action!")

    //checking validation
    const {error} = bookValidation(req.body);
    if (error)
    return res.status(400).send({message: error.details[0].message})

    //add book
    const book = new Book({
        bookName: req.body.bookName,
        author: req.body.author,
        genre: req.body.genre ? req.body.genre : "Novel/ Romantic Drama",
        releaseDate: req.body.releaseDate,
        active: req.body.active ? req.body.active : true,
        bookImage: req.body.bookImage
    })

    try{
        const bokkAdded = await book.save();
        res.status(201).json(book)
        }catch(err){
            res.status(400).json({message: err})
        }

})

//updating Book
router.put('/:bookId', verify, async (req,res) => {
    //checking user role
    const librarian = checkRole(req.user);
    if (!librarian) return res.status(401).send("You are not permitted for this action!")

     //checking validation
     const {error} = bookValidation(req.body);
     if (error)
     return res.status(400).send({message: error.details[0].message})
 
    //checking if the book is in DB
    try{
        const book = await Book.findById({_id: req.params.bookId});
        if(!book) return res.status(401).send("Book doesn't exist!");
    } catch(err) {
     res.status(400).json({message: err})
    }

    //updating
    try{
        const book = await Book.updateOne({_id: req.params.bookId}, req.body);
        res.status(201).json(book);
    } catch(err) {
     res.status(400).json({message: err})
    }
})

//activating/deactivating specific book
router.patch('/:bookId', verify, async (req,res) => {
    //checking role
    const librarian = checkRole(req.user);
    if (!librarian) return res.status(401).send("You are not permitted for this action!");

    //checking if the book is in DB
    try{
        const book = await Book.findById({_id: req.params.bookId});
        if(!book) return res.status(401).send("Book doesn't exist!");
    } catch(err) {
     res.status(400).json({message: err})
    }

     //activating/deactivating
     try{
        const book = await Book.updateOne({_id: req.params.bookId},{active: req.body.active} );
        res.status(201).json(book);
    } catch(err) {
     res.status(400).json({message: err})
    }

})

//deleting specific book
router.delete('/:bookId',verify, async (req,res) => {
     //checking role
     const librarian = checkRole(req.user);
     if (!librarian) return res.status(401).send("You are not permitted for this action!");
 
     //checking if the book is in DB
     try{
         const book = await Book.findById({_id: req.params.bookId});
         if(!book) return res.status(401).send("Book doesn't exist!");
     } catch(err) {
      res.status(400).json({message: err})
     }
 
      //deleting
      try{
         const book = await Book.deleteOne({_id: req.params.bookId});
         res.status(201).json(book);
     } catch(err) {
      res.status(400).json({message: err})
     }
})

async function checkRole(data) {
   
    let userRole;
    try{
        const user = await User.findOne({_id: data._id})
        userRole = user.Role;
    }catch(error) {
        console.log(' db checking error!')
        //return res.status(400).json({message: error})
       }
    if(userRole !== "Librarian") return false;
    return true;
}

module.exports = router;