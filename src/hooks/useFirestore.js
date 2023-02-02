import { projectFirestore } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

const useFirestore = async (
  collection,
  userName,
  entriesCollection,
  entries,
  entry
) => {
  const entriesCollectionRef = doc(
    projectFirestore,
    collection,
    userName,
    entriesCollection,
    entries
  );
  await setDoc(entriesCollectionRef, {
    entry,
  });
};

export default useFirestore;
