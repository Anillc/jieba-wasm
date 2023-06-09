import './polyfill'
import './wasm_exec'

declare global {
  var jieba: {
    load?(dict: string): string
    cutAll?(input: string): string | string[]
    cut?(input: string, hmm?: boolean): string | string[]
    cutForSearch?(input: string, hmm?: boolean): string | string[]
  }
}

export interface Jieba {
  cutAll(input: string): string[]
  cut(input: string, hmm?: boolean): string[]
  cutForSearch(input: string, hmm?: boolean): string[]
}

export interface InitOptions {
  wasm?: ArrayBuffer
  dict?: string
}

export async function init(options?: InitOptions): Promise<Jieba> {
  globalThis.jieba = {}
  let wasm: ArrayBuffer
  let dict: string
  if (options?.wasm) {
    wasm = options.wasm
  } else {
    wasm = await loadFile('jieba.wasm')
  }
  if (options?.dict) {
    dict = options.dict
  } else {
    dict = await loadFile('dict.txt', true)
  }

  const go = new Go()
  const { instance } = await WebAssembly.instantiate(wasm, go.importObject)
  go.run(instance)

  const result = globalThis.jieba.load(dict)
  if (result) {
    throw new Error(result)
  }
  return {
    cutAll(input) {
      const result = globalThis.jieba.cutAll(input)
      if (typeof result === 'string') {
        throw new Error(result)
      }
      return result
    },
    cut(input, hmm) {
      const result = globalThis.jieba.cut(input, hmm)
      if (typeof result === 'string') {
        throw new Error(result)
      }
      return result
    },
    cutForSearch(input, hmm) {
      const result = globalThis.jieba.cutForSearch(input, hmm)
      if (typeof result === 'string') {
        throw new Error(result)
      }
      return result
    },
  }
}

async function loadFile<T extends boolean = false>(
  path: string, string?: T,
): Promise<T extends true ? string : ArrayBuffer> {
  let result: any  
  if (typeof window === 'object') {
    result = await fetch(path).then(res => {
      if (string) {
        return res.text() as any
      } else {
        return res.arrayBuffer()
      }
    })
  } else {
    const { promises: fsp } = require('fs')
    const { resolve } = require('path')
    if (string) {
      const text = await fsp.readFile(resolve(__dirname, path), 'utf-8')
      result = text
    } else {
      const buffer = await fsp.readFile(resolve(__dirname, path))
      result = buffer.buffer
    }
  }
  return result
}
