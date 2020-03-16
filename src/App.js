import React,  { useState } from 'react';
import './App.css';
import MyNavbar from './MyNavbar';
import NewsBar from './NewsBar';





function App() {
  return (
      <div>
        <MyNavbar/>
        <div class="news">
          <NewsBar/>
            <NewsBar/>
            <NewsBar/>
        </div>
      </div>

  );
}

export default App;
