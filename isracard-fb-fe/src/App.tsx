import "./App.css";
import { SignalRProvider } from "./context/signalRProvider";
import Home from "./pages";

function App() {

  return (
    <SignalRProvider>
      <Home />
    </SignalRProvider>
  );
}

export default App;
