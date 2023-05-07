//db.js

const mongoose = require('mongoose')

const url = `mongodb+srv://shaikriyaz20csm:320126552026@my-sample-cluster-b3ugy.mongodb.net/Cluster0?retryWrites=true&w=majority`;

const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })