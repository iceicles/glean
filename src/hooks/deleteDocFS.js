import { projectFirestore } from '../firebase/config';
import { doc, deleteDoc } from 'firebase/firestore';

/* 
Handles deleting document from firestore
*/
const deleteDocFS = (
  topCollection,
  userName,
  entriesCollection,
  docToDelete
) => {
  deleteDoc(
    doc(
      projectFirestore,
      `${topCollection}/${userName}/${entriesCollection}`,
      `${docToDelete || null}`
    )
  );
};

export default deleteDocFS;
