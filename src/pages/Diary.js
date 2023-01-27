import html2canvas from 'html2canvas';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function DiaryPage() {
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');

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
      if (!editValue) return;
      document.body.appendChild(canvas);
      setEditMode(false);

      console.log('value outside click - ', editValue);

      canvas.addEventListener('click', function () {
        console.log('canvas clicked');
        console.log('value - ', editValue);
        setEditMode(true);
        // how to get the value from the canvas and use that to fill the text editor??
        setEditValue(editValue);
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
