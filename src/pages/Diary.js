import React, { useCallback, useEffect, useState, useMemo } from 'react';
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
import deleteDocFS from '../hooks/deleteDocFS';

const DiaryPage = () => {
  const [editorValue, setEditorValue] = useState('');
  const [entryValueFS, setEntryValueFS] = useState();
  const [updatedEntryFS, setUpdatedEntryFS] = useState();
  const [entryIdFS, setEntryIdFS] = useState();
  const [cardIndex, setCardIndex] = useState();
  const [disableFavBtn, setDisableFavBtn] = useState(true);
  const [disableDelBtn, setDisableDelBtn] = useState(true);
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [userCanSave, setUserCanSave] = useState(false);
  const [cardClicked, setCardClicked] = useState(false);
  const [saveClicked, setSaveClicked] = useState(false);
  const [delBtnClicked, setDelBtnClicked] = useState(false);
  const [cardClickedEntryId, setCardClickedEntryId] = useState({
    cardEntry: '',
    cardId: '',
  });
  const [error, setError] = useState();
  const [saveError, setSaveError] = useState();
  const [yesDelete, setYesDelete] = useState(false);

  const navigate = useNavigate();

  const { logout } = useAuth();
  const { currentUser } = getAuth(); // fixes currentUser.email issue being null

  const getUserName = useCallback(() => {
    const indexOfAt = currentUser.email.split('').indexOf('@');
    const userName = currentUser.email.slice(0, indexOfAt);
    return userName;
  }, [currentUser]);

  const colDocs = {
    topCollection: 'Users',
    userName: currentUser.email,
    entriesCollection: 'Entries',
  };

  const getDocToDelete = useMemo(() => {
    if (delBtnClicked) {
      return `${cardClickedEntryId.cardId}`;
    }
  }, [delBtnClicked, cardClickedEntryId.cardId]);

  const yesDeleteHandler = () => {
    setEditorValue('');
    setYesDelete(true);
    setCardClicked(false);
  };

  const noDeleteHandler = () => {
    setDelBtnClicked(false);
    setCardClicked(true);
    setDisableFavBtn(false);
    setDisableDelBtn(false);
  };

  // useEffect to reset item to delete
  useEffect(() => {
    if (delBtnClicked) {
      setDisableFavBtn(true);
      setDisableDelBtn(true);
    }
  }, [delBtnClicked]);

  deleteDocFS(
    colDocs.topCollection,
    colDocs.userName,
    colDocs.entriesCollection,
    yesDelete && getDocToDelete
  );

  const { data } = useFirestore(
    colDocs.topCollection,
    colDocs.userName,
    colDocs.entriesCollection,
    entryValueFS,
    updatedEntryFS,
    entryIdFS
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

  /* useEffect to handle different saving scenarios based on edit value
  - user can only save if the editorValue has changed - i.e., non empty or <p><br></p> values
  - save button is disabled when backspace is pressed resulting in <p><br></p>
  */
  useEffect(() => {
    // if the edit value is a string other than empty string
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
    if (cardClicked) {
      if (
        editorValue === cardClickedEntryId.cardEntry &&
        delBtnClicked === false
      ) {
        setDisableSaveBtn(true);
      }
    }
  }, [cardClicked, editorValue, delBtnClicked, cardClickedEntryId.cardEntry]);

  /* checks if a card is clicked and the user makes an edit, and then clicks another card */
  // TODO: throw a toast/modal when user clicks different card
  // TODO: this should also apply for when user makes an edit and they try to log off before saving
  const checkNoSaveOnEntryEdit = () => {
    if (cardClicked && editorValue !== cardClickedEntryId.cardEntry) {
      if (saveClicked === false && delBtnClicked === false) {
        setSaveError('hmmmm are you sure you want to leave without saving');
      }
    }
  };

  /* handles save click */
  const handleSaveEntry = () => {
    if (!editorValue) return;

    if (!cardClicked && userCanSave) {
      // user is making a new entry
      setEntryValueFS(editorValue);
      setEditorValue('');
      setDelBtnClicked(false);
      setUserCanSave(false);
      setDisableFavBtn(false);
      setDisableSaveBtn(true);
      setSaveError(null);
      setSaveClicked(true);
    } else if (cardClicked && userCanSave) {
      // user is editing a card
      setEntryIdFS(`${cardClickedEntryId.cardId}`);
      setUpdatedEntryFS(editorValue);
      setCardClicked(false);
      setUserCanSave(false);
      setDisableFavBtn(false);
      setDisableDelBtn(false);
      setDisableSaveBtn(true);
      setSaveClicked(true);
    }
    setSaveClicked(false);
  };

  /* handles card delete */
  const handleDeleteEntry = () => {
    setDelBtnClicked(true);
  };

  /* handles card click*/
  const handleCardClicked = (editEntry, index) => {
    setCardClicked(true);
    setDelBtnClicked(false);
    setCardClickedEntryId({
      cardEntry: editEntry.entry,
      cardId: editEntry.id,
    });
    setCardIndex(index);
    setEditorValue(editEntry.entry);
    setDisableSaveBtn(true);
    setDisableFavBtn(false);
    setDisableDelBtn(false);
    checkNoSaveOnEntryEdit();
    setYesDelete(false);
  };

  /* handles new button click */
  const handleCreateNewEntry = () => {
    setEditorValue('');
    setEntryValueFS();
    setEntryIdFS();
    setUpdatedEntryFS();
    setCardClicked(false);
    setDelBtnClicked(false);
    setDisableFavBtn(true);
    setDisableDelBtn(true);
    setYesDelete(false);
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
        {delBtnClicked && (
          <div>
            Are you sure you want to delete?
            <button onClick={yesDeleteHandler}>Yes</button>
            <button onClick={noDeleteHandler}>No</button>
          </div>
        )}
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
                readOnly={delBtnClicked}
              />
              {/* </article> */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={handleSaveEntry} disabled={disableSaveBtn}>
                  Save
                </Button>
                <Button disabled={disableFavBtn}>Favorite</Button>
                <Button onClick={handleDeleteEntry} disabled={disableDelBtn}>
                  Delete
                </Button>
              </div>
              <p>{saveError}</p>
            </TextEditorArticle>
            <CardArticleContainer>
              <CardArticleRow>
                {data &&
                  data.map((editEntry, index) => (
                    <React.Fragment key={index}>
                      <Card
                        key={index}
                        id={`cardDiv-${index}`}
                        alt={'a card entry'}
                        variant={'outlined'}
                        style={{
                          border:
                            cardClicked &&
                            cardIndex === index &&
                            delBtnClicked === false
                              ? '0.188rem solid black'
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
