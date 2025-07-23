import { useEffect, useState } from "react"
import HealthService from "../services/healthService"
import getBloodPressure from "../utils/getBloodPressure"
import getPriorityColor from "../utils/getPriorityColor"
import { useContext } from "react"
import { AppContext } from "../App"
import heartIcon from "../assets/heart"

export default function Results() {

	const { state, dispatch } = useContext(AppContext)
	const survey = state.survey
	const setScreen = (screen) => dispatch({ type: 'SET_SCREEN', payload: screen })

	const [config, setConfig] = useState({})

	useEffect(() => {
		HealthService.getConfig().then((res) => {
			setConfig(res?.configuration)
		})
	}, [])

	const pressure = getBloodPressure(config?.systolic)
	const results = survey?.bpTest?.recommendations?.[pressure]
	const priority = getPriorityColor(results?.priority);


	const handleReset = () => {
		dispatch({ type: 'RESET' })
	}

	return <section id="results">

		<h2>🩺 Blood Pressure Results</h2>

		<div className="card">
			<h3>{priority.icon} <span style={{ color: priority.color }}>{results?.category}</span></h3>
			<summary>{results?.summary}</summary>
			<p>{results?.follow_up}</p>

			<h4>Lifestyle Recommendations</h4>
			<ul>
				{results?.lifestyle_recommendations?.map((item, index) => (
					<li key={index}>{item}</li>
				))}
			</ul>

			<h4>Medical Advice</h4>
			<ul>
				{results?.medical_advice?.map((item, index) => (
					<li key={index}>{item}</li>
				))}
			</ul>
		</div>


		<div className="actions">
			<button className="large" onClick={() => { setScreen('simulator') }}>{heartIcon} Take Test Again</button>
			<button className="large" onClick={handleReset}>Reset</button>
		</div>

		<p><em>*{survey?.medical_disclaimer}</em></p>



	</section>
}