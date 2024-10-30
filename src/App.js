import './App.css';
import Navbar from './Components/Navbar';
import News from './Components/News';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LoadingBar from 'react-top-loading-bar';
import React, { useState } from 'react';

function App() {
  // Use useState to manage progress
  const [progress, setProgress] = useState(0);
  
  return (
    <>
      <Router>
        <Navbar />
        {/* Add LoadingBar at the top */}
        <LoadingBar color='#f11946' progress={progress} onLoaderFinished={() => setProgress(0)} />

        <Routes>
          {/* Define the home route */}
          <Route path="/" element={<News setProgress={setProgress}  key="general" category="general" />} />
          
          {/* Define routes for each category */}
          <Route path="/science" element={<News setProgress={setProgress}  key="science" category="science" />} />
          <Route path="/sports" element={<News setProgress={setProgress} key="sports" category="sports" />} />
          <Route path="/business" element={<News setProgress={setProgress} key="business" category="business" />} />
          <Route path="/entertainment" element={<News setProgress={setProgress}  key="entertainment" category="entertainment" />} />
          <Route path="/technology" element={<News setProgress={setProgress}  key="technology" category="technology" />} />
          <Route path="/health" element={<News setProgress={setProgress}  key="health" category="health" />} />
          <Route path="/general" element={<News setProgress={setProgress}  key="general-page" category="general" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
