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
  getTextFromTree(tree)
    .toLowerCase()
    // Remove any character that is not a letter, a number, an hyphen or an
    // underscore, regardless of casing
    .replace(/[^a-z0-9-_\s]/g, '')
    // Replace all spaces with hyphens
    .replace(/\s+/g, '-')
