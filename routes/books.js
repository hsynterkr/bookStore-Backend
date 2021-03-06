var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
mongoose.connect('mongodb://admin:sharepoint0@ds251332.mlab.com:51332/bookstore');

let BookSchema = new mongoose.Schema({
  _id: Number,
  title: String,
  isbn: Number,
  pageCount: Number,
  publishedDate: Date,
  thumbnailUrl: String,
  shortDescription: String,
  longDescription: String,
  status: String,
  authors: [ 
    { type: String }
   ],
  categories: [
    { type: String }
  ],
});

BookSchema.index({ 'title': 'text' });
const Book = mongoose.model('Book', BookSchema);

/**
 * GET Books
 */
router.get('/', (req, res) => {
  if (req.query.skip) {
    Book.find({}).sort({ '_id': 1 }).skip(Number(req.query.skip)).limit(20)
    .then(result => {
      res.status(200).json(result);
    }).catch(error => {
      console.log(error);
      res.status(404).json(result);
    });
  } else {
    Book.find({}).sort({ '_id': 1 }).limit(20)
    .then(result => {
      res.status(200).json(result);
    }).catch(error => {
      console.log(error);
      res.status(404).json(result);
    });
  }
});

/**
 * GET Book Details
 */
router.get('/detail/:id', (req, res) => {
  Book.findOne({ '_id': req.params.id }, (error, result) => {
    if (error)
      res.status(404).json(error);
    res.status(200).json(result);
  })
});

/**
 * POST Create Book
 */
router.post('/create', (req, res) => {
  let newBook = new Book({
    _id: req.body._id,
    title: req.body.title,
    isbn: req.body.isbn,
    pageCount: req.body.pageCount,
    publishedDate: req.body.publishedDate,
    thumbnailUrl: req.body.thumbnailUrl,
    shortDescription: req.body.shortDescription,
    longDescription: req.body.longDescription,
    status: req.body.status,
    authors: req.body.authors,
    categories: req.body.categories,
  }); 

  newBook.save((error, book) => {
    if(error) {
      console.log(error);
      res.status(404).json(error);
    } else {
      res.status(200).json(book); 
    } 
  });

});

/**
 * GET Search in books
 */
router.get('/search', async (req, res) => {
  let results = {
    books: [],
    authors: [],
    publishers: []
  };

    await Book.find({ 'title': { $regex: req.query.book, $options: "$i" } }, (error, result) => {
      if (error)
        res.status(404).json(error);
      results.books = result;
    });
    await Book.find({ 'authors': { $regex: req.query.book, $options: "$i" } }, (error, result) => {
      if (error)
        res.status(404).json(error);
      results.authors = result;
    })
    await Book.find({ 'publisher': { $regex: req.query.book, $options: "$i" } }, (error, result) => {
      if (error)
        res.status(404).json(error);
      results.publishers = result;
    })
    res.status(200).json(results);
});

/**
 * GET New Books
 */
router.get('/new', (req, res) => {
  console.log(req.body);
  Book.find({}).sort({ publishedDate: -1 }).exec((error, result) => {
    if (error)
      res.status(404).json(error);
    res.status(200).json(result);
  })
});

module.exports = router;