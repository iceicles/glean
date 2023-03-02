import React, { useCallback, useEffect, useState, useRef } from 'react';
import useFirestore from '../hooks/useFirestore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from '@emotion/styled';
import EntryContainer from '../components/EntryContainer';

const Main = styled('main')({
  marginTop: '15vh',
  marginBottom: '13vh',
});

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

const Container = styled('div')({
  height: '100vh',
  display: 'flex',
  //alignItems: 'center',
  justifyContent: 'center',
  borderRight: '1px solid blue',
  borderLeft: '1px solid blue',
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
  const [showButtons, setShowButtons] = useState(false);
  const [enableSaveBtn, setEnableSaveBtn] = useState(false); //TODO: disable button when setEnableSaveBtn is false
  const [saveBtnClicked, setSaveBtnClicked] = useState(false);
  const [newEntryBtnClicked, setNewEntryBtnClicked] = useState(false);

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

  const newDataRef = useRef(0);

  // user can only save if the editValue has changed
  // i.e., it can be the same content - either more added or removed
  useEffect(() => {
    setEnableSaveBtn(true);
    //console.log('does this run?');
  }, [editValue]);

  function handleSaveEntry() {
    if (!editValue) return;
    //setEditMode(false);
    setCardClicked(false);
    setShowButtons(false);
    setSaveBtnClicked(true);

    //!!editValue && setSaveClicked(prev => prev.editValue != editValue ? true : false);
    console.log('[saveEntry()] enableSaveBtn - ', enableSaveBtn);

    if (enableSaveBtn) {
      console.log('in enableSaveBtn if block');
      (newDataRef.current === 0 || newEntryBtnClicked) &&
        setEntryIdFS(`Entry-${dataLength + 1}`);
      newDataRef.current = 1;
      setEntryValueFS(editValue);
      setNewEntryBtnClicked(false);
      setEnableSaveBtn(false);
      //console.log('newDataRef.current ->> ', newDataRef.current);
    } //else if (enableSaveBtn && newEntryClicked) {
    // if
    else {
      console.log('you need to edit your entry before clicking save again');
    }
    //setSaveClicked(true);
    if (cardClicked && enableSaveBtn) {
      console.log('in cardClicked && enableSaveBtn if block');
      data[cardIndex].entry = editValue;
      setEntryIdFS(`${data[cardIndex].id}`);
      setEntryValueFS(editValue);
      setEnableSaveBtn(false);
      // if (editMode) {
      // }
      // } else {
      //   // if the + button was clicked i.e., the user is creating a new entry
      //   data[cardIndex].entry = editValue;
      //   setEntryIdFS(`${data[cardIndex].id}`);
      //   setEntryValueFS(editValue);
    }
  }

  // useEffect to capture data length excluding the initial entry (i.e., '')
  useEffect(() => {
    let dataLength = data.length - 1;
    setDataLength(dataLength);
  }, [data]);

  function onCardClicked(editEntry, index) {
    //setEditMode(true);
    setCardClicked(true);
    setCardIndex(index);
    setEditValue(editEntry.entry);
    setShowButtons(true);
    setEnableSaveBtn(false);
    console.log('card clicked enable save btn - ', enableSaveBtn);
    // console.log('editValue - ', editValue);
    // console.log('editEntry.entry - ', editEntry.entry);
  }

  function onEditClicked() {
    //setEditMode(true);
    setShowButtons(false);
  }

  // function toggleEditMode() {
  //   return setEditMode(!editMode);
  // }

  // New button
  function handleCreateNewDiary() {
    //setEditMode(true);
    newDataRef.current = 0;
    setEditValue('');
    setCardClicked(false);
    setSaveBtnClicked(false);
    setNewEntryBtnClicked(true);
  }

  function onCancel() {
    // TODO: rename state name
    setShowButtons(false);
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
      <Main>
        <NewEntryDiv>
          <i>Create a new entry...</i>
          <Button onClick={handleCreateNewDiary}>New</Button>
        </NewEntryDiv>
        {/* <Button variant={'contained'} onClick={toggleEditMode}>
        Toggle Edit
      </Button> */}

        {/* <div style={{ display: 'flex', flexDirection: 'row' }}> */}

        <EntryContainer>
          <article>
            <ReactQuill
              theme='snow'
              value={editValue}
              onChange={setEditValue}
            />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button onClick={handleSaveEntry} disabled={!enableSaveBtn}>
                Save
              </Button>

              <Button disabled={!saveBtnClicked}>Favorite</Button>
              {/* <Button onClick={onEditClicked}>Edit</Button> */}
              <Button disabled={!saveBtnClicked}>Delete</Button>
              {/* <Button onClick={handleCreateNewDiary}>New</Button> */}
            </div>
          </article>
          <article
            style={{
              display: 'flex',
              flexFlow: 'row wrap',
              width: '100%',
              maxWidth: '60vh',
              gap: '5px',
            }}
          >
            {data &&
              data.slice(0, -1).map((editEntry, index) => (
                <React.Fragment key={index}>
                  {/* {showButtons && cardIndex === index && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Button>Favorite</Button>
                      <Button onClick={onEditClicked}>Edit</Button>
                      <Button>Delete</Button>
                      <Button onClick={onCancel}>Cancel</Button>
                    </div>
                  )} */}
                  <Card
                    key={index}
                    id={`cardDiv-${index}`}
                    alt={'a card entry'}
                    variant={'outlined'}
                    style={{
                      border:
                        cardClicked && cardIndex === index
                          ? '0.188rem solid green'
                          : '',
                    }}
                    onClick={() => onCardClicked(editEntry, index)}
                    innerHTML={editEntry.entry}
                  />
                </React.Fragment>
              ))}
          </article>
        </EntryContainer>
        {/* </div> */}
      </Main>
    </>
  );
};

export default DiaryPage;
