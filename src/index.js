import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { library } from '@fortawesome/fontawesome-svg-core';

import { 
  faUser, 
  faCog, 
  faLock, 
  faCamera, 
  faEdit, 
  faCheck, 
  faTimes, 
  faEye, 
  faEyeSlash,
  faBell,
  faEnvelope,
  faPlus,
  faSearch,
  faPhone,
  faVideo,
  faEllipsisV,
  faPaperPlane,
  faPaperclip,
  faSmile,
  faChevronDown,
  faSignOutAlt,
  faQuestionCircle,
  faUsers,
  faShield,
  faChartBar,
  faFileAlt,
  faTrash,
  faFilter,
  faDownload,
  faUpload
} from '@fortawesome/free-solid-svg-icons';


library.add(
  faUser, 
  faCog, 
  faLock, 
  faCamera, 
  faEdit, 
  faCheck, 
  faTimes, 
  faEye, 
  faEyeSlash,
  faBell,
  faEnvelope,
  faPlus,
  faSearch,
  faPhone,
  faVideo,
  faEllipsisV,
  faPaperPlane,
  faPaperclip,
  faSmile,
  faChevronDown,
  faSignOutAlt,
  faQuestionCircle,
  faUsers,
  faShield,
  faChartBar,
  faFileAlt,
  faTrash,
  faFilter,
  faDownload,
  faUpload
);



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
