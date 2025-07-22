import Construction from "./construction";

export default function Store() {
  const divStyle: React.CSSProperties = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };
  return (
    <div className="store" style={divStyle}>
      <Construction />
    </div>
  );
}
