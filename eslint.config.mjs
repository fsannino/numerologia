import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'

const PURE_LAYERS = [
  'packages/shared-kernel/src/**/*.ts',
  'packages/numerology-domain/src/**/*.ts',
  'packages/numerology-application/src/**/*.ts',
]

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/dist/**',
      'apps/web/next-env.d.ts',
    ],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-console': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
  },
  {
    // Guarda mecânica do R1/ADR-0001: domínio e aplicação são TS puros.
    files: PURE_LAYERS,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['react', 'react-*', 'next', 'next/*', '@supabase/*', 'node:*', 'fs', 'path', 'http', 'crypto'],
              message:
                'Camadas de domínio/aplicação não importam framework, DOM nem Node (R1, ADR-0001). Inverta com um port.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['apps/web/src/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: { ...reactHooks.configs.recommended.rules },
  },
)
