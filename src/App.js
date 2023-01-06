import { useReducer } from "react";
import "./App.css";

import DigitButton from "./components/DigitButton";
import OperationButton from "./components/OperationButton";

const initialState = {
  overwrite: false,
  previous: null,
  current: null,
  operation: null,
};

const operandReducer = (state, action) => {
  let newValue;
  switch (action.type) {

    // When a digit button is pressed
    case "DIGIT":

      // When there is no value to be overriden
      if (!state.overwrite) {

        // Adds a digit to the already existing string
        if (state.current) {
          newValue = state.current + action.digit.toString();
        } 
        
        // Shows the first digit
        else {
          newValue = action.digit.toString();
        }

        return {
          ...state,
          current: newValue,
        };
      }

      // Overrides final value with a new digit
      newValue = action.digit.toString();

      return {
        ...initialState,
        current: newValue,
      };

    // When the "." button is pressed
    case "DECIMAL":

      // Checks if "." was the first button pressed if so, change it to 0.
      if (!state.current) {
        return {
          ...state,
          current: "0.",
        };
      }

      let elements;
      if (state.current) {
        elements = state.current.split("");
      }

      // Checks if "." was already pressed and prevents user from pressing it again if it was      
      if (elements.includes(".")) {
        return state;
      }

      // Adds the decimal point if its the first time pressing it
      newValue = state.current + ".";

      return {
        ...state,
        current: newValue,
      };

    // When the 4 operation buttons are pressed
    case "OPERATION":
      newValue = state.current;
      if (newValue) {

        // If the user presses 9. and then presses an operation button, change it to 9.0
        if (state.current[state.current.length - 1] === ".") {
          newValue = state.current + "0";
        }
      }
      
      // If the user wants to change operation
      if (state.operation && !state.current) {
        return {
          ...state,
          operation: action.operation,
        };
      }

      // User is unable to press the operation as the first button
      if (!state.previous && !state.current) {
        return state;
      }

      return {
        overwrite: false,
        previous: newValue,
        current: null,
        operation: action.operation,
      };

    // When DEL is pressed
    case "DELETE":

      // If there is more than 1 digit
      if (state.current && state.current.length > 1) {
        newValue = state.current.slice(0, state.current.length - 1);
        return {
          ...state,
          current: newValue,
        };
      }

      // If there is only 1 digit
      if (state.current && state.current.length === 1) {
        return {
          ...state,
          current: null,
        };
      }

      // Or else do nothing
      return state;

    // When AC is pressed, reset everything
    case "AC":
      return initialState;

    // When equal is pressed, compute the final value
    case "EQUAL":
      if (state.operation) {
        const finalValue = evaluate(
          state.previous,
          state.operation,
          state.current
        );
        if (!isNaN(finalValue)) {
          return {
            overwrite: true,
            previous: null,
            current: finalValue.toString(),
            operation: null,
          };
        }
      }

      // Else do nothing if invalid values are given
      return state;

    default:
      return initialState;
  }
};

// Calculates final value based on operation
const evaluate = (first, operation, second) => {

  // Check if both numbers are ints
  if (isNaN(+first) || isNaN(+second)) {
    return null;
  }

  switch (operation) {
    case "+":
      return parseFloat(first) + parseFloat(second);
    case "-":
      return parseFloat(first) - parseFloat(second);
    case "*":
      return parseFloat(first) * parseFloat(second);
    case "÷":
      return parseFloat(first) / parseFloat(second);
    default:
      return null;
  }
};


// Formats the integers without formatting the numbers after the decimal point
const INTERGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

const formatOperand = (operand) => {
  if (operand == null) {
    return;
  }

  const [integer, decimal] = operand.split(".");

  if (decimal == null) {
    return INTERGER_FORMATTER.format(integer);
  }

  return `${INTERGER_FORMATTER.format(integer)}.${decimal}`;
};

function App() {
  const [operand, dispatchOperand] = useReducer(operandReducer, initialState);

  const digitHandler = (digit) => {
    dispatchOperand({ type: "DIGIT", digit: digit });
  };

  const operationHandler = (operation) => {
    dispatchOperand({ type: "OPERATION", operation: operation });
  };

  const equalHandler = () => {
    dispatchOperand({ type: "EQUAL" });
  };

  const clearHandler = () => {
    dispatchOperand({ type: "AC" });
  };

  const decimalHandler = () => {
    dispatchOperand({ type: "DECIMAL" });
  };

  const deleteHandler = () => {
    dispatchOperand({ type: "DELETE" });
  };

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(operand.previous)} {operand.operation}
        </div>
        <div className="current-operand">{formatOperand(operand.current)}</div>
      </div>
      <OperationButton
        className="span-two"
        operation="AC"
        dispatch={clearHandler}
      />
      <OperationButton operation="DEL" dispatch={deleteHandler} />
      <OperationButton operation="÷" dispatch={operationHandler} />
      <DigitButton value="1" dispatch={digitHandler} />
      <DigitButton value="2" dispatch={digitHandler} />
      <DigitButton value="3" dispatch={digitHandler} />
      <OperationButton operation="*" dispatch={operationHandler} />
      <DigitButton value="4" dispatch={digitHandler} />
      <DigitButton value="5" dispatch={digitHandler} />
      <DigitButton value="6" dispatch={digitHandler} />
      <OperationButton operation="+" dispatch={operationHandler} />
      <DigitButton value="7" dispatch={digitHandler} />
      <DigitButton value="8" dispatch={digitHandler} />
      <DigitButton value="9" dispatch={digitHandler} />
      <OperationButton operation="-" dispatch={operationHandler} />
      <OperationButton operation="." dispatch={decimalHandler} />
      <DigitButton value="0" dispatch={digitHandler} />
      <OperationButton
        className="span-two"
        operation="="
        dispatch={equalHandler}
      />
    </div>
  );
}

export default App;
