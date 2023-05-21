const bodyParser = require('body-parser');
const express = require('express');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post('/score', (req, res) => {
  const score = req.body.score; // get the score value from the request body
  // insert the score value into your database
  // send a response back to the client
  res.status(200).send('Score saved successfully');
});
app.get("/",(req, res)=>{
  res.redirect(__dirname + "./game.html");
  // return render_template("game.html")
})
app.listen(8000, (req, res) => {
  console.log("Running on 8000");

})
