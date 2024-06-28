import { readFileSync, readdirSync } from 'fs'
import SmallFish from './smallFish.mjs'
import yamler from './yamlight.mjs'

class Sqlito {
  constructor (dbLoc, idxb, fileType = 'md') {
    this.memory = new SmallFish()
    this.INDEXES = idxb
    this.ENTRIES = readdirSync(dbLoc)
      .filter((file) => file.endsWith(`.${fileType}`))
      .map(file => file.replace(`.${fileType}`, ''))
      .sort()
      .map(entry => {
        const [data] = readFileSync(`${dbLoc}/${entry}.${fileType}`, 'utf-8')
          .split('\n\n')
        return { meta: yamler(data).meta, entry }
      })
      .map(({ meta, entry: location }) => {
        const retVal = { location }
        idxb.forEach((index) => {
          retVal[index] = meta[index]
        })
        return retVal
      })
  }

  normalizeText = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  allFromTag = (tag) => {
    const prev = this.memory.get(`tag-${tag}`)
    if (prev) return prev
    const retval = this.ENTRIES.filter(entry => {
      return entry.tags
        .map(tag => tag.toLowerCase())
        .includes(tag.toLowerCase())
    })
    this.memory.set({ key: `tag-${tag}`, value: retval })
    return retval
  }

  allWithText = (text) => {
    if (text.length < 3) return []
    const prev = this.memory.get(`text-${text}`)
    if (prev) return prev
    const normalizedText = this.normalizeText(text.toLowerCase())
    const comparisons = this.ENTRIES
      .map(entry => {
        const test = this.INDEXES
          .map(index => {
            return (Array.isArray(entry[index])) ? entry[index].join(' ') : entry[index]
          })
          .map(text => this.normalizeText(text.toLowerCase()))
          .filter(text => text.includes(normalizedText))
        return { matches: test, location: entry.location }
      })
      .filter(({ matches }) => matches.length > 0)
      .map(({ location }) => this.ENTRIES.find(entry => entry.location === location))
    this.memory.set({ key: `text-${text}`, value: comparisons })
    return comparisons
  }
}

export default Sqlito
