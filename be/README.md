# Blood Pressure Monitor API Specification

## Overview
This API simulates a WebRTC-style asynchronous blood pressure monitoring system.

## Base URL
```
http://localhost:3000/api
```

## Authentication
No authentication required for this test server.

## Endpoints

### 1. Configure Simulator (Global Settings)
**POST** `/blood-pressure/configure`

Sets the global target values that ALL blood pressure readings will return, regardless of session.

**Request Body:**
```json
{
  "systolic": 135,
  "diastolic": 85,
  "pulse": 78
}
```

### 2. Start Blood Pressure Reading
**POST** `/blood-pressure/start`

Initiates a new blood pressure reading session using the globally configured target values.

**Request Body:**
```json
{
  "sessionId": "optional_session_id"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "session_1641234567890",
  "message": "Blood pressure reading started",
  "streamUrl": "/api/blood-pressure/stream?sessionId=session_1641234567890",
  "estimatedDuration": 30000,
  "usingGlobalConfig": true
}
```
**GET** `/blood-pressure/stream`

Server-Sent Events endpoint that provides real-time updates during the measurement process.

**Query Parameters:**
- `sessionId` (optional): Session identifier

**Response Format:**
Content-Type: `text/event-stream`

**Event Data Structure:**
```json
{
  "status": "measuring_systolic",
  "message": "Measuring systolic pressure...",
  "reading": {
    "systolic": 120,
    "diastolic": 0,
    "pulse": 72
  },
  "progress": 65,
  "timestamp": "2025-01-15T10:30:45.123Z",
  "sessionId": "session_1641234567890"
}
```

## Measurement Process

The blood pressure reading follows these phases over ~30 seconds:

1. **Initializing** (2s) - System startup
2. **Calibrating** (3s) - Sensor calibration
3. **Inflating** (5s) - Cuff inflation
4. **Measuring Systolic** (8s) - Systolic pressure measurement
5. **Measuring Diastolic** (6s) - Diastolic pressure measurement
6. **Deflating** (4s) - Cuff deflation
7. **Complete** (2s) - Final results

## Status Values

- `initializing` - Starting up the measurement system
- `calibrating` - Calibrating sensors
- `inflating` - Inflating the cuff
- `measuring_systolic` - Measuring systolic pressure
- `measuring_diastolic` - Measuring diastolic pressure
- `deflating` - Deflating the cuff
- `complete` - Measurement finished

## Reading Values

- `systolic`: Systolic pressure (mmHg) - typically 110-140
- `diastolic`: Diastolic pressure (mmHg) - typically 70-90
- `pulse`: Heart rate (BPM) - typically 60-100

## Error Handling

The server includes basic error handling. If the client disconnects during streaming, the server will log the disconnection and clean up resources.


Both clients will receive readings that converge to the same configured values (155/95 mmHg, 85 BPM).

## Setup Instructions

1. Install dependencies:
```bash
npm install express cors
```

2. Run the server:
```bash
npm run start
```

3. The server will start on `http://localhost:3000`


4. Configure the BP:

Using `curl`:
```bash
curl -X POST http://localhost:3000/api/blood-pressure/configure \
  -H "Content-Type: application/json" \
  -d '{"systolic": 120, "diastolic": 80, "pulse": 72}'
```

Using `httpie`:
```bash
http POST localhost:3000/api/blood-pressure/configure \
  systolic:=120 diastolic:=80 pulse:=72
```

* **High** (Over 150 systolic): systolic:=155 diastolic:=95 pulse:=85
* **Elevated** (Over 130 systolic): systolic:=135 diastolic:=85 pulse:=78
* **Low**: (Below 81 systolic): systolic:=80 diastolic:=65 pulse:=58