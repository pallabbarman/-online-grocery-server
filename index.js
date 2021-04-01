const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

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
    const productCollection = client
        .db("online-grocery")
        .collection("products");
    const ordersCollection = client.db("online-grocery").collection("orders");

    app.get("/products", (req, res) => {
        productCollection.find().toArray((err, items) => {
            res.send(items);
        });
    });

    app.post("/addProduct", (req, res) => {
        const newProduct = req.body;
        productCollection.insertOne(newProduct).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    app.get("/product/:_id", (req, res) => {
        productCollection
            .find({ _id: ObjectId(req.params._id) })
            .toArray((err, documents) => {
                res.send(documents);
            });
    });

    app.delete("/delete/:_id", (req, res) => {
        console.log(req.params._id);
        productCollection
            .deleteOne({ _id: ObjectId(req.params._id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
            })
            .catch((err) => console.log(err));
    });

    app.post("/addOrder", (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    app.get("/orders", (req, res) => {
        ordersCollection
            .find({ email: req.query.email })
            .toArray((err, items) => {
                res.send(items);
            });
    });
});

app.listen(port);
