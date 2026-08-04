import type { BrowserAPI } from '../../../schemas/browser-api'

export const webSocketManifest: BrowserAPI = {
  id: 'websocket',
  name: 'WebSocket',
  description:
    'Provides a full‑duplex communication channel over a single TCP connection, enabling real‑time data exchange between client and server.',
  category: 'Network',
  browserSupport: '95%',
  baseline: 'Widely available',
  difficulty: 'Intermediate',
  usageStats: { popularity: 78 },
  searchMetadata: {
    keywords: ['realtime', 'socket', 'push', 'bidirectional', 'stream'],
    synonyms: ['ws', 'socket.io'],
    concepts: ['Live data streams', 'Chat', 'Gaming']
  },
  whenToUse: [
    'When you need low‑latency, bidirectional communication (e.g., chat, live dashboards).',
    'For push notifications that must survive page reloads (with reconnection logic).',
    'When the server can push updates without the client polling.'
  ],
  whenNotToUse: [
    'For simple request‑response use‑cases – use fetch/axios instead.',
    'When you require guaranteed delivery and ordering across unreliable networks – consider WebRTC Data Channels or HTTP/2 Server‑Sent Events.'
  ],
  advantages: [
    'Persistent connection reduces overhead of repeated HTTP handshakes.',
    'Message framing built‑in, no need to implement custom protocols.',
    'Works over HTTPS (wss) for secure communication.'
  ],
  limitations: [
    'No built‑in request/response semantics – you must design your own protocol.',
    'Binary payloads require manual handling (ArrayBuffer, Blob).',
    'Can be blocked by strict corporate firewalls.'
  ],
  performanceImpact: 'Low',
  commonMistakes: [
    'Not handling reconnection on network loss.',
    'Sending raw JSON strings without compression, causing bandwidth bloat.',
    'Forgetting to close the socket on component unmount, leading to memory leaks.'
  ],
  bestPractices: [
    'Encapsulate socket logic in a dedicated service or composable.',
    'Implement exponential back‑off reconnection strategy.',
    'Validate and sanitize incoming messages to avoid injection attacks.'
  ],
  examples: [
    {
      title: 'Basic Vue 3 WebSocket composable',
      code: "import { ref, onMounted, onUnmounted } from 'vue'\n\nconst socket = ref<WebSocket | null>(null)\nconst messages = ref<string[]>([])\n\nonMounted(() => {\n  socket.value = new WebSocket('wss://example.com/updates')\n  socket.value.addEventListener('message', (event) => {\n    messages.value.push(event.data)\n  })\n})\n\nonUnmounted(() => {\n  socket.value?.close()\n})\n\nexport function useWebSocket() {\n  return { socket, messages }\n}",
      explanation:
        'Creates a persistent WebSocket connection, collects incoming messages, and cleans up on component unmount.'
    }
  ],
  relatedExperiments: [],
  relatedRecipes: ['real-time-dashboard'],
  relatedBrowserAPIs: [],
  interviewQuestions: [
    {
      question: 'How do you detect that a WebSocket connection has been unexpectedly closed?',
      answer:
        'Listen to the `close` event and examine its `code` and `reason` properties; implement reconnection logic based on the code.'
    }
  ],
  references: [
    {
      title: 'MDN Web Docs: WebSocket',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSocket'
    }
  ]
}
