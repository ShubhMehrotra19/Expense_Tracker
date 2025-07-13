import Expenses from "./components/expenses";
import Navbar from "./components/navbar";

function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <Expenses />
    </div>
  );
}

export default App;
