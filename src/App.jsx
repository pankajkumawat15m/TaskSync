import KanbanBoard from "./components/KanbanBoard";

function App() {
  console.log("App rendering"); // Debug log
  return (
    <div className="min-h-screen bg-gray-50">
      <KanbanBoard />
    </div>
  );
}

export default App;
