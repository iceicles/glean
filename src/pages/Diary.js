import React, { useCallback, useEffect, useState, useRef } from 'react';
import useFirestore from '../hooks/useFirestore';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from '@emotion/styled';
import EntryContainer from '../components/EntryContainer';
import TextEditor from '../components/TextEditor';
import DOMPurify from 'dompurify';

const Section = styled('section')({
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
  const [editorValue, setEditorValue] = useState('');
  const [cardClicked, setCardClicked] = useState(false);
  const [entryIdFS, setEntryIdFS] = useState('No Entry');
  const [entryValueFS, setEntryValueFS] = useState(editorValue);
  const [cardIndex, setCardIndex] = useState();
  const [dataLength, setDataLength] = useState();
  const [error, setError] = useState();
  const [disableFavBtn, setDisableFavBtn] = useState(true);
  const [disableDelBtn, setDisableDelBtn] = useState(true);
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [userCanSave, setUserCanSave] = useState(false);
  const [newEntryBtnClicked, setNewEntryBtnClicked] = useState(false);
  const [saveError, setSaveError] = useState();

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
    editorValue
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

  /* Ref to keep track of when the user clicks 'New' button */
  const newEntryRef = useRef(0);

  // [DONE] TODO: disable save button at first then enable when user starts typing
  // [DONE] TODO: make sure when a card is clicked the save btn is disabled until user starts..
  // ...typing, then it should be enabled

  /* useEffect to capture data length excluding the initial entry (i.e., '') */
  useEffect(() => {
    let dataLength = data.length - 1;
    setDataLength(dataLength);
  }, [data]);

  /* useEffect to handle different saving scenarios based on edit value
  - user can only save if the editorValue has changed - i.e., non empty or <p><br></p> values
  - save button is disabled when backspace is pressed resulting in <p><br></p>
  - if the card is clicked and the editorValues are the same, save button is disabled until they're not
  */
  useEffect(() => {
    // if there edit value is a string other than empty string
    // enable save button and allow user to save
    if (!!editorValue) {
      setDisableSaveBtn(false);
      setUserCanSave(true);
    }
    // handles the case where backspace is pressed, editorValue is <p><br></p> - weird :/
    if (editorValue === '<p><br></p>') {
      setDisableSaveBtn(true);
      return;
    }
    // if the card is clicked and the edit value is the same as the entry in firestore
    if (cardClicked) {
      if (editorValue === data[cardIndex].entry) {
        setDisableSaveBtn(true);
      }
    }
  }, [editorValue]);

  /* handles save click */
  function handleSaveEntry() {
    if (!editorValue) return;

    if (!cardClicked && userCanSave) {
      (newEntryRef.current === 0 || newEntryBtnClicked) &&
        setEntryIdFS(`Entry-${dataLength + 1}`);
      newEntryRef.current = 1;
      setEntryValueFS(editorValue);
      setNewEntryBtnClicked(false);
      setUserCanSave(false);
      setDisableFavBtn(false);
      setDisableDelBtn(false);
      setSaveError(null);
    } else if (cardClicked && userCanSave) {
      data[cardIndex].entry = editorValue;
      setEntryIdFS(`${data[cardIndex].id}`);
      setEntryValueFS(editorValue);
      setCardClicked(false);
      setUserCanSave(false);
    } else {
      setSaveError('You need to edit your entry before clicking save again.');
    }
  }

  /* handles card click*/
  function handleCardClicked(editEntry, index) {
    setCardClicked(true);
    setCardIndex(index);
    setEditorValue(editEntry.entry);
    setDisableSaveBtn(true);
  }

  /* handles new button click */
  function handleCreateNewEntry() {
    // resets newEntryRef to 0 to allow for additional entry ids
    newEntryRef.current = 0;
    setEditorValue('');
    setCardClicked(false);
    setDisableFavBtn(true);
    setDisableDelBtn(true);
    setNewEntryBtnClicked(true);
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
      <Section>
        <NewEntryDiv>
          <i>Create a new entry...</i>
          <Button onClick={handleCreateNewEntry}>New</Button>
        </NewEntryDiv>
        <EntryContainer>
          <article>
            <TextEditor
              theme='snow'
              placeholder='Let your imagination flow...'
              value={editorValue}
              onChange={setEditorValue}
            />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button onClick={handleSaveEntry} disabled={disableSaveBtn}>
                Save
              </Button>
              <Button disabled={disableFavBtn}>Favorite</Button>
              <Button disabled={disableDelBtn}>Delete</Button>
            </div>
            <p>{saveError}</p>
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
                    onClick={() => handleCardClicked(editEntry, index)}
                    innerHTML={DOMPurify.sanitize(editEntry.entry)}
                  />
                </React.Fragment>
              ))}
          </article>
        </EntryContainer>
        {/* </div> */}
      </Section>
    </>
  );
};

export default DiaryPage;
