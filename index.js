const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const uri = "mongodb+srv://mehnaz3114:emaJaikoi3124@cluster0.s88xr.mongodb.net/groceryHouse?retryWrites=true&w=majority";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const productCollection = client.db("groceryHouse").collection("products");
    const ordersCollection = client.db("groceryHouse").collection("orders");

    app.get('/products', (req, res) => {
        productCollection.find()
            .toArray((err, items) => {
                res.send(items);
            })
    });

    app.get('/product/:id', (req, res) => {
        productCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, item) => {
                res.send(item[0]);
                // res.send(item)
            })
    });

    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        productCollection.insertOne(newProduct)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0);
            })
    });

    app.post('/addOrder', (req, res) => {
        const orders = req.body;
        ordersCollection.insertOne(orders)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0);
            })
    });
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});