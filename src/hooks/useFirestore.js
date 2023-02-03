import { projectFirestore } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

const useFirestore = async (
  topCollection,
  userName,
  entriesCollection,
  entries,
  entry
) => {
  const entriesDocumentRef = doc(
    projectFirestore,
    `${topCollection}/${userName}/${entriesCollection}/${entries}`
  );

  await setDoc(entriesDocumentRef, {
    entry,
  });
};

export default useFirestore;
