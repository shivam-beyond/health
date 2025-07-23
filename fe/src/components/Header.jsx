import { useContext, useEffect } from "react"
import { AppContext } from "../App"
import dayIcon from "../assets/day"
import nightIcon from "../assets/night"

export default function Header() {
	const { state, dispatch } = useContext(AppContext)
	const setDark = (mode) => dispatch({ type: 'SET_DARK', payload: mode })


	useEffect(() => {
		if (state.isDark) {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	}, [state.isDark])

	return (
		<header>
			<div className="max">
				<img src="/sisu-white.png" alt="SISU Health Logo White" />
				<button type="button" onClick={() => setDark(!state.isDark)} aria-label="Toggle dark mode" title="Toggle dark mode" className="icon-btn">
					{state.isDark ? dayIcon : nightIcon}
				</button>
			</div>
		</header>
	)
}