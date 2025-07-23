import { useContext } from "react"
import { AppContext } from "../App"

export default function Footer() {
	const { state } = useContext(AppContext)
	return (
		<footer>
			<div className="max">
				<img src={state.isDark ? "/sisu-white.png" : "/sisu-logo.png"} alt="SISU Health Logo" />
				<p className="center">© {new Date().getFullYear()} SISU Health. All rights reserved.</p>
			</div>
		</footer>
	)
}