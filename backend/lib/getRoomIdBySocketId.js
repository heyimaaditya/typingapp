const findRoomIdBySocketId = async (socketId, db) => {
  try {
    // Query the Firestore database for rooms containing the given socketId
    const querySnapshot = await db
      .collectionGroup('users')
      .where('socketId', '==', socketId)
      .get();

    //console.log(querySnapshot);

    // Loop through the query results to find the roomId
    let roomId = null;
    await querySnapshot.forEach((doc) => {
      roomId = doc.id;
    }); // Get the roomId from the document reference

    return roomId;
  } catch (error) {
    console.error(error);
    return null; // Return null if an error occurs or if the roomId is not found
  }
};

module.exports = findRoomIdBySocketId;