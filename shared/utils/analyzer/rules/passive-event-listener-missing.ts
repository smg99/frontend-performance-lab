/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import type { ASTRule, AnalyzerContext, Issue, RuleVisitorResult } from '../../../schemas/analyzer'
import _traverse from '@babel/traverse'
const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default

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
  fix: 'Add { passive: true } as the third argument to addEventListener for touchstart, touchmove, wheel, and mousewheel events.',
  browserImpact: {
    cpu: true,
    memory: false,
    rendering: true,
    network: false,
    cwv: true
  },
  explanation: {
    whatHappened:
      'An event listener for a continuous interaction event (like touchstart or wheel) was added without explicitly setting it to passive.',
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
      'Detected an addEventListener call for a blocking event type without a valid passive: true options object.',
    falsePositiveRisk: 'Low'
  },
  visitor: (ast: any, context: AnalyzerContext) => {
    const issues: RuleVisitorResult[] = []

    const blockingEvents = ['touchstart', 'touchmove', 'wheel', 'mousewheel']

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
              let isPassive = false

              // Check third argument
              if (args.length >= 3) {
                const optionsArg = args[2]

                // if it's an object expression, check for passive: true
                if (optionsArg.type === 'ObjectExpression') {
                  for (const prop of optionsArg.properties) {
                    if (
                      prop.type === 'ObjectProperty' &&
                      ((prop.key.type === 'Identifier' && prop.key.name === 'passive') ||
                        (prop.key.type === 'StringLiteral' && prop.key.value === 'passive'))
                    ) {
                      if (prop.value.type === 'BooleanLiteral' && prop.value.value === true) {
                        isPassive = true
                      }
                    }
                  }
                }
              }

              if (!isPassive) {
                issues.push({
                  lineNumbers: [path.node.loc?.start.line || 1]
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
