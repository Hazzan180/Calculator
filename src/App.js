
import './App.css';
import './style.css';
import {useReducer} from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

//Actions function 
export const ACTIONS = {
  ADD_DIGIT: 'add_digit',
  CHOOSE_OPERATION: 'choose_operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete_digit',
  EVALUATE: 'evaluate'
}

//Reducer function 
const reducer = (state, {type, payload}) => {
  switch(type){
    case ACTIONS.ADD_DIGIT:
      //this is checking if overwrite is true 
      //if it is we return the state and we change curentoperand to
      //what the user cliick on and set overwrite back to flase
      if(state.overwrite){
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
       //to prevent adding more than 1 zero(0) in the front
      if(payload.digit === "0" && state.currentOperand === "0"){
        return state
      }
      //to prevent adding more than one (.)
      if(payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }
      //this return the sate and the digit we lick on
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
      case ACTIONS.CLEAR:
        //this return empty value ones we click on the clear button
        return {}
      case ACTIONS.CHOOSE_OPERATION:
        //this returnn state if we choose and operation and we have nothing typed out yet 
        if(state.currentOperand == null && state.previousOperand == null){
          return state
        }
        //this function handule the change operation problem
        if(state.currentOperand == null){
          return {
            ...state,
            operation: payload.operation
          }
        }
        //this return our state, the operation we clicked on and change our 
        //curentoperand to previousoperand and current operand will be null
        //if only our previousoperand is null
        if(state.previousOperand == null){
          return {
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null
          }
        }
          
        return {
          ...state,
          previousOperand: evaluate(state),
          currentOperand: null,
          operation: payload.operation
        }
        case ACTIONS.EVALUATE:
          //this is checking if ther are null if the condition is 
          //true we return the state
          if(
            state.operation == null ||
            state.currentOperand == null ||
            state.previousOperand == null
            ) return {
              ...state
            }
            //this is returing the state and seting previousOperand 
            //and operation back to null and we are evaluating the state 
            return {
              ...state,
              //this is handling our number from over writing 
              overwrite: true,
              previousOperand: null,
              operation: null,
              currentOperand: evaluate(state)
            }
        case ACTIONS.DELETE_DIGIT:
          //this is checking if overwrite is true if it is it return the conditons 
          if(state.overwrite){
            return{
              ...state,
              overwrite: false,
              currentOperand: null
            }
          }
          if(state.currentOperand == null){
            return  state
          }
          if(state.currentOperand.length === 1){
            return{
              ...state,
              currentOperand: null
            }
          }
          return {
            ...state,
            currentOperand: state.currentOperand.slice(0,1)
          }
  }
}

//the evaluate function
//this takes in our state
const evaluate = ({currentOperand, previousOperand, operation}) => {
  //we conver string to number 
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  //if the prev OR current operand does'nt exisit we return empty string
  if(isNaN(prev) || isNaN(current)){
    return ""
  }
  let computation = ""
  switch(operation){
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
    case "/":
      computation = prev / current
      break
    case "*":
      computation = prev * current
  }
  // we convert computation back to string 
  return computation.toString()
}

//this handule the interger format e.g 3,000, 00
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {

  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({type:ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation="/" dispatch={dispatch}/>
      <DigitButton digit="1" dispatch={dispatch}/>
      <DigitButton digit="2" dispatch={dispatch}/>
      <DigitButton digit="3" dispatch={dispatch}/>
      <OperationButton operation="*" dispatch={dispatch}/>
      <DigitButton digit="4" dispatch={dispatch}/>
      <DigitButton digit="5" dispatch={dispatch}/>
      <DigitButton digit="6" dispatch={dispatch}/>
      <OperationButton operation="+" dispatch={dispatch}/>
      <DigitButton digit="7" dispatch={dispatch}/>
      <DigitButton digit="8" dispatch={dispatch}/>
      <DigitButton digit="9" dispatch={dispatch}/>
      <OperationButton operation="-" dispatch={dispatch}/>
      <DigitButton digit="." dispatch={dispatch}/>
      <DigitButton digit="0" dispatch={dispatch}/>
      <button className="span-two" onClick={() => dispatch({type:ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
