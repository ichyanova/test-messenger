import { useState } from 'react';
import './App.css';
import Auth from './components/Auth/Auth';
import Main from './components/Main/Main';

function App() {
  const [userData, setUserData] = useState({
    idInstance: '',
    apiTokenInstance: '',
  });
  const handleLogin = (idInstance: string, apiTokenInstance: string) => {
    setUserData({ idInstance, apiTokenInstance });
  };
  const isAuthorized = userData.idInstance && userData.apiTokenInstance;

  return (
    <div className='tg-bg'>
      <div className='tg-content font-sans gap-2'>
        {!isAuthorized && <Auth onLogin={handleLogin} />}
        {isAuthorized && <Main userData={userData} />}
      </div>
    </div>
  );
}

export default App;
