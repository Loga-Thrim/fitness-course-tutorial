import { Switch, Route } from 'react-router-dom';
import InsertCouse from './pages/InsertCouse';
import ListCourse from './pages/ListCourse';
import ShowCourse from './pages/ShowCourse';
import CheckBill from './pages/CheckBill';
import Login from './pages/Login';
import InsertLevel from './pages/InsertLevel';
import Uploadvideos from './pages/Uploadvideos';

import LoginCheck from './components/LoginCheck';

function App() {
  return (
    <div>
      <Switch>
        <Route path="/" exact>
          <InsertCouse/>
        </Route>
        <Route path="/list">
          <ListCourse/>
        </Route>
        <Route path="/insert-level">
          <InsertLevel />
        </Route>
        <Route path="/list-one/:id">
          <ShowCourse/>
        </Route>
        <Route path="/check-bill">
          <CheckBill/>
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/upload-videos">
          <Uploadvideos />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
