import request from "../utils/request";
import { API_BASE_URL, GET_CONFIG, GET_SURVEY_QUESTIONS, START_BP_READING } from "../assets/constants";

export default class HealthService {

	static async getSurveyQuestions() {
		return request(GET_SURVEY_QUESTIONS)
	}


	static async startBPReading() {
		return request(START_BP_READING, {
			method: 'POST'
		})
	}


	static sseBPReading(url) {
		return new EventSource(`${API_BASE_URL}${url}`)
	}


	static async getConfig() {
		return request(GET_CONFIG)
	}


}	