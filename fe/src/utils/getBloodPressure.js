export default function getBloodPressure(systolic) {
	if (!systolic) return null;
	switch (true) {
		case systolic < 81:
			return 'low';
		case systolic < 130:
			return 'normal';
		case systolic < 150:
			return 'elevated';
		default:
			return 'high';
	}
}