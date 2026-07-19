import type { Result } from '@numerus/shared-kernel'
import { err, ok } from '@numerus/shared-kernel'
import type { ModelId } from '../model-ids'
import type { NumerologyModel } from '../ports/numerology-model'
import { pythagoreanModel } from './pythagorean/pythagorean-model'
import { chaldeanModel } from './chaldean/chaldean-model'
import { loShuModel } from './lo-shu/lo-shu-model'
import { gematriaModel } from './gematria/gematria-model'
import { vedicModel } from './vedic/vedic-model'

export type UnknownModelError = { readonly code: 'unknown-model'; readonly model: string }

/**
 * Registry de estratégias (§4.3): adicionar uma escola = criar o diretório
 * dela em `models/` e acrescentá-la aqui. Nenhum outro arquivo muda.
 */
const MODELS: ReadonlyMap<ModelId, NumerologyModel> = new Map<ModelId, NumerologyModel>([
  [pythagoreanModel.id, pythagoreanModel],
  [chaldeanModel.id, chaldeanModel],
  [loShuModel.id, loShuModel],
  [gematriaModel.id, gematriaModel],
  [vedicModel.id, vedicModel],
])

export function getModel(id: ModelId): Result<NumerologyModel, UnknownModelError> {
  const model = MODELS.get(id)
  return model === undefined ? err({ code: 'unknown-model', model: id }) : ok(model)
}

export function listModels(): ReadonlyArray<NumerologyModel> {
  return [...MODELS.values()]
}
