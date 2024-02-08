import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

const { ATLAS_URI } = process.env;

const client = new MongoClient(ATLAS_URI);

export async function insertActivities(activites) {
  console.log(`Received ${activites.length} acitivties to insert`);
  try {
    const database = client.db("stravaTest");
    const collection = database.collection("activities_automate");

    const result = await collection.insertMany(activites, { ordered: false });
    return result;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
