import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import { publishProposalPayloads, type ProposalGitHubClient } from '../autonomy/publish-proposals'
import { getAllBrowserAPIs, getAllExperiments, getAllRecipes } from '../shared/registry'

const payloadsPath = path.resolve('artifacts/autonomy/proposal-payloads.json')
const payloads: unknown = JSON.parse(fs.readFileSync(payloadsPath, 'utf8'))
const repositoryDetails = z
  .object({
    nameWithOwner: z.string().min(3),
    defaultBranchRef: z.object({ name: z.string().min(1) })
  })
  .parse(
    JSON.parse(
      execFileSync('gh', ['repo', 'view', '--json', 'nameWithOwner,defaultBranchRef'], {
        encoding: 'utf8'
      })
    )
  )
const repository = {
  nameWithOwner: repositoryDetails.nameWithOwner,
  defaultBranch: repositoryDetails.defaultBranchRef.name
}
const existingContent = [...getAllExperiments(), ...getAllBrowserAPIs(), ...getAllRecipes()]
const context = {
  existingIds: existingContent.map(item => item.id),
  existingTitles: existingContent.map(item => ('title' in item ? item.title : item.name))
}
const client: ProposalGitHubClient = {
  request: async <T>(method: 'GET' | 'POST', endpoint: string, body?: unknown) => {
    const args = ['api', '--method', method, endpoint]
    const input = body === undefined ? undefined : `${JSON.stringify(body)}\n`
    if (input !== undefined) args.push('--input', '-')
    const response = execFileSync('gh', args, {
      encoding: 'utf8',
      input,
      maxBuffer: 10 * 1024 * 1024
    })
    return JSON.parse(response) as T
  }
}

const results = await publishProposalPayloads(payloads, repository, context, client)
for (const result of results)
  console.log(
    `${result.status === 'created' ? 'Created draft pull request' : 'Reused existing pull request'}: ${result.pullRequestUrl}`
  )
if (results.length === 0) console.log('No autonomous proposal payloads to publish.')
