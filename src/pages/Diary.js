import html2canvas from 'html2canvas';
import { useEffect, useState } from 'react';
import EditDiary from '../components/Editor';
import Modal from '../components/Modal';

function DiaryPage() {
  const [editMode, setEditMode] = useState(false);

  /**
   * This function should only run when the user creates a new diary, and clicks save.
   * We only want to take a screenshot once.
   */
  function takeScreenshot() {
    var textarea = document.querySelector('.rdw-editor-main');

    html2canvas(textarea, {
      width: 300,
      height: 200,
    }).then(function (canvas) {
      document.body.appendChild(canvas);
    });
  }

  function toggleEditMode() {
    return setEditMode(!editMode);
  }

  return (
    <>
      <h1>Recents</h1>
      <p>Diary Page</p>
      <h1>Previous...</h1>
      <button onClick={toggleEditMode}>Toggle Edit</button>
      <button onClick={takeScreenshot}>Save</button>
      {editMode && <EditDiary />}
    </>
  );
}

export default DiaryPage;
