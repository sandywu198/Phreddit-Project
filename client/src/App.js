// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import {MetaData} from './components/phreddit.js'
// import {PostPageView, PageNameSortingButtons} from './components/page views.js'
// import Model from '../src/models/model.js';
import React from "react";
import {WelcomePage} from './components/welcomePage.js'
// import axios from 'axios';



function App() {
  const AppContent = () => {
    try {
      // throw new Error('Simulated error');
      return (
        <>
          <MetaData />
          {WelcomePage()}
        </>
      );
    } catch (error) {
      console.error('Caught an error:', error);
      return (<h1>An error has occurred. Please refresh or restart the frontend and backend.</h1>);
    }
  };
  return (
    // <ModelStateContext.Provider value={{model}}>
    <div>
      {AppContent()}
    </div>
    // </ModelStateContext.Provider>
  );
}

export default App;