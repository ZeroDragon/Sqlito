const parseYaml = (yamlString) => {
  const lines = yamlString.split('\n')
  const result = {}
  let currentObject = result
  let currentIndent = 0
  const keyHistory = []

  for (const line of lines) {
    // Ignore empty lines
    if (line.trim() === '') continue
    // If line does not have a colon, it is a value or a list
    if (line.indexOf(':') === -1) {
      const prevKey = keyHistory[keyHistory.length - 1]
      // If the line starts with a dash, it is a list item
      if (line.trim().startsWith('-')) {
        if (!Array.isArray(currentObject[prevKey])) currentObject[prevKey] = []
        currentObject[prevKey].push(line.trim().substring(1).trim())
        continue
      }
      // If the line is a value, assign it to the previous key
      currentObject[prevKey] = line.trim()
      continue
    }
    // Set key, value and indent
    const [key, ...values] = line.split(':').map((part) => part.trim())
    const value = values.join(':')
    if (!key) continue
    const indent = line.match(/^\s*/)[0].length
    // If the indent is greater than the current indent, go deeper
    if (indent > currentIndent) {
      const prevKey = keyHistory[keyHistory.length - 1]
      currentObject = currentObject[prevKey]
      currentIndent = indent
    }
    // If the indent is less than the current indent, go back
    if (indent < currentIndent) {
      const times = (currentIndent - indent) / 2
      for (let i = 0; i < times; i++) {
        keyHistory.pop()
      }
      currentObject = result
      keyHistory.forEach((key) => {
        currentObject = currentObject[key]
      })
      currentIndent = indent
    }
    // Indent is the same, assign the value to the
    currentObject[key] = value || {}
    // If the value is empty, push the key to the history for it is an object
    if (value === '') keyHistory.push(key)
  }
  return result
}

export default parseYaml
