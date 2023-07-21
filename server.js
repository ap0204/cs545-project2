const express = require('express');
const { MongoClient } = require('mongodb');
const getOrderingInfo = require('./client');

var ObjectId = require('mongodb').ObjectId;

// Create an Express application
const app = express();
let db;
// MongoDB connection URI
const uri = 'mongodb://mongo:27017/mydatabase';

async function dbConnect() {
// Connect to MongoDB, insert one entry.
  const client = await MongoClient.connect(uri);
  console.log('Connected to MongoDB');
  db = await client.db('mydatabase');
  const result = await db.collection('cars').insertOne(
    {
      vin: '0123456789ABCDEFG',
      plate_number: 'ABCD01',
      state: 'AL',
      make: "Toyota",
      model: "Camry",
      year: "2012",
      owner_name: 'John Doe',
      owner_address: '100 Fake Street',
      owner_dl_number: '0123456789',
      problem_description: 'Brakes broke',
      day_in: "2023-01-01",
      day_out: "2023-01-02",
      workers: ["Mike King", "Dakota Byrd"],
      shop_location: "Madison, Alabama",
    }
  );
  console.log(result);
}

app.use(express.json())

// Define a route handler for the root path 
app.get('/cars', (req, res) => {
    console.log("get /cars");
    db.collection('cars').find().toArray().then((docs) => {
      res.json(docs);
    }).catch(err => {
      console.error('Failed to fetch documents from MongoDB:', err);
      res.status(500).send('Internal Server Error');
    })
});

// GET Route handler for a single id, id is the mongodb "_id" field
app.get('/cars/:id', (req, res) => {
    console.log("get /cars/{id}, " + req.params.id)
    db.collection('cars').findOne({"_id": new ObjectId(req.params.id)}).then((docs) => {
      res.json(docs);
    }).catch(err => {
      console.error('Failed to fetch document from MongoDB:', err);
      res.status(500).send('Internal Server Error');
   })
});

// POST route
app.post('/cars', (req, res) => {
  const body = req.body
  console.log("post /cars ")
  console.log(body);
  db.collection('cars').insertOne(body).then((docs) => {
    res.status(201).send({success: true});
  }).catch(err => {
    console.error('Failed to insert car to MongoDB:', err);
    res.status(500).send('Internal Server Error');
  })
});

// PUT route, id is the mongodb "_id" field
app.put('/cars/:id', (req, res) => {
  console.log("put /cars/{id}, " + req.params.id);
  // Query, sort, document, options, function(ignored).
  var uid = new ObjectId(req.params.id)
  db.collection('cars').replaceOne({"_id": uid}, req.body, {upsert: true}).then((docs) => {
    res.status(201).send({success: true});
  }).catch(err => {
    console.error('Failed to update car in MongoDB:', err);
    res.status(500).send('Internal Server Error');
  })
});

// DELETE route, id is the mongodb "_id" field
app.delete('/cars/:id', (req, res) => {
  console.log("delete /cars/{id}, " + req.params.id);
  db.collection('cars').deleteOne({"_id": new ObjectId(req.params.id)}).then((docs) => {
    res.status(201).send({success: true});
  }).catch(err => {
    console.error('Failed to update car in MongoDB:', err);
    res.status(500).send('Internal Server Error');
  })
});

// GET route for the SOAP server. Takes in a part number and returns an object
// {price: str, delivery_date: str}
app.get('/order/:part', async (req, res) => {
  try {
    const soapPartOrderInfo = await getOrderingInfo({part: req.params.part});
    res.json({
      ...soapPartOrderInfo,
    });
  } catch (err) {
    console.error('Failed to fetch documents: ', err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server on port 3000
app.listen(3000, () => {
  dbConnect().then (() => {
    console.log('Server is running on port 3000');
  });
});

