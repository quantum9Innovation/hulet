import type { Config } from 'jest'

const jestConfig: Config = {
  modulePaths: ['dist/ts'],
  testMatch: ['**/dist/ts/test/*.js']
}

export default jestConfig
