if (typeof crypto === 'undefined') {
  const crypto = require('crypto')
  globalThis.crypto = {
  	getRandomValues(buffer) {
      crypto.randomFillSync(buffer)
    },
  } as any
}