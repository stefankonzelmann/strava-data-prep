import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

const { ATLAS_URI } = process.env;

const client = new MongoClient(ATLAS_URI);

export async function insertActivities(activities) {
  console.log(
    `Received ${activities.length} activities from Strava API for inserting to database`
  );
  try {
    const database = client.db("stravaTest");
    const collection = database.collection("activities_automate");

    const insertedActivities = [];

    for (const activity of activities) {
      let query = { id: activity.id };
      const existingActivity = await collection.findOne(query);
      if (!existingActivity) {
        // Activity does not exist in the database, insert it
        await collection.insertOne(activity);
        insertedActivities.push(activity);
        onsole.log(`Activity with ID ${activity.id} inserted`);
      } else {
        // Activity already exists in the database, handle accordingly
        console.log(
          `Activity with ID ${activity.id} already exists in the database`
        );
      }
    }

    console.log(
      `${insertedActivities.length} / ${activities.length} activities inserted to database`
    );
    return insertedActivities;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
