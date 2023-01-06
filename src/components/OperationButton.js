const OperationButton = (props) => {
  const clickHandler = () => {
    props.dispatch(props.operation);
  };

  return <button onClick={clickHandler} className={props.className ? props.className : ""}>{props.operation}</button>;
};

export default OperationButton;
