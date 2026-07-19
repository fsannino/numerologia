import { describe, expect, it } from 'vitest'
import { getModel, listModels } from './registry'

describe('registry de modelos', () => {
  it('resolve as escolas registradas', () => {
    expect(getModel('pythagorean').ok).toBe(true)
    expect(getModel('chaldean').ok).toBe(true)
    expect(getModel('lo-shu').ok).toBe(true)
    expect(getModel('gematria').ok).toBe(true)
  })

  it('retorna erro explícito para escola ainda não registrada', () => {
    expect(getModel('vedic')).toMatchObject({ ok: false, error: { code: 'unknown-model', model: 'vedic' } })
  })

  it('lista os modelos registrados', () => {
    expect(listModels().map((model) => model.id)).toEqual(['pythagorean', 'chaldean', 'lo-shu', 'gematria'])
  })
})
