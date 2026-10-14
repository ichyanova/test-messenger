import { useState } from 'react';
import './App.css';
import Auth from './components/Auth/Auth';

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
      <div className='tg-content font-sans'>
        {!isAuthorized && <Auth onLogin={handleLogin} />}
        {isAuthorized && (
          <>
            <div className='w-80 md:w-96 flex flex-col border-r border-[#101924]'>
              Sidebar
            </div>
            <div className='flex-1 flex flex-col relative window-bg'>
              ChatWindow
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
