import type { ModelId } from '@numerus/numerology-domain'

/**
 * Comparação de assinaturas (§2.3, item 5): o nome de registro vs. o nome
 * usado no dia a dia, revelando o "delta vibracional" entre eles. Só entram
 * números do nome — os derivados de data não mudam com a assinatura.
 */
export type CompareSignaturesCommand = {
  readonly registrationName: string
  readonly signatureName: string
  readonly models: ReadonlyArray<ModelId>
  readonly variantSelections?: Readonly<Record<string, string>>
}
