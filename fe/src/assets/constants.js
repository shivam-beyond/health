// The base URL for the API endpoints used in the application
export const API_BASE_URL = "http://localhost:3000"
export const GET_SURVEY_QUESTIONS = 'survey.json'
export const START_BP_READING = 'api/blood-pressure/start'
export const GET_CONFIG = 'api/blood-pressure/configure'
export const originalState = {
	screen: 'questionnaire',
	isDark: false,
	survey: {},
	history: [-1],
	answers: {},
	config: {},
	bpTest: {},
	results: {},
}

export const initialState = localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')) : originalState