import { useState } from 'react';
import './App.css';
import Auth from './components/Auth/Auth';
import Sidebar from './components/Sidebar/Sidebar';

function App() {
  const [loginData, setLoginData] = useState({
    idInstance: '',
    apiTokenInstance: '',
  });
  const handleLogin = (idInstance: string, apiTokenInstance: string) => {
    setLoginData({ idInstance, apiTokenInstance });
  };
  const isAuthorized = loginData.idInstance && loginData.apiTokenInstance;

  return (
    <div className='tg-bg'>
      <div className='tg-content font-sans gap-2'>
        {!isAuthorized && <Auth onLogin={handleLogin} />}
        {isAuthorized && (
          <>
            <div className='w-80 md:w-96 flex flex-col p-4'>
              <Sidebar />
            </div>
            <div className='flex-1 flex flex-col relative p-4'>ChatWindow</div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
