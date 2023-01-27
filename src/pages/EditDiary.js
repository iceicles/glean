import EditDiary from '../components/Editor';
import { Link } from 'react-router-dom';

function EditDiaryPage() {
  return (
    <>
      <h1>Edit Diary Page</h1>
      <p>
        Go to <Link to='/diary'>the diary page</Link>
      </p>
      <EditDiary />
    </>
  );
}

export default EditDiaryPage;
