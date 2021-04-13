import {BrowserRouter, Switch, Route} from "react-router-dom";
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
      <BrowserRouter>
        <div className="App">
            <Switch>
                <ProtectedRoute exact path='/' to='sigh-in'>
                    <Home/>
                </ProtectedRoute>
                <Route exact path='/sign-in'>
                    <SignIn/>
                </Route>
                <Route exact path='/sign-up'>
                    <SignUp/>
                </Route>
            </Switch>
        </div>
      </BrowserRouter>
);
}

export default App;
