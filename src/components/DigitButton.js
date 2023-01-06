const DigitButton = (props) => {
  const clickHandler = () => {
    props.dispatch(props.value);
  };

  return <button onClick={clickHandler}>{props.value}</button>;
};

export default DigitButton;
