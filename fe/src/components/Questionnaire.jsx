import { useContext } from "react"
import { AppContext } from "../App"
import SingleChoice from "./SingleChoice"
import getNextQuestionIndex from "../utils/getNextQuestionIndex"
import chevronLeft from "../assets/chevronLeft"
import chevronRight from "../assets/chevronRight"

export default function Questionnaire() {

	const { state, dispatch } = useContext(AppContext)

	const survey = state.survey
	const history = state.history
	const answers = state.answers
	const historyLength = history.length;

	const setScreen = (screen) => dispatch({ type: 'SET_SCREEN', payload: screen })
	const setHistory = (history) => dispatch({ type: 'SET_HISTORY', payload: history })
	const setAnswers = (answers) => dispatch({ type: 'SET_ANSWERS', payload: answers })


	const handleNext = () => {
		if (history[historyLength - 1] >= survey.questions.length - 1) {
			setScreen('simulator')
		} else {
			setHistory([...history, getNextQuestionIndex(survey.questions, answers, history[historyLength - 1])])
		}
	}

	const handleBack = () => {
		setHistory(history.slice(0, history.length - 1))
	}

	const progress = (history[historyLength - 1] + 1) / survey.questions.length * 100

	return (

		<section id="questionnaire" >
			<>

				{history[historyLength - 1] === -1 && (
					<div>
						<h1>🩺 {survey?.title}</h1>
						<button className="start-survey" onClick={() => setHistory([...history, 0])}>
							{Object.keys(answers).length > 0 ? 'Resume' : 'Start'} Survey
						</button>
					</div>
				)}

				{history[historyLength - 1] >= 0 && history[historyLength - 1] < survey.questions.length && (
					<form id="survey-form">

						<SingleChoice question={survey.questions[history[historyLength - 1]]} answers={answers} setAnswers={setAnswers} />

						<div className="progress-wrap">
							<label htmlFor="progress" className="visually-hidden">Questionnaire progress</label>
							<progress id="progress" value={progress} max="100" aria-label="Questionnaire progress">{progress.toFixed(0)}%</progress>
						</div>

						<div className="form-action">
							<button type="button" id="back-btn" className="large" onClick={handleBack}>
								{chevronLeft}
								Back
							</button>
							<button type="button" id="next-btn" className="large" onClick={handleNext} disabled={!answers[survey.questions[history[historyLength - 1]].id]}>
								{history[historyLength - 1] >= survey.questions.length - 1 ? 'Take A Test' : 'Next'}
								{chevronRight}
							</button>
						</div>

					</form>
				)}

			</>

		</section>


	)
}