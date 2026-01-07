import { Genesis } from "./experiments/Genesis";

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Genesis />
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "2rem",
          color: "white",
          opacity: 0.5,
          pointerEvents: "none",
          fontFamily: "monospace",
        }}
      >
        genesis_seq_01
      </div>
    </div>
  );
}

export default App;
