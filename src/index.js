import React from 'react'
import PropTypes from 'prop-types'
import { getIdFromTree } from './utils'

const FootnotesContext = React.createContext({})

export const FootnoteRef = props => {
  const { description } = props
  const {
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

  React.useEffect(() => register(footnote), [register, footnote])

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
  description: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  id: PropTypes.string,
}

export const Footnotes = props => {
  const { footnotes, footnotesTitleId } = React.useContext(FootnotesContext)
  const { Wrapper, Title, List, ListItem, BackLink } = props

  if (footnotes.length === 0) return null

  return (
    <Wrapper data-a11y-footnotes-footer role='doc-endnotes'>
      <Title data-a11y-footnotes-title id={footnotesTitleId} />
      <List data-a11y-footnotes-list>
        {footnotes.map(({ idNote, idRef, description }) => (
          <ListItem id={idNote} key={idNote} data-a11y-footnotes-list-item>
            {description}{' '}
            <BackLink
              data-a11y-footnotes-back-link
              href={'#' + idRef}
              aria-label='Back to content'
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
  const [footnotes, setFootnotes] = React.useState([])
  const addFootnote = React.useCallback(footnote => {
    setFootnotes(footnotes =>
      footnotes.filter(f => f.idRef !== footnote.idRef).concat(footnote)
    )
  }, [])
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

  return (
    <FootnotesContext.Provider
      value={{
        footnotes,
        footnotesTitleId,
        getFootnoteRefId,
        getFootnoteId,
        register: addFootnote,
      }}
    >
      {children}
    </FootnotesContext.Provider>
  )
}

FootnotesProvider.defaultProps = {
  footnotesTitleId: 'footnotes-label',
}
