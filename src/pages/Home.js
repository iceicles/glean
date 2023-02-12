import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <>
      <h1>Home Page</h1>
      <h2>Welcome to Glean!</h2>
      <p>Log in or Sign up to get started</p>
      <p>
        Go to <Link to='/diary'>the diary page</Link>
      </p>
      <p>
        <Link to='/auth?mode=login'>Sign In</Link>
      </p>
    </>
  );
}

export default HomePage;
