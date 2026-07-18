import { describe, expect, it } from 'vitest'
import { getModel, listModels } from './registry'

describe('registry de modelos', () => {
  it('resolve as escolas registradas', () => {
    expect(getModel('pythagorean').ok).toBe(true)
    expect(getModel('chaldean').ok).toBe(true)
  })

  it('retorna erro explícito para escola ainda não registrada', () => {
    expect(getModel('gematria')).toMatchObject({ ok: false, error: { code: 'unknown-model', model: 'gematria' } })
  })

  it('lista os modelos registrados', () => {
    expect(listModels().map((model) => model.id)).toEqual(['pythagorean', 'chaldean'])
  })
})
