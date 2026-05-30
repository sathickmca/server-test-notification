const express = require('express');
const { MongoClient } = require('mongodb');
const { port, mongoUri, dbName, collectionName } = require('./config');

const app = express();

app.use(express.json());

let dbClient;

async function connectMongo() {
  if (!dbClient) {
    dbClient = new MongoClient(mongoUri);
    await dbClient.connect();
    console.log(`Connected to MongoDB at ${mongoUri}`);
  }
  return dbClient.db(dbName).collection(collectionName);
}

app.post('/servertest', async (req, res) => {
  const { servername, applicationname, applicationowneremail, createddatetime } = req.body;

  if (!servername || !applicationname || !applicationowneremail || !createddatetime) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: servername, applicationname, applicationowneremail, createddatetime',
    });
  }

  const document = {
    servername,
    applicationname,
    applicationowneremail,
    createddatetime,
    createdAt: new Date(),
  };

  try {
    const collection = await connectMongo();
    const result = await collection.insertOne(document);
    return res.status(201).json({
      success: true,
      insertedId: result.insertedId,
      document,
    });
  } catch (error) {
    console.error('Failed to insert servertest document:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
