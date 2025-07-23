import { useContext, useEffect, useState } from "react"
import HealthService from "../services/healthService"
import heartIcon from "../assets/heart"
import { AppContext } from "../App"

let stopFn;
export default function BPSimulator() {

	const { state, dispatch } = useContext(AppContext)

	const survey = state.survey
	const setScreen = (screen) => dispatch({ type: 'SET_SCREEN', payload: screen })

	const [reading, setReading] = useState(false)
	const [sessionData, setSessionData] = useState({})
	const [liveData, setLiveData] = useState({})
	const [isCompleted, setIsCompleted] = useState(false)

	const startReading = () => {
		setReading(true)
		setIsCompleted(false)
		HealthService.startBPReading().then((res) => {
			setSessionData(res)
		}).finally(() => {
			setReading(false)
		})
	}

	useEffect(() => {
		if (!sessionData.streamUrl) return


		const events = HealthService.sseBPReading(sessionData.streamUrl);

		setReading(true)

		const eventsClose = () => {
			setReading(false)
			events.close()
		}

		stopFn = eventsClose

		events.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				if (data?.progress === 100 && data?.message === 'Blood pressure reading complete') {
					eventsClose()
					setIsCompleted(true)
				}
				setLiveData(data)
			} catch (err) {
				console.error(err)
			}
		};

		events.onerror = (error) => {
			eventsClose()
			console.error('Error in connection')
		};


		return () => { eventsClose() }

	}, [sessionData.streamUrl])


	const onStop = () => {
		stopFn?.()
		setLiveData({})
	}


	return <section id="bp-readings">


		<h2>🩺 Measure Blood Pressure</h2>

		<div id="bp-simulator">
			<div className={"animation scanning " + (reading ? 'reading' : '')}>
				<img src="/hand.svg" alt="Use your left hand to measure blood pressure" />
			</div>
			<div className="screen">
				<dl>
					<div className="systolic">
						<dt>Systolic<br /><span>mmHg</span></dt>
						<dd>{liveData?.reading?.systolic || ''}</dd>
					</div>
					<div className="diastolic">
						<dt>Diastolic<br /><span>mmHg</span></dt>
						<dd>{liveData?.reading?.diastolic || ''}</dd>
					</div>
					<div className="pulse">
						<dt>Pulse<br /><span>/min</span></dt>
						<dd>{liveData?.reading?.pulse || ''}</dd>
					</div>
				</dl>

				{(reading || isCompleted) && <div className="progress">
					<label htmlFor="reading-progress">{liveData?.message || ''}</label>
					<progress id="reading-progress" value={liveData?.progress || 0} className="visually-hidden" max="100"> {liveData?.progress || 0}% </progress>
					<div className="data">{liveData?.progress || 0}%</div>
				</div>
				}

			</div>
		</div>



		<div className="actions">
			{
				reading && <button className="large" onClick={onStop}>Stop</button>
			}
			{
				!reading && <button className="large" onClick={startReading}>{heartIcon} {isCompleted ? 'Take Again' : 'Start'}</button>
			}
			{
				!reading && isCompleted && <button className="large solid" onClick={()=>{
					setScreen('results')
				}}>View Results</button>
			}
		</div>

		<p className="center"><em>*{survey?.bpTest?.description}</em></p>
	</section>
}