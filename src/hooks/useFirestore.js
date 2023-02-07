import { useState, useEffect } from 'react';
import { projectFirestore } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { onSnapshot, collection } from 'firebase/firestore';

const useFirestore = (
  topCollection,
  userName,
  entriesCollection,
  entries,
  entry
) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    // gets the 'Entry' document reference
    const entryDocumentRef = doc(
      projectFirestore,
      `${topCollection}/${userName}/${entriesCollection}/${entries}`
    );

    // creates a new document with entry as its data
    setDoc(entryDocumentRef, {
      entry,
    });

    // gets the 'Entries' collection reference
    const entriesCollectionRef = collection(
      projectFirestore,
      `${topCollection}/${userName}/${entriesCollection}`
    );

    // listens to and returns changes in firestore
    const unsubscribe = onSnapshot(entriesCollectionRef, (docSnap) => {
      // loop through the documents in Entries collection and store in an array

      const documents = [];
      docSnap.forEach((doc) => {
        // doc is each documents in Entries collection (ie., Entry-0, Entry-1, etc)
        documents.push({ ...doc.data(), id: doc.id });
      });
      setData(documents);
    });

    return () => unsubscribe();
  }, [topCollection, userName, entriesCollection, entries, entry]);

  return { data };
};

export default useFirestore;
