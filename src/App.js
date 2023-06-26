import React from 'react';
import Content from './components'
import './css/app.scss';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'

function App() {
  return (

	<BrowserRouter>
		<div className="app">
			<Routes>
				<Route path='/:id' element={<Content/>}/>
				<Route path='*' element={<Navigate to={`f${(+new Date).toString(16)}`} replace/>}/>
			</Routes>
		</div>
	</BrowserRouter>

  );
}

export default App;
