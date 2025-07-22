import error from "../assets/error.png";

export default function Construction() {
  const divStyle: React.CSSProperties = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "500",
    fontSize: "1.5em",
  };
  return (
    <div style={divStyle}>
      <img src={error} alt="공사 중" width={100} />
      <p>아직 공사중이에요</p>
      <p>빠른시일내에 만나요!</p>
    </div>
  );
}
