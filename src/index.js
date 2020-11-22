import React from 'react'
import PropTypes from 'prop-types'
import { getIdFromTree } from './utils'

const FootnotesContext = React.createContext({})

export const FootnoteRef = props => {
  const { description } = props
  const {
    footnotesLabelId,
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
      id={idRef}
      href={`#${idNote}`}
      className={props.className}
      aria-describedby={footnotesLabelId}
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
  const { footnotes, footnotesLabelId } = React.useContext(FootnotesContext)

  if (footnotes.length === 0) return null

  return (
    <props.Wrapper>
      <props.Title id={footnotesLabelId} />
      <props.List>
        {footnotes.map(({ idNote, idRef, description }) => (
          <props.ListItem id={idNote} key={idNote}>
            {description} <props.BackLink id={idRef} />
          </props.ListItem>
        ))}
      </props.List>
    </props.Wrapper>
  )
}

Footnotes.defaultProps = {
  Wrapper: 'footer',
  Title: props => <h2 {...props}>Footnotes</h2>,
  List: 'ol',
  ListItem: 'li',
  BackLink: props => (
    <a href={'#' + props.id} aria-label='Back to content'>
      ↩
    </a>
  ),
}

export const FootnotesProvider = props => {
  const [footnotes, setFootnotes] = React.useState([])
  const addFootnote = React.useCallback(footnote => {
    setFootnotes(footnotes =>
      footnotes.filter(f => f.idRef !== footnote.idRef).concat(footnote)
    )
  }, [])
  const getFootnoteRefId = React.useCallback(
    props => (props.id || getIdFromTree(props.children)) + '-ref',
    []
  )
  const getFootnoteId = React.useCallback(
    props => (props.id || getIdFromTree(props.children)) + '-note',
    []
  )

  return (
    <FootnotesContext.Provider
      value={{
        footnotes,
        footnotesLabelId: props.footnotesLabelId || 'footnotes-label',
        getFootnoteRefId,
        getFootnoteId,
        register: addFootnote,
      }}
    >
      {props.children}
    </FootnotesContext.Provider>
  )
}
