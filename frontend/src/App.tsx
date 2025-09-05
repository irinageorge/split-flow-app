import './App.css'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import appIcon from "./assets/split.svg"
import SignIn from './componentsUI/SignIn'
import SignUp from './componentsUI/SignUp'
import { useHomePage } from './services/HomePageQuery'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  )
}

function Home() {

  const {data} = useHomePage();
  console.log("Data:", data);

  return <div className="center">
    <div className="title-row">
      <h1 className="title font-lilita">Welcome to SplitFlow</h1>
      <img src={appIcon} alt="app icon" className="app-icon" />
    </div>
    <p className="subtitle font-lilita">
      Effortlessly split bills, track expenses and stay connected with friends.
    </p>
    <div className="button-row">
      <SignIn />
      <SignUp />
    </div>
  </div>
}

export default App
