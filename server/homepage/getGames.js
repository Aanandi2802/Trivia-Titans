const functions = require('@google-cloud/functions-framework');
const { Timestamp } = require('firebase-admin/firestore');

const firestore = require("./db");
const gamesCollection = firestore.collection('testgames');
const PAGE_SIZE = 2;

functions.http('getGames', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');

  if (req.method === "OPTIONS") {
    // stop preflight requests here
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  try {
    // let page = parseInt(req.query.page) || 1;
    // let nextPageToken = req.query.pageToken || '';
    // const docRef = gamesCollection.doc(nextPageToken);
    // const snapshot = await docRef.get();

    // const totalGamesSnapshot = await gamesCollection.where('isAvailable', '==', true).get();
    // const totalGames = totalGamesSnapshot.size;

    let filterType = req.body.filterType || '';
    let filterValue = req.body.filterValue == 0 || req.body.filterValue ? req.body.filterValue : '';
    const currentDate = new Date();
    let currentTime = Timestamp.fromDate(new Date(currentDate.getTime() - 3 * 60 * 60 * 1000));
    console.log(new Date(currentDate.getTime() - 3 * 60 * 60 * 1000), currentDate);
    let query;

    if(filterType && filterValue!=="") {
      query = gamesCollection
        // .where('isAvailable', '==', true)
        .where(filterType, "==", filterValue)
        .where("startTime", ">", currentTime)
        .orderBy('startTime', 'desc')
        // .offset((page - 1) * PAGE_SIZE)
        // .limit(PAGE_SIZE)
    } else {
      query = gamesCollection
        // .where('isAvailable', '==', true)
        .where("startTime", ">", currentTime)
        .orderBy('startTime', 'desc')
        // .offset((page - 1) * PAGE_SIZE)
        // .limit(PAGE_SIZE)

        // .orderBy('createdDate', 'desc')
        // .startAfter(snapshot)
        // .limit(PAGE_SIZE);
    }


    const querySnapshot = await query.get();

    const games = [];
    querySnapshot.forEach((doc) => {
      let game = doc.data();
      // game.createdDate = game.createdDate.toDate();
      // game.modifiedDate = game.modifiedDate.toDate();
      game.startTime = game.startTime.toDate();
      // game.startDate = game.startDate.toDate();
      games.push(game);
    });

    // Check if there are more results available
    // let nextQuery = gamesCollection
    //   .where('isAvailable', '==', true)
    //   .orderBy('createdDate', 'desc')
    //   .startAfter(querySnapshot.docs[querySnapshot.docs.length - 1])
    //   .limit(1);

    // const nextQuerySnapshot = await nextQuery.get();
    // const hasMore = !nextQuerySnapshot.empty;

    // const totalPages = Math.ceil(totalGames / PAGE_SIZE);

    // Prepare the response object
    const response = {
      games,
      // totalPages,
      // currentPage: page,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error getting available games:', error);
    res.status(500).send('Internal Server Error');
  }
});
