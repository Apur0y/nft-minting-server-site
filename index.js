const express = require('express');
const cors = require('cors');
require("dotenv").config(); 

const { MongoClient, ServerApiVersion } = require('mongodb');

const app= express();
const port = process.env.PORT || 5000;

//MiddleWare
app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@thelaststand.sh6jy.mongodb.net/?retryWrites=true&w=majority&appName=thelaststand`;

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

    const mainCollection = client.db("nft_data").collection("maindata")

    app.get('/alldata',async (req,res)=>{

        const result =await mainCollection.find().toArray();
        res.send(result)
    })

    app.post('/alldata', async(req,res)=>{

      const formData = req.body;
      const result = await mainCollection.insertOne(formData)
    })

    app.get('/alldata/:id', async (req, res) => {
      try {
          const tokenId = parseInt(req.params.id);
  
          if (isNaN(tokenId)) {
              return res.status(400).json({ error: "Invalid Token ID." });
          }
  
          const nft = await mainCollection.findOne({ tokenId });
  
          if (!nft) {
              return res.status(404).json({ error: "NFT not found." });
          }
  
          logger.info(`NFT Retrieved by ID: ${tokenId}`);
          res.status(200).json(nft);
      } catch (error) {
          logger.error("Error fetching NFT:", error);
          res.status(500).json({ error: "Internal server error." });
      }
  });




    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{

    res.send("Run the NFT")
})

app.listen(port,()=>{
    console.log(`NFT is running`)
})

