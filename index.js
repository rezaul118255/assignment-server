const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.port || 5000;


// middleware
app.use(cors());
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ghfcjpf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        const Db = client.db("toysPortal")
        const toysCollection = Db.collection("toys")
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        app.post("/addToys", async (req, res) => {
            const body = req.body;
            const result = await toysCollection.insertOne(body)
            console.log(body)
            res.send(result)
        });
        app.get("/allJobs", async (req, res) => {
            const result = await toysCollection.find({}).toArray();
            res.send(result)
        })
        // app.get('/allJobs/:_id', (req, res) => {
        //     const id = parseInt(req.params._id);
        //     // console.log(id)
        //     const result = toysCollection.find(n => n.id === _id)
        //     res.send(result)
        // })
        app.get("/allJobs/:test", async (req, res) => {
            // console.log(req.params.test);
            if (req.params.test == "Science Kits" || req.params.test == "Math Learning Toys" || req.params.test == "Engineering Kits") {
                const result = await toysCollection.find({ category: req.params.test })
                    .toArray();
                return res.send(result)
            }

            const result = await toysCollection.find({}).toArray();
            res.send(result)
        })
        app.get("/allJobs/:email", async (req, res) => {
            // console.log(req.params.email)
            const result = await toysCollection.find({ postedBy: req.params.email }).toArray();
            res.send(result)
        })
        app.get("/getToysByText/:text", async (req, res) => {
            const text = req.params.text;
            const result = await toysCollection
                .find({
                    $or: [
                        { title: { $regex: text, $options: "i" } },
                        { category: { $regex: text, $options: "i" } },
                    ],
                })
                .toArray();
            res.send(result);
        });
        app.delete("/allJobs/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            // console.log(req.params.email)
            const result = await toysCollection.deleteOne(query);
            res.send(result)
        });









    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send(' Educational toys is running')
})
app.listen(port, () => {
    console.log(`education toys coming soon on ${port}`)
})



