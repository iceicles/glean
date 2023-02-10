import { useEffect, useState } from 'react';
import useFirestore from '../hooks/useFirestore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ButtonMUI as Button } from '../components/Button';
import { CardMUI as Card } from '../components/Card';

const colDocs = {
  topCollection: 'Users',
  userName: 'Jon',
  entriesCollection: 'Entries',
};

const DiaryPage = () => {
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [cardClicked, setCardClicked] = useState(false);
  const [entryIdFS, setEntryIdFS] = useState('No Entry');
  const [entryValueFS, setEntryValueFS] = useState(editValue);
  const [cardIndex, setCardIndex] = useState();
  const [dataLength, setDataLength] = useState();

  const { data } = useFirestore(
    colDocs.topCollection,
    colDocs.userName,
    colDocs.entriesCollection,
    entryIdFS,
    entryValueFS,
    editValue
  );

  function saveEntry() {
    if (!editValue) return;
    setEditMode(false);
    setCardClicked(false);

    if (!cardClicked) {
      editMode && setEntryIdFS(`Entry-${dataLength + 1}`);
      editMode && setEntryValueFS(editValue);
    } else {
      data[cardIndex].entry = editValue;
      setEntryIdFS(`${data[cardIndex].id}`);
      setEntryValueFS(editValue);
    }
  }

  useEffect(() => {
    let dataLength = data.length - 1;
    setDataLength(dataLength);
  }, [data]);

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
        {data.slice(0, -1).map((editEntry, index) => (
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
