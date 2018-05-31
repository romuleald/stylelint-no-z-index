import stylelint from 'stylelint'

export const ruleName = 'plugin/no-z-index'
export const messages = stylelint.utils.ruleMessages(ruleName, {
    2: function _default() {
    return 'You should not use numeric values for z-index.';
  },
  'only-variables': function _default() {
    return 'You should use only variables for z-index.';
  },
  'all': function _default() {
    return 'You should use only variables or not numeric values for z-index.';
  }
})
const defaultAllowedValue = ['auto', 'inherit', 'initial', 'unset'];
const variableAllowedValue = ['^[@|$]'];

module.exports = stylelint.createPlugin(ruleName, (options) => (cssRoot, result) => {
  let allowedValue = [];
  switch (options) {
    case 2:
      allowedValue = defaultAllowedValue;
      break;
    case 'only-variables':
      allowedValue = variableAllowedValue;
      break;
    case 'all':
      allowedValue = defaultAllowedValue.concat(variableAllowedValue);
      break;
  }

  cssRoot.walkDecls('z-index', (decl) => {
    // Check if the z-index value is one of the following non-numeric values
    const value = decl.value
    if (allowedValue.filter(item => new RegExp(item).test(value)).length) {
      return;
    }
    const cssVarRegex = /var\(.*\)/
    if (cssVarRegex.test(value)) return

    stylelint.utils.report({
      ruleName: ruleName,
      result: result,
      node: decl,
      message: messages[options]()
    })
  })
})

module.exports.ruleName = ruleName
module.exports.messages = messages
