class SmallFish {
  constructor (ttl = 86.4e6) {
    this.memory = {}
    this.ttl = ttl
    this.timer = setInterval(() => {
      Object.keys(this.memory).forEach((key) => {
        if (this.memory[key].ttl) {
          if (Date.now() - this.memory[key].timestamp > this.memory[key].ttl) {
            delete this.memory[key]
          }
        }
      })
    }, 3e5)
  }

  set = (params) => {
    this.memory[params.key] = params.value
    this.memory[params.key].timestamp = Date.now()
    this.memory[params.key].ttl = params.ttl || this.ttl
  }

  get = (key) => {
    return this.memory[key] || null
  }
}

export default SmallFish
