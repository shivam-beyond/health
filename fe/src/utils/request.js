import { API_BASE_URL } from "../assets/constants"

export default function request(url, options = {}) {


	options.headers = options.headers || {}
	options.headers['Content-Type'] = 'application/json'

	return fetch(API_BASE_URL + '/' + url, options).then(response => {
		if (!response.ok) {
			throw new Error(response.statusText)
		}
		return response.json()
	}).catch(error => {
		alert(error)
		throw new Error(error)
	})
}