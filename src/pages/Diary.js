import { useCallback, useEffect, useState } from 'react';
import useFirestore from '../hooks/useFirestore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from '@emotion/styled';

const Header = styled('header')({
  display: 'flex',
  justifyContent: 'space-between',
  margin: '0.9rem',
});

const LogOutBtn = styled(Button)({
  borderRadius: '0.25rem',
  padding: '0.9rem',
  width: 'fit-content',
  textDecoration: 'none',
  backgroundColor: 'green',
  cursor: 'pointer', // needs to be added as common style for links and buttons
});

const NewEntryBtn = styled('button')({
  display: 'block',
  height: '18.75rem',
  width: '18.75rem',
  backgroundColor: 'lightgreen',
  borderRadius: '50%',
  fontSize: '12.5rem',
  cursor: 'pointer',
});

const NewEntryDiv = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
});

const DiaryPage = () => {
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [cardClicked, setCardClicked] = useState(false);
  const [entryIdFS, setEntryIdFS] = useState('No Entry');
  const [entryValueFS, setEntryValueFS] = useState(editValue);
  const [cardIndex, setCardIndex] = useState();
  const [dataLength, setDataLength] = useState();
  const [error, setError] = useState();

  const navigate = useNavigate();

  const { currentUser, logout } = useAuth();

  const getUserName = useCallback(() => {
    const indexOfAt = currentUser.email.split('').indexOf('@');
    const userName = currentUser.email.slice(0, indexOfAt);
    return userName;
  }, [currentUser]);

  //TODO: fix email property of null err being thrown in console

  const colDocs = {
    topCollection: 'Users',
    userName: currentUser.email,
    entriesCollection: 'Entries',
  };

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

  // function toggleEditMode() {
  //   return setEditMode(!editMode);
  // }

  // + button
  function createNewDiary() {
    setEditMode(true);
    setEditValue('');
    setCardClicked(false);
  }

  return (
    <>
      <Header>
        <h2>
          {'Hello, '} <i>{currentUser && getUserName()}</i>
          <span> 🙂</span>
        </h2>
        <LogOutBtn variant={'outlined'} onClick={handleLogout}>
          Log Out
        </LogOutBtn>
      </Header>
      {error && <h1 style={{ color: 'red' }}>{error}</h1>}
      <h1>Recents</h1>
      <NewEntryDiv>
        <i>Create a new entry...</i>
        <NewEntryBtn onClick={createNewDiary}> + </NewEntryBtn>
      </NewEntryDiv>
      <h1>Previous</h1>
      {/* <Button variant={'contained'} onClick={toggleEditMode}>
        Toggle Edit
      </Button> */}
      {editMode && (
        <ReactQuill theme='snow' value={editValue} onChange={setEditValue} />
      )}
      {editMode && (
        <Button variant={'outlined'} onClick={saveEntry}>
          Save
        </Button>
      )}
      <div id='savedEntries'></div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {data &&
          data.slice(0, -1).map((editEntry, index) => (
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
