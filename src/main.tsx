import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AuthContextProvider } from './context/use-auth-context';
import { ChatContextProvider } from './context/use-chat-context';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <ChatContextProvider>
        <App />
      </ChatContextProvider>
    </AuthContextProvider>
  </StrictMode>,
);
