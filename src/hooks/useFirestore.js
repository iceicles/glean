import { useState, useEffect } from 'react';
import { projectFirestore } from '../firebase/config';
import {
  doc,
  collection,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  addDoc,
} from 'firebase/firestore';

/* 
Handles reading and writing to firestore
*/
const useFirestore = (
  topCollection,
  userName,
  entriesCollection,
  entry = '',
  updatedEntry = '',
  entryId
) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // document reference with auto generated id
    const entryDocumentRef = doc(
      projectFirestore,
      `${topCollection}/${userName}/${entriesCollection}/${entryId}`
    );

    // gets the 'Entries' collection reference
    const entriesCollectionRef = collection(
      projectFirestore,
      `${topCollection}/${userName}/${entriesCollection}`
    );

    // making new entry
    if (!!entry && updatedEntry === '') {
      addDoc(entriesCollectionRef, {
        entry,
        timeStamp: serverTimestamp(),
      });
      // updating an existing entry
    } else if (!!updatedEntry) {
      updateDoc(entryDocumentRef, {
        entry: updatedEntry,
        timeStamp: serverTimestamp(),
      });
    }

    // orders the document in 'Entries' collection by timeStamp in desc order
    const colQuery = query(entriesCollectionRef, orderBy('timeStamp', 'desc'));

    // listens to and returns changes in firestore
    const unsub = onSnapshot(colQuery, (docSnap) => {
      // using getDocs instead of onSnapshot so that the card components don't always re-render when data changes
      // loop through the documents in Entries collection and store in an array
      const documents = [];
      docSnap.forEach((doc) => {
        // doc is each documents in Entries collection (ie., Entry-0, Entry-1, etc)
        documents.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setData(documents);
    });

    return () => unsub();
  }, [
    topCollection,
    userName,
    entriesCollection,
    entry,
    updatedEntry,
    entryId,
  ]);

  return { data };
};

export default useFirestore;
