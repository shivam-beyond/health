export default function SingleChoice({ question, answers, setAnswers }) {
	const { question: title, options } = question
	const value = answers[question.id]
	return (
		<fieldset>
			<legend>{title}</legend>
			<div className="options-group">
				{options.map((option) => (
					<label key={option.value} htmlFor={option.value}>
						<input type="radio" name={question.id} id={option.value} className="visually-hidden" checked={value === option.value} onChange={() => setAnswers({ ...answers, [question.id]: option.value })} />
						{option.label}
					</label>
				))}
			</div>
		</fieldset>
	)
}