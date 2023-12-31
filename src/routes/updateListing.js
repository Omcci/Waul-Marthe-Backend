import { db } from "../database";
import * as admin from 'firebase-admin'

export const updateListingRoute = {
  method: "POST",
  path: "/api/listings/{id}",
  handler: async (req, res) => {
    
    const id = req.params.id;
    const { name, description, price } = req.payload;
    const token = req.headers.authtoken
    const user = await admin.auth().verifyIdToken(token)
    console.log("reqpayload", req.payload);
    const userId = user.user_id;

    try {
      await db.query(
        `update listings set name= ?, description = ? , price= ?  where id = ? and user_id = ? `,
        [name, description, price, id, userId]
      );
      const { results } = await db.query(
        "select * from listings where id= ? and user_id= ?",
        [id, userId]
      );
      return results[0];
    } catch (error) {
      console.error("Error updating listing:", error);
      throw new Error("Internal Server Error"); 
    }
  },
};
