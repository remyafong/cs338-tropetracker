const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');
//const admin = require('firebase-admin');
const dotenv = require('dotenv');
const firebase = require('firebase');
dotenv.config();

// let firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
// admin.initializeApp(firebaseConfig);

firebase.initializeApp({
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const algolia = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_API_KEY
);

const db = firebase.database();
const ALGOLIA_USERS_INDEX = 'trope-tracker';

const index = algolia.initIndex(ALGOLIA_USERS_INDEX);

db.ref('/trope/').once('value', tropes => {
    const records = [];
    tropes.forEach(trope => {
        const childKey = trope.key;
        const childData = {
            value: trope.val().value
        };

        childData.objectID = childKey;
        records.push(childData);
    });

    index
        .saveObjects(records)
        .then(() => {
            console.log("Contact imported to Algolia");
        })
        .catch(error => {
            console.error('Error importing', error);
            process.exit(1);
        });
});



// exports.usersEntry = functions.database
//     .ref(`/trope/`)
//     .onWrite((change, context) => {
//         const index = client.initIndex(ALGOLIA_USERS_INDEX);
//         const changeSnapshot = change.after.val();
//     if (!change.after.val()) {
//         return;
//     }
//     const firebaseObject = {
//         //displayname: changeSnapshot.displayname,
//         objectID: context.params.value
//     };
//     return index.saveObject(firebaseObject);
//     });

// exports.userIndexDeletion = functions.database
//     .ref(`/trope/`)
//     .onDelete((snap, context) => {
//         const index = client.initIndex(ALGOLIA_USERS_INDEX);
//         const objectID = context.params.value;
    
//     return index.deleteObject(objectID);
//     });
