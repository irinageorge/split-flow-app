import './Login.css'
import { useLogin } from '@/services/LoginPageQuery';
import appIcon from "../assets/split.svg"
import globeImg from "../assets/navigation.png"
import SignIn from './SignIn';
import SignUp from './SignUp';

export const LoginPage = () => {

    const { data } = useLogin();
    console.log("Data:", data);

    return <div className='parent'>
        <img src={globeImg} alt="globe" className="globe" />
        <div className="title-position">
            <img src={appIcon} alt="app icon" className="app-icon" />
            <h1 className="title">SplitFlow</h1>
        </div>
        <p className="subtitle">
            Effortlessly split bills,track expenses <br />
            and stay connected with friends.
        </p>
        <div className="button-row">
            <SignIn />
            <SignUp />
        </div>
    </div>
}
