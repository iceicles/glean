import { useState } from 'react';
import useFirestore from '../hooks/useFirestore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { setId } from '../helpers/setId';
import { ButtonMUI as Button } from '../components/Button';
import { someImage } from './someimage';
import { CardMUI as Card } from '../components/Card';

const colDocs = {
  topCollection: 'Users',
  userName: 'Jon',
  entriesCollection: 'Entries',
};

const DiaryPage = () => {
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [editValueArr, setEditValueArr] = useState([]);
  const [cardClicked, setCardClicked] = useState(false);
  // const [canvasClickedId, setCanvasClickedId] = useState('');
  const [entryIdFS, setEntryIdFS] = useState('No Entry');
  const [entryValueFS, setEntryValueFS] = useState('');
  const [cardVisibility, setCardVisibility] = useState(false);
  const [newEntry, setNewEntry] = useState(false);
  const [counter, setCounter] = useState(1);
  const [saveClicked, setSaveClicked] = useState(false);
  const [cardIndex, setCardIndex] = useState();

  const { data } = useFirestore(
    colDocs.topCollection,
    colDocs.userName,
    colDocs.entriesCollection,
    entryIdFS,
    entryValueFS
  );

  console.log('data - ', data);

  //const cardDiv = document.querySelector('.cardDiv');

  //TODO:
  //- fix save button spawning multiple cards when no edit was made (this can be as part of a duplicate button in the future)
  // - implement current code with firebase

  function saveEntry() {
    if (!editValue) return;
    setEditMode(false);
    setCardClicked(false);
    //setSaveClicked(true);

    if (!cardClicked) {
      setEditValueArr([...editValueArr, { entry: editValue, id: counter }]);
      setCounter(counter + 1);
      setEntryIdFS(`Entry-${counter}`);
      setEntryValueFS(editValue);
      //setCardClicked(true);
    } else {
      editValueArr[cardIndex].entry = editValue;
      //setEntryIdFS(`Entry-${editValueArr[cardIndex]}`);
      setEntryIdFS(`${data[cardIndex].id}`);
      setEntryValueFS(editValue);
    }
  }

  function onCardClicked(editEntry, index) {
    setEditMode(true);
    setCardClicked(true);
    setCardIndex(index);
    setEditValue(editEntry.entry);
  }

  function toggleEditMode() {
    return setEditMode(!editMode);
  }

  // + button
  function createNewDiary() {
    setEditMode(true);
    setEditValue('');
    setCardClicked(false);
    //setCounter(counter + 1);
    //setNewEntry(true);
    //setCardVisibility(false);
  }

  return (
    <>
      <h1>Recents</h1>
      <p>Diary Page</p>
      <h1>Previous...</h1>
      <Button variant={'contained'} onClick={toggleEditMode}>
        Toggle Edit
      </Button>
      <Button variant={'outlined'} onClick={createNewDiary}>
        +
      </Button>
      <Button variant={'outlined'} onClick={saveEntry}>
        Save
      </Button>
      {editMode && (
        <ReactQuill theme='snow' value={editValue} onChange={setEditValue} />
      )}
      <div id='savedEntries'></div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {editValueArr.map((editEntry, index) => (
          <div
            key={editEntry.id}
            id={`cardDiv-${editEntry.id}`}
            className={'cardDiv'}
          >
            <Card
              id={'card'}
              variant={'outlined'}
              width={100}
              onClick={() => onCardClicked(editEntry, index)}
              innerHTML={editEntry.entry}
            ></Card>
          </div>
        ))}
      </div>
    </>
  );
};

export default DiaryPage;
