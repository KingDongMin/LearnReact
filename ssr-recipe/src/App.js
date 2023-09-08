import Menu from './components/Menu';
import {Route, Routes} from 'react-router-dom';
import RedPage from './pages/RedPage';
import BluePage from './pages/BluePage';

function App() {
  return (
    <div>
      <Menu/>
      <hr/>
      <Routes>
        <Route path="/red" element={<RedPage/>}></Route>
        <Route path="/blue" element={<BluePage/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
