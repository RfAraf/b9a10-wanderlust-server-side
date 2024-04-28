const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// tourismGuy
// TBOTFk9WsE5V28u8

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0xqywot.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const database = client.db("touristSpotDB");
    const touristSpotCollection = database.collection("touristSpots");

    // read created tourist spot in database as API
    app.get("/touristSpots", async (req, res) => {
      const cursor = touristSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // read certain tourist spot in database as API
    app.get("/touristSpots/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const touristSpot = await touristSpotCollection.findOne(query);
      res.send(touristSpot);
    });

    // read all tourist spot of a certain user who added those
    app.get("/myList/:email", async (req, res) => {
      const userEmail = req.params.email;
      const query = { email: userEmail };
      const cursor = touristSpotCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // create a tourist spot
    app.post("/touristSpots", async (req, res) => {
      const touristSpot = req.body;
      console.log("new spot", touristSpot);
      const result = await touristSpotCollection.insertOne(touristSpot);
      res.send(result);
    });

    // delete a tourist spot
    app.delete("/myList/:id", async (req, res) => {
      const id = req.params.id;
      console.log("delete this id from db", id);
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("coffee store server");
});

// connect app to the port
app.listen(port, () => {
  console.log(`tourism running on PORT : ${port}`);
});
