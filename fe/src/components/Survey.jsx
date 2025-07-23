import { useContext, useEffect, useState } from "react"
import HealthService from "../services/healthService"
import { AppContext } from "../App"
import BPSimulator from "./BPSimulator"
import Results from "./Results"
import Questionnaire from "./Questionnaire"

export default function Survey() {

	const { state, dispatch } = useContext(AppContext)

	const screen = state.screen
	const setSurvey = (data) => dispatch({ type: 'SET_SURVEY', payload: data })

	const [surveyLoading, setSurveyLoading] = useState(true)


	useEffect(() => {
		HealthService.getSurveyQuestions().then((data) => {
			setSurvey(data?.survey)
		}).finally(() => {
			setSurveyLoading(false)
		})
	}, [])




	return (
		<div className="max">

			{
				!surveyLoading ?
					<>
						{
							screen === 'questionnaire' &&
							<Questionnaire />
						}

						{screen === 'simulator' &&
							!surveyLoading &&
							<BPSimulator />
						}


						{screen === 'results' &&
							<Results />
						}
					</> : <p>Loading...</p>
			}

		</div>

	)
}