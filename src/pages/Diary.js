import React, { useCallback, useEffect, useState, useRef } from 'react';
import useFirestore from '../hooks/useFirestore';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import EntryContainer from '../components/EntryContainer';
import TextEditor from '../components/TextEditor';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAuth } from 'firebase/auth';
import styled from '@emotion/styled';
import DOMPurify from 'dompurify';

const DiaryPage = () => {
  const [editorValue, setEditorValue] = useState('');
  const [entryIdFS, setEntryIdFS] = useState('No Entry');
  const [entryValueFS, setEntryValueFS] = useState();
  const [cardIndex, setCardIndex] = useState();
  const [dataLength, setDataLength] = useState();
  const [disableFavBtn, setDisableFavBtn] = useState(true);
  const [disableDelBtn, setDisableDelBtn] = useState(true);
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [userCanSave, setUserCanSave] = useState(false);
  const [newEntryBtnClicked, setNewEntryBtnClicked] = useState(false);
  const [cardClicked, setCardClicked] = useState(false);
  const [cardClickedEntryId, setCardClickedEntryId] = useState({
    cardEntry: '',
    cardId: '',
  });
  const [saveClicked, setSaveClicked] = useState(false);
  const [error, setError] = useState();
  const [saveError, setSaveError] = useState();

  const navigate = useNavigate();

  const { logout } = useAuth();
  const { currentUser } = getAuth(); // fixes currentUser.email issue being null

  const getUserName = useCallback(() => {
    const indexOfAt = currentUser.email.split('').indexOf('@');
    const userName = currentUser.email.slice(0, indexOfAt);
    return userName;
  }, [currentUser]);

  // TODO: fix an issue where, whenever a user logs in, a blank card shows up when user tries to edit or add new entries
  const colDocs = {
    topCollection: 'Users',
    userName: currentUser.email,
    entriesCollection: 'Entries',
  };

  const { data } = useFirestore(
    colDocs.topCollection,
    colDocs.userName,
    colDocs.entriesCollection,
    entryIdFS, // 'entry-0, entry-1, entry-2...
    entryValueFS, // this is the culprit - need to make sure this has a value but not the empty string value which always gets a new time stamp
    editorValue
  );

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
  }, [editorValue]);

  /* useEffect to handle the case where 
  -if the card is clicked and the editorValues are the same, save button is disabled until they're not
  */
  useEffect(() => {
    // if the card is clicked and the edit value is the same as the entry in firestore
    if (cardClicked) {
      if (editorValue === data[cardIndex].entry) {
        setDisableSaveBtn(true);
      }
    }
  }, [editorValue, cardClicked, cardIndex, data]);

  /* checks if a card is clicked and the user makes an edit, and then clicks another card */
  // TODO: throw a toast/modal when user clicks different card
  // TODO: this should also apply for when user makes an edit and they try to log off before saving
  const checkNoSaveOnEntryEdit = () => {
    if (cardClicked && editorValue !== cardClickedEntryId.cardEntry) {
      if (saveClicked === false) {
        setSaveError('hmmmm are you sure you want to leave without saving');
      }
    }
  };

  /* handles save click */
  const handleSaveEntry = () => {
    if (!editorValue) return;

    if (!cardClicked && userCanSave) {
      // user is making a new entry
      (newEntryRef.current === 0 || newEntryBtnClicked) &&
        setEntryIdFS(`Entry-${dataLength + 1}`);
      newEntryRef.current = 1;
      setEntryValueFS(editorValue);
      setNewEntryBtnClicked(false);
      setUserCanSave(false);
      setDisableFavBtn(false);
      setDisableDelBtn(false);
      setDisableSaveBtn(true);
      setSaveError(null);
      setSaveClicked(true);
    } else if (cardClicked && userCanSave) {
      // user is editing a card
      data[cardIndex].entry = editorValue;
      setEntryIdFS(`${data[cardIndex].id}`);
      setEntryValueFS(editorValue);
      setCardClicked(false);
      setUserCanSave(false);
      setDisableFavBtn(false);
      setDisableDelBtn(false);
      setDisableSaveBtn(true);
      setSaveClicked(true);
    }
    setSaveClicked(false);
  };

  /* handles card click*/
  const handleCardClicked = (editEntry, index) => {
    setCardClicked(true);
    setCardClickedEntryId({ cardEntry: editEntry.entry, cardId: editEntry.id });
    setCardIndex(index);
    setEditorValue(editEntry.entry);
    setDisableSaveBtn(true);
    setDisableFavBtn(false);
    setDisableDelBtn(false);
    checkNoSaveOnEntryEdit();
  };

  /* handles new button click */
  const handleCreateNewEntry = () => {
    // resets newEntryRef to 0 to allow for additional entry ids
    newEntryRef.current = 0;
    setEditorValue('');
    setCardClicked(false);
    setDisableFavBtn(true);
    setDisableDelBtn(true);
    setNewEntryBtnClicked(true);
  };

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
          <EditorAndCardRow id='row'>
            <TextEditorArticle>
              <TextEditor
                theme='snow'
                placeholder='Let your imagination flow...'
                value={editorValue}
                onChange={setEditorValue}
              />
              {/* </article> */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={handleSaveEntry} disabled={disableSaveBtn}>
                  Save
                </Button>
                <Button disabled={disableFavBtn}>Favorite</Button>
                <Button disabled={disableDelBtn}>Delete</Button>
              </div>
              <p>{saveError}</p>
            </TextEditorArticle>
            <CardArticleContainer>
              <CardArticleRow>
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
              </CardArticleRow>
            </CardArticleContainer>
          </EditorAndCardRow>
        </EntryContainer>
        {/* </div> */}
      </Section>
    </>
  );
};

export default DiaryPage;

/* --- STYLES --- */

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
  cursor: 'pointer', // TODO: needs to be added as common style for links and buttons
});

const Section = styled('section')({
  marginTop: '15vh',
  marginBottom: '13vh',
});

const NewEntryDiv = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
});

const EditorAndCardRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '60px',
  //border: '1px solid red',
  height: '100%',
  width: '100%',
  '@media (max-width: 480px)': {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const TextEditorArticle = styled('article')({
  height: '90%',
  width: '50%',
  //border: '1px dotted blue',
});

const CardArticleContainer = styled('div')({
  overflow: 'auto',
  width: '50%',
  backgroundColor: 'rgba(140, 145, 171, 0.2)',

  // TODO: need media queries for common css rules
  '@media (min-width: 960px)': {
    width: '50%',
  },

  '@media (min-width: 1200px)': {
    width: '50%',
  },
});

const CardArticleRow = styled('article')({
  display: 'flex',
  justifyContent: 'flex-start',
  flexFlow: 'row wrap',
  gap: '10px',

  '@media (max-width: 480px)': {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 0,
    //alignContent: 'flex-end',
  },
  '@media (min-width: 1200px)': {
    width: '100%',
  },
});
