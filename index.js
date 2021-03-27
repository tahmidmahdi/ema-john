const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;

const app = express()

app.use(bodyParser.json());
app.use(cors());

//mongodb 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fckrr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

console.log(process.env.DB_USER);


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
    //   console.log('dataBase Connected');

    //post
    app.post('/addProduct', (req,res)=>{
        const products = req.body; //just a name
        console.log(products);
        productsCollection.insertOne(products)  //this is collection products
        .then(result =>{
            console.log(result.insertedCount)
            res.send(result.insertedCount)
        })
    })

    //get data
    app.get('/products', (req,res)=>{
        productsCollection.find({})
        .toArray((error, documents)=>{
            res.send(documents);
        })
    })


    app.get('/product/:key', (req,res)=>{
        productsCollection.find({key : req.params.key})
        .toArray((error, documents)=>{
            res.send(documents[0]);
        })
    })


    app.post('/productsByKeys', (req,res)=>{
        const productKeys = req.body;
        productsCollection.find({key: {$in: productKeys}})
        .toArray((error, documents)=>{
            res.send(documents)
        })
    })


    app.post('/addOrder', (req,res)=>{
        const order = req.body; //just a name
        // console.log(products);
        ordersCollection.insertOne(order)  //this is collection products
        .then(result =>{
            // console.log(result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })


});

app.listen(4000)
