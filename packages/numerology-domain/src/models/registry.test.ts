import { describe, expect, it } from 'vitest'
import { getModel, listModels } from './registry'

describe('registry de modelos', () => {
  it('resolve o modelo pitagórico', () => {
    const result = getModel('pythagorean')
    expect(result.ok).toBe(true)
  })

  it('retorna erro explícito para escola ainda não registrada', () => {
    expect(getModel('chaldean')).toMatchObject({ ok: false, error: { code: 'unknown-model', model: 'chaldean' } })
  })

  it('lista os modelos registrados', () => {
    expect(listModels().map((model) => model.id)).toEqual(['pythagorean'])
  })
})
