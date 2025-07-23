export default function getPriorityColor(priority) {
	switch (priority) {
		case 'low':
			return {
				icon: '✅',
				color: '#388E3C'
			};
		case 'medium':
			return {
				icon: '⚠️',
				color: '#FFA000'
			}
		default:
			return {
				icon: '🚨',
				color: '#D32F2F'
			}
	}
}