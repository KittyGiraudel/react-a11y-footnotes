export const getTextFromTree = tree => {
  let text = ''

  if (typeof tree === 'string') {
    text += tree
  } else if (Array.isArray(tree)) {
    text += tree.map(getTextFromTree).join('')
  } else if (tree.props.children) {
    text += getTextFromTree(tree.props.children)
  }

  return text
}

export const getIdFromTree = tree =>
  getTextFromTree(tree).replace(/[^a-z-_]/g, '-')
