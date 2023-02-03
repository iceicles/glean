import { useState, useEffect } from 'react';
import { projectFirestore } from '../firebase/config';
import { onSnapshot, collection } from 'firebase/firestore';

const useFirestoreRead = (topCollection, userName, entriesCollection) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const dbRef = collection(
      projectFirestore,
      `${topCollection}/${userName}/${entriesCollection}`
    );
    const unsubscribe = onSnapshot(dbRef, (docSnap) => {
      // loop through the documents in Entries collection and store in an array
      const documents = [];
      docSnap.forEach((doc) => {
        // doc is each documents in Entries collection (ie., Entry-0, Entry-1, etc)
        documents.push({ ...doc.data(), id: doc.id });
      });
      setData(documents);
      console.log('documents - ', documents);
    });

    return () => unsubscribe();
  }, [entriesCollection, topCollection, userName]);

  return { data };
};

export default useFirestoreRead;
