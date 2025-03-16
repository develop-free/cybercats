import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './Pages/Home/homePage';
import Authorization from './Pages/AuthorizationRegistration/authoriz_regPage'
import PersonalAccount from './Pages/PersonalAccount/personal_account'
import './styles/config.css'

    const App = () => {
      return (
          <Router>
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/authorization" element={<Authorization />} />
                  <Route path="/personal_account/*" element={<PersonalAccount />} />
              </Routes>
          </Router>
      );
  };


export default App;
