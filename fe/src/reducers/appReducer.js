import { originalState } from "../assets/constants";

export default function appReducer(state, action) {
	let newState = { ...state }
  switch (action.type) {
    case 'SET_DARK':
      newState = { ...state, isDark: action.payload }
			break;
    case 'SET_SCREEN':
      newState = { ...state, screen: action.payload }
			break;
    case 'SET_SURVEY':
      newState = { ...state, survey: action.payload }
			break;
    case 'SET_HISTORY':
      newState = { ...state, history: action.payload }
			break;
    case 'SET_ANSWERS':
      newState = { ...state, answers: action.payload }
			break;
    case 'SET_CONFIG':
      newState = { ...state, config: action.payload }
			break;
    case 'SET_BP_TEST':
      newState = { ...state, bpTest: action.payload }
			break;
    case 'SET_RESULTS':
      newState = { ...state, results: action.payload }
			break;
		case 'RESET':
			newState = { ...originalState, survey: state.survey }
  }
	localStorage.setItem('state', JSON.stringify(newState))
	return newState
}