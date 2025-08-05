import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import boundaries from 'eslint-plugin-boundaries';
import importPlugin from 'eslint-plugin-import';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import unicorn from 'eslint-plugin-unicorn';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['**/*.d.ts', '**/*.js', '**/*.mjs', '**/*.spec.ts', '**/generated', '**/seed']
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname }
    }
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  prettierRecommended,
  {
    settings: {
      'import/resolver': { typescript: { alwaysTryTypes: true, project: 'tsconfig.json' } }
    }
  },
  importPlugin.flatConfigs.errors,
  importPlugin.flatConfigs.warnings,
  {
    plugins: {
      '@stylistic': stylistic,
      unicorn
    },
    rules: {
      // Чуть меняем дефолтные правила
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-magic-numbers': [
        'warn',
        {
          ignore: [-1, 1, 0, 60, 100, 1000],
          ignoreArrayIndexes: true,
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
          ignoreTypeIndexes: true
        }
      ],
      '@typescript-eslint/no-shadow': ['warn'],
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'all', caughtErrorsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/prefer-promise-reject-errors': ['error', { allowThrowingAny: true, allowThrowingUnknown: true }],
      '@typescript-eslint/return-await': ['error', 'never'],
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/typedef': ['warn', { arrowParameter: false, memberVariableDeclaration: false }],
      '@typescript-eslint/unbound-method': 'off',

      // Дополняем своими правилами
      '@stylistic/member-delimiter-style': [
        'error',
        { multiline: { delimiter: 'semi', requireLast: true }, singleline: { delimiter: 'semi', requireLast: false } }
      ],
      '@typescript-eslint/array-type': ['error', { default: 'generic' }],
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as' }],
      '@typescript-eslint/member-ordering': ['warn', { default: ['field', 'constructor', 'method'] }],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['PascalCase', 'camelCase'],
          leadingUnderscore: 'allow',
          custom: { match: true, regex: '^[a-zA-Z0-9$_-]*$' }
        },
        {
          selector: ['class', 'enum', 'interface', 'typeAlias', 'typeParameter'],
          format: ['PascalCase'],
          custom: { match: true, regex: '^[a-zA-Z0-9]*$' }
        },
        {
          selector: ['classMethod', 'classProperty'],
          format: ['camelCase'],
          leadingUnderscore: 'forbid',
          custom: { match: true, regex: '^[a-zA-Z0-9$]*$' }
        },
        {
          selector: ['function'],
          format: ['PascalCase', 'camelCase'],
          custom: { match: true, regex: '^[a-zA-Z0-9]*$' }
        },
        {
          selector: ['enumMember'],
          format: ['UPPER_CASE'],
          custom: { match: true, regex: '^[A-Z0-9_]*$' }
        },
        {
          selector: 'objectLiteralProperty',
          format: null
        }
      ],
      '@typescript-eslint/no-array-constructor': 'error',
      '@typescript-eslint/no-deprecated': 'warn',
      '@typescript-eslint/only-throw-error': 'error',
      'constructor-super': 'error',
      curly: 'error',
      eqeqeq: 'error',
      'default-case': 'error',
      'default-case-last': 'error',
      'import/default': 'error',
      'import/no-named-as-default': 'off',
      'import/newline-after-import': ['error', { considerComments: true }],
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'import/named': 'off',
      'import/no-anonymous-default-export': 'error',
      'import/no-unresolved': 'error',
      'import/no-webpack-loader-syntax': 'error',
      'import/no-useless-path-segments': 'error',
      'import/no-unused-modules': 'error',
      'import/no-self-import': 'error',
      'import/no-duplicates': ['error', { 'prefer-inline': true }],
      'import/order': [
        'warn',
        {
          groups: [['builtin', 'internal', 'external'], 'sibling'],
          alphabetize: { order: 'asc', caseInsensitive: true }
        }
      ],
      'import/no-restricted-paths': [
        'warn',
        {
          zones: [
            { target: './src/web', from: './src/app', message: '"web" не может зависеть от "app"' },
            { target: './src/app', from: './src/web', message: '"app" не может зависеть от "web"' },
            { target: './src/utils', from: './src/app', message: '"utils" не может зависеть от "app"' },
            { target: './src/utils', from: './src/web', message: '"utils" не может зависеть от "web"' }
          ]
        }
      ],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': ['warn'],
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'no-empty-function': 'off',
      'no-irregular-whitespace': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: "PropertyDefinition[accessibility='private']",
          message: 'Используй приватные поля класса (#private) '
        },
        {
          selector: "MethodDefinition[kind!='constructor'][accessibility='private']",
          message: 'Используй приватные методы класса (#private)'
        },
        {
          selector: 'MethodDefinition[static=true] ThisExpression',
          message: '"this" нельзя использовать внутри static методов'
        },
        {
          selector: ':matches(ExportAllDeclaration, ExportNamedDeclaration)[source!=null][source.value!=/^\\./]',
          message: 'Разрешены только относительные реэкспорты'
        },
        {
          selector: "PropertyDefinition[value.type='ArrowFunctionExpression'][value.returnType=undefined]",
          message: 'Нужно указать return type для стрелочных функций класса'
        },
        {
          selector: "MethodDefinition[kind='method'][value.type='FunctionExpression'][value.returnType=undefined]",
          message: 'Нужно указать return type для методов класса'
        }
      ],
      'no-return-await': 'off',
      'no-unreachable': 'warn',
      'no-unused-private-class-members': ['warn'],
      'no-useless-escape': 'warn',
      'object-shorthand': ['warn', 'properties'],
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: '*', next: 'throw' },
        { blankLine: 'always', prev: 'if', next: '*' },
        { blankLine: 'always', prev: 'for', next: '*' },
        { blankLine: 'always', prev: 'try', next: '*' },
        { blankLine: 'always', prev: 'switch', next: '*' }
      ],
      'max-len': [
        'error',
        {
          code: 140,
          ignoreComments: true,
          ignoreTrailingComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          ignoreUrls: true,
          ignorePattern: '^(import|export|\\} from) .+'
        }
      ],
      'prefer-const': ['warn', { destructuring: 'all' }],
      'spaced-comment': ['warn', 'always', { markers: ['/'] }],
      yoda: ['error', 'never'],

      // Настраиваем unicorn
      'unicorn/catch-error-name': ['error', { name: 'error' }],
      'unicorn/switch-case-braces': ['error', 'always'],
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      'unicorn/new-for-builtins': 'error',
      'unicorn/no-instanceof-array': 'error',
      'unicorn/no-invalid-remove-event-listener': 'error',
      'unicorn/no-array-for-each': 'error',
      'unicorn/no-single-promise-in-promise-methods': 'warn',
      'unicorn/no-await-in-promise-methods': 'error',
      'unicorn/no-anonymous-default-export': 'off',
      'unicorn/error-message': 'error',
      'unicorn/prefer-add-event-listener': 'error',
      'unicorn/prefer-array-find': 'error',
      'unicorn/prefer-array-flat-map': 'error',
      'unicorn/prefer-array-flat': 'error',
      'unicorn/prefer-array-index-of': 'error',
      'unicorn/prefer-array-some': 'error',
      'unicorn/prefer-at': ['error', { checkAllIndexAccess: false }],
      'unicorn/prefer-reflect-apply': 'error',
      'unicorn/prefer-default-parameters': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-logical-operator-over-ternary': 'error',
      'unicorn/prefer-negative-index': 'error',
      'unicorn/prefer-object-from-entries': 'error',
      'unicorn/prefer-string-replace-all': 'warn',
      'unicorn/prefer-string-slice': 'error',
      'unicorn/prefer-string-raw': 'error',
      'unicorn/prefer-string-starts-ends-with': 'error',
      'unicorn/prefer-type-error': 'error',
      'unicorn/prefer-switch': ['error', { minimumCases: 2, emptyDefaultCase: 'no-default-case' }],
      'unicorn/require-array-join-separator': 'error',
      'unicorn/require-number-to-fixed-digits-argument': 'error',
      'unicorn/throw-new-error': 'error'
    }
  },
  {
    plugins: { boundaries },
    settings: {
      'boundaries/include': ['src/**/*.{ts,tsx}'],
      'boundaries/elements': [
        { type: 'utils', pattern: 'src/utils/**/*', mode: 'file' },
        // { type: 'app', pattern: 'src/app/*/**/*', mode: 'file', capture: ['elName', 'subPath', 'fileName'] },
        // { type: 'web', pattern: 'src/web/*/**/*', mode: 'file', capture: ['elName', 'subPath', 'fileName'] },
        { type: 'components', pattern: 'src/web/components/*/*', mode: 'file', capture: ['elName', 'fileName'] },
        { type: 'views', pattern: 'src/web/pages/*/views/*/**/*', mode: 'file', capture: ['elName', 'subElName', 'subPath', 'fileName'] },
        { type: 'pages', pattern: 'src/web/pages/*/**/*', mode: 'file', capture: ['elName', 'subPath', 'fileName'] },
        { type: 'rest', pattern: 'src/**/*' },
        { type: 'unknown', pattern: 'unknown/**/*', mode: 'file' }
      ]
    },
    rules: {
      'boundaries/no-private': ['error', { allowUncles: false }],
      'boundaries/element-types': [
        'error',
        {
          default: 'allow',
          rules: [
            {
              from: ['pages', 'views'],
              disallow: [
                ['pages', { elName: '!${elName}' }],
                ['views', { elName: '!${elName}' }]
              ],
              message: "'${file.elName}' не может зависеть от '${dependency.elName}'"
            },
            {
              from: 'views',
              disallow: [['views', { elName: '${elName}', subElName: '!${subElName}' }]],
              message: "'${file.subElName}' не может зависеть от '${dependency.subElName}'"
            }
          ]
        }
      ]
    }
  }
]);
