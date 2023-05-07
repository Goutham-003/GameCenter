const mongoose = require('mongoose')

// const connexion = mongoose.connect(url,{
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => {
//     console.log("MONGODB CONNEXION ESTABLISHED");
// }).catch((err) => {
//     console.log("MONGODB CONNEXION FAILED");
//     console.log(err);
// });

const express = require("express");
const Book = require("./models/player");

const app = express();
app.use(express.json());


app.get("/api/books", (req, res) => {
  Book.find()
    .then(books => res.json(books))
    .catch(error => res.status(500).json({ error: error.message }));
});

app.post("/api/books", (req, res) => {
  const book = new Book(req.body);
  book.save()
    .then(() => res.json({ message: "Book created successfully" }))
    .catch(error => res.status(500).json({ error: error.message }));
});

app.put("/api/books/:id", (req, res) => {
  Book.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.json({ message: "Book updated successfully" }))
    .catch(error => res.status(500).json({ error: error.message }));
});

app.delete("/api/books/:id", (req, res) => {
  Book.findByIdAndDelete(req.params.id)
    .then(() => res.json({ message: "Book deleted successfully" }))
    .catch(error => res.status(500).json({ error: error.message }));
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

