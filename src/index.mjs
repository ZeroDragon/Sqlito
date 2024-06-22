import { readFileSync, readdirSync } from 'fs'
import yaml from 'js-yaml'

const { DATABASE_LOCATION, PORT, INDEX_BY } = process.env
const INDEXES = INDEX_BY.split(',')

const entries = readdirSync(DATABASE_LOCATION)
  .filter((file) => file.endsWith('.md'))
  .map(file => file.replace('.md', ''))
  .sort()
  .map(entry => {
    const [data] = readFileSync(`${DATABASE_LOCATION}/${entry}.md`, 'utf-8').split('\n\n')
    return { meta: yaml.load(data).meta, entry }
  })
  .map(({ meta, entry: location }) => {
    const retVal = { location }
    INDEXES.forEach((index) => {
      retVal[index] = meta[index]
    })
    return retVal
  })

console.log(entries)
