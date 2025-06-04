module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'deprecation', "testing-library"],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    overrides: [
        {
            "files": ["__tests__/**/*"],
            "env": {
                "jest": true
            }
        }
    ],
    rules: {
        'deprecation/deprecation': 'warn',
    },
}