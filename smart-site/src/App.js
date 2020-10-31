
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import  Home  from './components/home';
import { Route } from 'react-router-dom';
import { SignIn } from './components/signin';
import Header from './components/header';
import { Footer } from './components/footer';
import { Customer } from './components/customer';
import { Plans } from './components/plans';
import Contact from './components/contact';
import AuthContextProvider from './public/authContext';

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
      <Route path="/" exact>
        <Header />
        <Home />
        <Footer />
      </Route>
      <Route path="/signin" exact>
        <Header />
        <SignIn />
        <Footer />
      </Route>
      <Route path='/plans' exact>
        <Header />
        <Plans />
        <Footer />
      </Route>
      <Route path="/customer" exact>
        <Customer />
      </Route>
      <Route path='/contactus'>
        <Header />
        <Contact />
        <Footer />
      </Route>
      </AuthContextProvider>
    </div>
  );
}

export default App;
