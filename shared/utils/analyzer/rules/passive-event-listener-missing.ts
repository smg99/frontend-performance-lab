/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import type { ASTRule, AnalyzerContext, Issue, RuleVisitorResult } from '../../../schemas/analyzer'
import _traverse from '@babel/traverse'
const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default

type PassiveStatus = 'PASSIVE_TRUE' | 'PASSIVE_FALSE' | 'PASSIVE_UNKNOWN'

function checkPassiveOptions(optionsNode: any, path: any): PassiveStatus {
  if (!optionsNode) return 'PASSIVE_FALSE'

  // Legacy boolean useCapture argument (e.g. addEventListener('touchstart', fn, true))
  if (optionsNode.type === 'BooleanLiteral') {
    return 'PASSIVE_FALSE'
  }

  if (optionsNode.type === 'ObjectExpression') {
    for (const prop of optionsNode.properties) {
      if (prop.type === 'ObjectProperty') {
        const keyName =
          prop.key.type === 'Identifier'
            ? prop.key.name
            : prop.key.type === 'StringLiteral'
              ? prop.key.value
              : null
        if (keyName === 'passive') {
          if (prop.value.type === 'BooleanLiteral' && prop.value.value === true) {
            return 'PASSIVE_TRUE'
          }
          if (prop.value.type === 'BooleanLiteral' && prop.value.value === false) {
            return 'PASSIVE_FALSE'
          }
        }
      }
    }
    return 'PASSIVE_FALSE'
  }

  if (optionsNode.type === 'Identifier') {
    const binding = path.scope.getBinding(optionsNode.name)
    if (
      binding &&
      binding.path &&
      binding.path.node &&
      binding.path.node.type === 'VariableDeclarator'
    ) {
      const initNode = binding.path.node.init
      if (initNode) {
        return checkPassiveOptions(initNode, path)
      }
    }
    return 'PASSIVE_UNKNOWN'
  }

  return 'PASSIVE_UNKNOWN'
}

export const passiveEventListenerMissing: ASTRule = {
  id: 'passive-event-listener-missing',
  title: 'Missing Passive Event Listener',
  description:
    'Attaching a touch or wheel event listener without { passive: true } forces the compositor thread to wait for the main thread.',
  severity: 'High',
  category: 'Rendering',
  frameworks: ['vanilla', 'react', 'vue', 'nuxt'],
  supportedLanguages: ['js', 'ts', 'jsx', 'tsx'],
  relatedExperiments: ['rendering', 'interaction'],
  browserAPIs: ['addEventListener'],
  impact:
    'Severe scroll jank, especially on mobile devices, as the browser must block rendering to check if preventDefault() is called.',
  fix: 'Add { passive: true } as the third argument to addEventListener for touchstart, touchmove, touchend, wheel, and mousewheel events.',
  browserImpact: {
    cpu: true,
    memory: false,
    rendering: true,
    network: false,
    cwv: true
  },
  explanation: {
    whatHappened:
      'An event listener for a continuous interaction event (like touchstart, touchmove, touchend, or wheel) was added without explicitly setting it to passive.',
    whyBrowserBehavesThisWay:
      'When a user scrolls, the browser attempts to handle the scroll on the Compositor thread for 60fps performance. However, if a touch or wheel listener is attached, the Compositor must block and wait for the Main Thread to execute the JS callback just in case the callback calls event.preventDefault() (which cancels the scroll). Marking it { passive: true } guarantees to the browser that preventDefault will NOT be called, allowing the Compositor to scroll immediately without waiting for JS.',
    pipelineInvolved: ['Composite']
  },
  autoFix: {
    badCode: 'document.addEventListener("touchstart", handleTouchStart);',
    recommendedCode:
      'document.addEventListener("touchstart", handleTouchStart, { passive: true });',
    whyFaster:
      'The browser no longer waits for the main thread JavaScript execution to finish before it updates the screen during a scroll. This completely eliminates input latency and scroll jank caused by main thread blocking.'
  },
  confidence: {
    score: 95,
    reason:
      'Detected an addEventListener call for a scroll-blocking touch or wheel event without verified passive: true options.',
    falsePositiveRisk: 'Low'
  },
  visitor: (ast: any, context: AnalyzerContext) => {
    const issues: RuleVisitorResult[] = []

    // Scroll-blocking interaction events on touch and wheel
    // Note: touchend is included alongside touchstart/touchmove/wheel/mousewheel because it can also block multi-touch gesture composition.
    const blockingEvents = ['touchstart', 'touchmove', 'touchend', 'wheel', 'mousewheel']

    traverse(ast, {
      CallExpression(path: any) {
        const callee = path.node.callee

        // Match element.addEventListener()
        if (
          callee.type === 'MemberExpression' &&
          callee.property.type === 'Identifier' &&
          callee.property.name === 'addEventListener'
        ) {
          const args = path.node.arguments

          if (args.length >= 1 && args[0].type === 'StringLiteral') {
            const eventName = args[0].value

            if (blockingEvents.includes(eventName)) {
              const optionsNode = args.length >= 3 ? args[2] : null
              const status = checkPassiveOptions(optionsNode, path)
              const line = path.node.loc?.start.line || 1

              if (status === 'PASSIVE_FALSE') {
                issues.push({
                  lineNumbers: [line],
                  description: `Missing { passive: true } on '${eventName}' event listener forces main-thread blocking during scroll.`
                })
              } else if (status === 'PASSIVE_UNKNOWN') {
                issues.push({
                  lineNumbers: [line],
                  description: `Event listener for '${eventName}' uses unverified options that may lack { passive: true }.`
                })
              }
            }
          }
        }
      }
    })

    return issues
  }
}
