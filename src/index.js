import React from 'react'
import PropTypes from 'prop-types'

const FootnotesContext = React.createContext({})

export const FootnoteRef = props => {
  const { description } = props
  const {
    footnotes,
    footnotesTitleId,
    getFootnoteRefId,
    getFootnoteId,
    register,
  } = React.useContext(FootnotesContext)
  const idRef = React.useMemo(() => getFootnoteRefId(props), [
    getFootnoteRefId,
    props,
  ])
  const idNote = React.useMemo(() => getFootnoteId(props), [
    getFootnoteId,
    props,
  ])
  const footnote = React.useMemo(() => ({ idRef, idNote, description }), [
    idRef,
    idNote,
    description,
  ])

  // It is not possible to update the React state on the server, still the
  // footnote references need to be registered so the footnotes can be rendered.
  // In that case, we mutate the state directly so the footnotes work with SSR.
  if (!footnotes.has(footnote.idRef)) {
    footnotes.set(footnote.idRef, footnote)
  }

  // Once the application mounts, the footnotes state has been emptied and we
  // can properly register the current footnote in it, and unregister it if it
  // was to unmount.
  React.useEffect(() => {
    const unregister = register(footnote)

    return () => unregister()
  }, [register, footnote])

  return (
    <a
      className={props.className}
      style={props.style}
      id={idRef}
      href={`#${idNote}`}
      role='doc-noteref'
      aria-describedby={footnotesTitleId}
      data-a11y-footnotes-ref
    >
      {props.children}
    </a>
  )
}

FootnoteRef.propTypes = {
  description: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  id: PropTypes.string,
}

export const Footnotes = props => {
  const { footnotes, footnotesTitleId } = React.useContext(FootnotesContext)
  const { Wrapper, Title, List, ListItem, BackLink } = props

  if (footnotes.size === 0) return null

  const references = Array.from(footnotes.values())

  return (
    <Wrapper data-a11y-footnotes-footer role='doc-endnotes'>
      <Title data-a11y-footnotes-title id={footnotesTitleId} />
      <List data-a11y-footnotes-list>
        {references.map(({ idNote, idRef, description }, index) => (
          <ListItem
            id={idNote}
            key={idNote}
            data-a11y-footnotes-list-item
            role='doc-endnote'
          >
            {description}&nbsp;
            <BackLink
              data-a11y-footnotes-back-link
              href={'#' + idRef}
              aria-label={`Back to reference ${index + 1}`}
              role='doc-backlink'
            />
          </ListItem>
        ))}
      </List>
    </Wrapper>
  )
}

Footnotes.defaultProps = {
  Wrapper: 'footer',
  Title: props => <h2 {...props}>Footnotes</h2>,
  List: 'ol',
  ListItem: 'li',
  BackLink: props => <a {...props}>↩</a>,
}

export const FootnotesProvider = ({ children, footnotesTitleId }) => {
  const [footnotes, setFootnotes] = React.useState(new Map())
  const getBaseId = React.useCallback(
    ({ id, children }) => id || getIdFromTree(children),
    []
  )
  const getFootnoteRefId = React.useCallback(
    props => getBaseId(props) + '-ref',
    [getBaseId]
  )
  const getFootnoteId = React.useCallback(props => getBaseId(props) + '-note', [
    getBaseId,
  ])

  // When JavaScript kicks in and the application mounts, reset the footnotes
  // store which was mutated by every reference.
  React.useEffect(() => setFootnotes(new Map()), [])

  const register = React.useCallback(footnote => {
    setFootnotes(footnotes => {
      const clone = new Map(footnotes)
      if (!clone.has(footnote.idRef)) clone.set(footnote.ifRef, footnote)
      return clone
    })

    // Return a function which can be used to unregister the footnote. This
    // makes it convenient to register a footnote reference on mount, and
    // unregister it on unmount.
    return () => {
      setFootnotes(footnotes => {
        const clone = new Map(footnotes)
        clone.delete(footnote.idRef)
        return clone
      })
    }
  }, [])

  return (
    <FootnotesContext.Provider
      value={{
        footnotes,
        footnotesTitleId,
        getFootnoteRefId,
        getFootnoteId,
        register,
      }}
    >
      {children}
    </FootnotesContext.Provider>
  )
}

FootnotesProvider.defaultProps = {
  footnotesTitleId: 'footnotes-label',
}

function getTextFromTree(tree) {
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

export function getIdFromTree(tree) {
  return (
    getTextFromTree(tree)
      .toLowerCase()
      // Remove any character that is not a letter, a number, an hyphen or an
      // underscore, regardless of casing
      .replace(/[^a-z0-9-_\s]/g, '')
      // Replace all spaces with hyphens
      .replace(/\s+/g, '-')
  )
}
