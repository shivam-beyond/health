const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Simulate blood pressure reading with realistic progression
const simulateBloodPressureReading = () => {
  const phases = [
    { duration: 2000, status: 'initializing', message: 'Initializing blood pressure monitor...' },
    { duration: 3000, status: 'calibrating', message: 'Calibrating sensors...' },
    { duration: 5000, status: 'inflating', message: 'Inflating cuff...' },
    { duration: 8000, status: 'measuring_systolic', message: 'Measuring systolic pressure...' },
    { duration: 6000, status: 'measuring_diastolic', message: 'Measuring diastolic pressure...' },
    { duration: 4000, status: 'deflating', message: 'Deflating cuff...' },
    { duration: 2000, status: 'complete', message: 'Reading complete' }
  ];

  return phases;
};

// Store active sessions with their target values
const activeSessions = new Map();

// Global simulator configuration
let globalConfig = {
  systolic: 120,
  diastolic: 80,
  pulse: 72,
};

// Set global configuration endpoint
app.post('/api/blood-pressure/configure', (req, res) => {
  globalConfig = {
    systolic: req.body.systolic || 120,
    diastolic: req.body.diastolic || 80,
    pulse: req.body.pulse || 72,
  };
  
  res.json({
    success: true,
    message: 'Simulator configured successfully',
    configuration: {
      systolic: globalConfig.systolic,
      diastolic: globalConfig.diastolic,
      pulse: globalConfig.pulse
    }
  });
});

// Get current configuration
app.get('/api/blood-pressure/configure', (req, res) => {
  res.json({
    success: true,
    configuration: {
      systolic: globalConfig.systolic,
      diastolic: globalConfig.diastolic,
      pulse: globalConfig.pulse,
    }
  });
});

// Generate realistic blood pressure values that change during measurement
const generatePressureReading = (phase, elapsed, targetValues) => {
  const { systolic: targetSystolic, diastolic: targetDiastolic, pulse: targetPulse } = targetValues;
  
  switch (phase) {
    case 'initializing':
    case 'calibrating':
      return { systolic: 0, diastolic: 0, pulse: 0 };
    
    case 'inflating':
      const inflationPressure = Math.min(160, elapsed * 0.8);
      return { systolic: Math.round(inflationPressure), diastolic: 0, pulse: 0 };
    
    case 'measuring_systolic':
      const systolicNoise = Math.random() * 10 - 5;
      return { 
        systolic: Math.round(targetSystolic + systolicNoise), 
        diastolic: 0, 
        pulse: Math.round(targetPulse + Math.random() * 8 - 4) 
      };
    
    case 'measuring_diastolic':
      const diastolicNoise = Math.random() * 8 - 4;
      return { 
        systolic: Math.round(targetSystolic), 
        diastolic: Math.round(targetDiastolic + diastolicNoise), 
        pulse: Math.round(targetPulse + Math.random() * 8 - 4) 
      };
    
    case 'deflating':
      const deflationPressure = Math.max(0, 160 - elapsed * 2);
      return { 
        systolic: Math.round(targetSystolic), 
        diastolic: Math.round(targetDiastolic), 
        pulse: Math.round(targetPulse + Math.random() * 4 - 2) 
      };
    
    case 'complete':
      return { 
        systolic: targetSystolic, 
        diastolic: targetDiastolic, 
        pulse: targetPulse 
      };
    
    default:
      return { systolic: 0, diastolic: 0, pulse: 0 };
  }
};

// SSE endpoint for real-time blood pressure monitoring
app.get('/api/blood-pressure/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  const sessionId = req.query.sessionId || 'default';
  const sessionData = activeSessions.get(sessionId);
  
  if (!sessionData) {
    res.write(`data: ${JSON.stringify({ error: 'Session not found' })}\n\n`);
    res.end();
    return;
  }

  const phases = simulateBloodPressureReading();
  let currentPhaseIndex = 0;
  let phaseStartTime = Date.now();
  let totalElapsed = 0;
  
  const sendUpdate = () => {
    const now = Date.now();
    const phaseElapsed = now - phaseStartTime;
    totalElapsed += phaseElapsed;
    
    // Check if we need to move to next phase
    if (phaseElapsed >= phases[currentPhaseIndex].duration) {
      currentPhaseIndex++;
      phaseStartTime = now;
      
      // If we've completed all phases
      if (currentPhaseIndex >= phases.length) {
        const finalReading = generatePressureReading('complete', 0, globalConfig);
        const finalData = {
          status: 'complete',
          message: 'Blood pressure reading complete',
          reading: finalReading,
          progress: 100,
          timestamp: new Date().toISOString(),
          sessionId: sessionId
        };
        
        res.write(`data: ${JSON.stringify(finalData)}\n\n`);
        activeSessions.delete(sessionId);
        res.end();
        return;
      }
    }
    
    const currentPhase = phases[currentPhaseIndex];
    const reading = generatePressureReading(currentPhase.status, phaseElapsed, globalConfig);
    const progress = Math.min(100, (totalElapsed / 30000) * 100);
    
    const data = {
      status: currentPhase.status,
      message: currentPhase.message,
      reading: reading,
      progress: Math.round(progress),
      timestamp: new Date().toISOString(),
      sessionId: sessionId
    };
    
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    
    // Continue to next update
    setTimeout(sendUpdate, 500); // Update every 500ms
  };
  
  // Start the simulation
  sendUpdate();
  
  // Handle client disconnect
  req.on('close', () => {
    console.log(`Client disconnected from blood pressure stream: ${sessionId}`);
    activeSessions.delete(sessionId);
  });
});

// REST endpoint to start a blood pressure reading
app.post('/api/blood-pressure/start', (req, res) => {
  const sessionId = req.body?.sessionId || `session_${Date.now()}`;
  
  // Store session data
  activeSessions.set(sessionId, {
    startTime: Date.now()
  });
  
  res.json({
    success: true,
    sessionId: sessionId,
    message: 'Blood pressure reading started',
    streamUrl: `/api/blood-pressure/stream?sessionId=${sessionId}`,
    estimatedDuration: 30000, // 30 seconds
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'blood-pressure-monitor' 
  });
});

// Serve the web interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Blood Pressure Monitor Server running at http://localhost:${port}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  POST /api/blood-pressure/configure - Set global target values`);
  console.log(`  GET  /api/blood-pressure/configure - Get current configuration`);
  console.log(`  POST /api/blood-pressure/start - Start a new reading (uses global config)`);
  console.log(`  GET  /api/blood-pressure/stream - SSE stream for real-time updates`);
  console.log(`  GET  /api/health - Health check`);
  console.log(`  GET  / - Web interface for configuration and testing`);
});

module.exports = app;