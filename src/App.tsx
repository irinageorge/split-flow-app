import './App.css'
import appIcon from "./assets/split.svg"
import SignIn from './componentsUI/SignIn'
import SignUp from './componentsUI/SignUp'

function App() {
  return (
    <div className="center">
      <div className="title-row">
        <h1 className="title">Welcome to SplitFlow</h1>
        <img src={appIcon} alt="app icon" className="app-icon" />
      </div>
      <div className="button-row">
        <SignIn />
        <SignUp />
      </div>
    </div>
  )
}

export default App
