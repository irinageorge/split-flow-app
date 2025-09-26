import './Login.css'
import appIcon from "../assets/split.svg"
import globeImg from "../assets/navigation.png"
import SignIn from './SignIn';
import SignUp from './SignUp';

export const LoginPage = () => {

    return <div className='parent' style={{ minHeight: "100vh", backgroundColor: "#20cd8d" }}>
        <img src={globeImg} alt="globe" className="globe" />
        <div className="title-position">
            <img src={appIcon} alt="app icon" className="app-icon" />
            <h1 className="title">SplitFlow</h1>
        </div>
        <p className="subtitle">
            Effortlessly split bills,track expenses and stay connected with friends.
        </p>
        <div className="button-row">
            <SignIn />
            <SignUp />
        </div>
    </div>
}
