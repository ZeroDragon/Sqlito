class SmallFish {
  constructor (ttl = 86.4e6) {
    this.memory = {}
    this.ttl = ttl
  }

  set = (params) => {
    this.memory[params.key] = params.value
    this.memory[params.key].timestamp = Date.now()
    this.memory[params.key].ttl = params.ttl || this.ttl
  }

  get = (key) => {
    if (this.memory[key] && this.memory[key].ttl) {
      if (Date.now() - this.memory[key].timestamp > this.memory[key].ttl) {
        return this.del(key)
      }
    }
    return this.memory[key] || null
  }

  del = (key) => {
    delete this.memory[key]
    return null
  }
}

export default SmallFish
