import { useState, useEffect } from 'react';
import { projectFirestore } from '../firebase/config';
import { doc, getDocs, setDoc } from 'firebase/firestore';
import { collection } from 'firebase/firestore';

const useFirestore = (
  topCollection,
  userName,
  entriesCollection,
  entries,
  entry,
  newData = false
) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    // gets the 'Entry' document reference
    const entryDocumentRef = doc(
      projectFirestore,
      `${topCollection}/${userName}/${entriesCollection}/${entries}`
    );

    // creates a new document with entry as its data
    newData &&
      setDoc(entryDocumentRef, {
        entry,
      });

    // gets the 'Entries' collection reference
    const entriesCollectionRef = collection(
      projectFirestore,
      `${topCollection}/${userName}/${entriesCollection}`
    );

    // listens to and returns changes in firestore
    const unsub = async () => {
      // using getDocs instead of onSnapshot so that the card components don't always re-render when
      // data changes
      const docSnap = await getDocs(entriesCollectionRef);
      // loop through the documents in Entries collection and store in an array
      const documents = [];
      docSnap.forEach((doc) => {
        // doc is each documents in Entries collection (ie., Entry-0, Entry-1, etc)
        documents.push({ ...doc.data(), id: doc.id });
      });
      setData(documents);
    };

    return () => unsub();
  }, [topCollection, userName, entriesCollection, entries, entry, newData]);

  return { data };
};

export default useFirestore;
