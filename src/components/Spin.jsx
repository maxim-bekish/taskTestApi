export const Spin = () => {
  const style = {
    boxSpinner: {
      zIndex: -2,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "white",
    },
    loader: {
      width: "100px",
      height: "100px",
      border: "5px solid black",
      borderBottomColor: "transparent",
      borderRadius: " 50%",
      display: "inline-block",
      boxSizing: " border-box",
      animation: "rotation 1s linear infinite",
    },
  };

  return (
    <div style={style.boxSpinner}>
      <div style={style.loader}></div>
    </div>
  );
};
