import './App.css';
import { useAuthContext } from './context/use-auth-context';
import Auth from './components/Auth/Auth';
import Chat from './components/Chat/Chat';

const App = () => {
  const { isAuth } = useAuthContext();

  return (
    <div className='tg-bg'>
      <div className='tg-content font-sans gap-2'>
        {!isAuth ? <Auth /> : <Chat />}
      </div>
    </div>
  );
};

export default App;
