import type { ExperimentManifest, Section, ExampleSectionContent, RecommendationSectionContent } from '@schemas/index'
import type { LearningSummaryData, CommonMistake } from '~/types/learning'

/**
 * Temporary adapter to map the new framework-agnostic ExperimentManifest 
 * into the legacy LearningSummaryData format expected by the Vue UI components.
 * 
 * Future milestone: Refactor LearningSummaryCard.vue to natively iterate over `sections`.
 */
export const mapManifestToLegacyData = (manifest: ExperimentManifest): LearningSummaryData => {
  
  const getSectionContent = (id: string) => {
    return manifest.sections.find(s => s.id === id)?.content as string || ''
  }

  const getRecommendation = () => {
    const rec = manifest.sections.find(s => s.type === 'recommendation')
    if (rec) {
      const content = rec.content as RecommendationSectionContent
      return {
        approach: content.approach,
        reasoning: content.reasoning
      }
    }
    return { approach: '', reasoning: '' }
  }

  const getMistakes = (): CommonMistake[] => {
    const examples = manifest.sections.filter(s => s.type === 'example')
    return examples.map(ex => {
      const content = ex.content as ExampleSectionContent
      return {
        problem: ex.title,
        impact: content.explanation,
        fix: 'See code snippet',
        badCode: content.badCode,
        goodCode: content.goodCode
      }
    })
  }

  const getInterviews = (): string[] => {
    return manifest.sections
      .filter(s => s.type === 'interview')
      .map(s => s.content as string)
  }

  const getTips = (): string[] => {
    const tips = manifest.sections.find(s => s.type === 'tip')
    return tips ? (tips.content as string[]) : []
  }

  return {
    title: manifest.title,
    whatIsIt: getSectionContent('what-is-it'),
    howItWorks: getSectionContent('how-it-works'),
    recommendation: getRecommendation(),
    commonMistakes: getMistakes(),
    interviewQuestions: getInterviews(),
    proTips: getTips(),
    references: manifest.references
  }
}
