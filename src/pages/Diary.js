import html2canvas from 'html2canvas';
import { useState } from 'react';
import useFirestore from '../hooks/useFirestore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function DiaryPage() {
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [canvasClicked, setCanvasClicked] = useState(false);
  const [canvasClickedId, setCanvasClickedId] = useState('');
  const [entryIdFS, setEntryIdFS] = useState('');
  const [entryValueFS, setEntryValueFS] = useState('');

  function setId(idName) {
    let canvases = document.querySelectorAll('canvas');
    let id;
    for (let i = 0; i < canvases.length; i++) {
      id = `${idName}-${i}`;
    }
    return id;
  }

  useFirestore('Users', 'Jon', 'Entries', entryIdFS, entryValueFS);

  /**
   * This function should only run when the user creates a new diary, and clicks save.
   * We only want to take a screenshot once.
   */
  function takeScreenshot() {
    var editor = document.querySelector('.ql-editor');

    html2canvas(editor, {
      width: 300,
      height: 200,
    }).then(function (canvas) {
      // check if user types in editor else don't do anything (should throw error later)
      if (!editValue) return;

      // reset state values
      setCanvasClicked(false);
      setEditMode(false);

      // we only want to append a new child canvas if an existing canvas was not clicked
      if (!canvasClicked) {
        document.body.appendChild(canvas);
        canvas.setAttribute('id', setId('canv'));
        setEntryIdFS(setId('Entry'));
        setEntryValueFS(editValue);
      } else {
        // if the newly created entry was clicked (AND TODO: check if canvas text differs (i.e., was edited))
        // create new snapshot with new entry and replace old canvas
        let canvasClickedQueried = document.body.querySelector(
          `canvas[id=${canvasClickedId}]`
        );

        html2canvas(editor, {
          width: 300,
          height: 200,
        }).then(function (canvas) {
          // reset state values
          setCanvasClicked(false);
          setEditMode(false);
          // replace with new canvas snapshot
          canvasClickedQueried.replaceWith(canvas);
          // set new canvas snapshot to the id of the canvas that was previously clicked
          canvas.setAttribute('id', `${canvasClickedId}`);
          setEntryIdFS(setId('Entry'));
          setEntryValueFS(editValue);

          // then add a new event listener in case of any new edits
          canvas.addEventListener('click', function () {
            setEditMode(true);
            setEditValue(editValue);
            setCanvasClicked(true);

            // save id of canvas clicked in state
            const canvasId = canvas.getAttribute('id');
            setCanvasClickedId(canvasId);
          });
        });
      }

      canvas.addEventListener('click', function () {
        setEditMode(true);
        setEditValue(editValue);
        setCanvasClicked(true);

        // save id of canvas clicked in state
        const canvasId = canvas.getAttribute('id');
        setCanvasClickedId(canvasId);
      });
    });
  }

  function toggleEditMode() {
    return setEditMode(!editMode);
  }

  function createNewDiary() {
    setEditMode(true);
    setEditValue('');
  }

  return (
    <>
      <h1>Recents</h1>
      <p>Diary Page</p>
      <h1>Previous...</h1>
      <button onClick={toggleEditMode}>Toggle Edit</button>
      <button onClick={takeScreenshot}>Save</button>
      <button onClick={createNewDiary}>Create New Diary</button>
      {editMode && (
        <ReactQuill theme='snow' value={editValue} onChange={setEditValue} />
      )}
    </>
  );
}

export default DiaryPage;
