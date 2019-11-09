const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');
const uri = "mongodb+srv://cintrust:simple301@react-app-jvhca.gcp.mongodb.net/test?retryWrites=true&w=majority";


// const MongoClient = require('mongodb').MongoClient;
// // const uri = "mongodb+srv://cintrust:<password>@react-app-jvhca.gcp.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas!');
        console.error(error);
    });

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.post('/api/recipes', (req, res, next) => {

    const recipe = new Recipe({
        title: req.body.title,
        instructions: req.body.instructions,
        ingredients: req.body.ingredients,
        time: req.body.time,
        difficulty: req.body.difficulty
    });
    recipe.save().then(
        () => {
            res.status(201).json({
                message: 'Post saved successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});
app.get('/api/recipes/:id', (req, res, next) => {
    Recipe.findOne({
        _id: req.params.id
    }).then(
        (thing) => {
            res.status(200).json(thing);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
});
app.put('/api/recipes/:id', (req, res, next) => {

    const recipe = new Recipe({
        _id: req.params.id,
        title: req.body.title,
        instructions: req.body.instructions,
        ingredients: req.body.ingredients,
        time: req.body.time,
        difficulty: req.body.difficulty
    });
    Recipe.updateOne({_id: req.params.id}, recipe).then(
        () => {
            res.status(201).json({
                message: 'Thing updated successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});
app.delete('/api/recipe/:id', (req, res, next) => {
    Recipe.deleteOne({_id: req.params.id}).then(
        () => {
            res.status(200).json({
                message: 'Deleted!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});
app.use('/api/recipes', (req, res, next) => {
    Recipe.find().then(
        (things) => {
            res.status(200).json(things);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});
module.exports = app;
