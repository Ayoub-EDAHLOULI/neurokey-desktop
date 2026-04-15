import SidebarLayout from "./layouts/SidebarLayout";

function App() {
  return (
    <SidebarLayout>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text mb-2">
            Welcome to NeuroKey Desktop
          </h2>
          <p className="text-subText">Your offline-first vault is ready.</p>
        </div>
      </div>
    </SidebarLayout>
  );
}

export default App;
