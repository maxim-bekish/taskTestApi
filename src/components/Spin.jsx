import st from "./../scss/spin.module.scss";
export const Spin = () => {
  return (
    <div className={st.boxSpinner}>
      <div className={st.loader}></div>
    </div>
  );
};
