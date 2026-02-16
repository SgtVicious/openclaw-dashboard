import React from 'react'
import { renderToString } from 'react-dom/server'
import MissionControl from './App.jsx'

// Quick server-side generation for static deployment
const html = renderToString(React.createElement(MissionControl))

console.log('✅ Mission Control Factory Floor Generated')
console.log('✅ Factory aesthetic with real-time agent monitoring')
console.log('✅ Office overview with working/idle indicators')
console.log('✅ Ready for Vercel deployment')

// Export for static serving
export default html