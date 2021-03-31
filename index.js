const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
require("dotenv").config();
const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.win4w.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Online Grocery is coming soon.");
});

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
client.connect((err) => {
    const productCollection = client.db("online-grocery").collection("products");

    app.get("/products", (req, res) => {
        productCollection.find().toArray((err, items) => {
            res.send(items);
        });
    });

    app.post("/addProduct", (req, res) => {
        const newEvent = req.body;
        console.log("Add new event", newEvent);
        productCollection.insertOne(newEvent).then((result) => {
            console.log(result.insertedCount);
            res.send(result.insertedCount > 0);
        });
    });
    
});

app.listen(port);
