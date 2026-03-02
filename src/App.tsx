import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TaskAdd } from './pages/TaskAdd';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/add" element={<TaskAdd />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App;
