import { useEffect, useState } from 'react';
import useFirestore from '../hooks/useFirestore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/contexts/AuthContext';

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
  const [error, setError] = useState();

  const { currentUser, logout } = useAuth();

  const navigate = useNavigate();

  const { data } = useFirestore(
    colDocs.topCollection,
    colDocs.userName,
    colDocs.entriesCollection,
    entryIdFS,
    entryValueFS,
    editValue
  );

  //TODO: need to fix logout - null errors in console
  const handleLogout = async () => {
    setError('');
    try {
      await logout();
      navigate('/');
    } catch {
      setError('Failed to log out');
    }
  };

  function saveEntry() {
    if (!editValue) return;
    setEditMode(false);
    setCardClicked(false);

    if (!cardClicked) {
      if (editMode) {
        setEntryIdFS(`Entry-${dataLength + 1}`);
        setEntryValueFS(editValue);
      }
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
      {error && <h1 style={{ color: 'red' }}>{error}</h1>}
      <h1>Recents</h1>
      <p>Diary Page</p>
      <h1>Previous...</h1>
      <h2>
        Email: <i>{currentUser.email}</i>
      </h2>
      <Link to='..'>Go Back</Link>
      <Button variant={'contained'} onClick={toggleEditMode}>
        Toggle Edit
      </Button>
      <Button variant={'outlined'} onClick={createNewDiary}>
        +
      </Button>
      <Button variant={'outlined'} onClick={saveEntry}>
        Save
      </Button>
      <Button variant={'contained'} onClick={handleLogout}>
        Log Out
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
