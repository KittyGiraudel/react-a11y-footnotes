import React from 'react'
import { Footnotes, FootnotesProvider, FootnoteRef } from './'
import { getIdFromTree } from './utils'
import { render, configure, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

configure({ testIdAttribute: 'id' })

describe('The `getIdFromTree` helper', () => {
  it('should handle strings', () => {
    expect(getIdFromTree('hi')).toEqual('hi')
  })

  it('should handle trees', () => {
    expect(getIdFromTree(<>hi</>)).toEqual('hi')
    expect(getIdFromTree(<>hi i’m Kitty!</>)).toEqual('hi-im-kitty')
  })
})

describe('The `FootnoteRef` component', () => {
  it('should render an anchor', () => {
    render(
      <FootnotesProvider>
        <FootnoteRef description='CSS Counters are nice'>
          CSS counters
        </FootnoteRef>
      </FootnotesProvider>
    )

    const anchor = screen.getByTestId('css-counters-ref')
    expect(anchor).toHaveAttribute('id', 'css-counters-ref')
    expect(anchor).toHaveAttribute('href', '#css-counters-note')
  })

  it('should use provided id if any', () => {
    render(
      <FootnotesProvider>
        <FootnoteRef description='CSS Counters are nice' id='foobar'>
          CSS counters
        </FootnoteRef>
      </FootnotesProvider>
    )

    const anchor = screen.getByTestId('foobar-ref')
    expect(anchor).toHaveAttribute('id', 'foobar-ref')
    expect(anchor).toHaveAttribute('href', '#foobar-note')
    expect(anchor).toHaveAttribute('role', 'doc-noteref')
  })

  it('should provide styling capacities', () => {
    render(
      <FootnotesProvider>
        <FootnoteRef
          description='CSS Counters are nice'
          className='FootnoteRef'
          style={{ color: 'red' }}
        >
          CSS counters
        </FootnoteRef>
      </FootnotesProvider>
    )
    const anchor = screen.getByTestId('css-counters-ref')
    expect(anchor).toHaveAttribute('data-a11y-footnotes-ref')
    expect(anchor).toHaveAttribute('class', 'FootnoteRef')
    expect(anchor).toHaveAttribute('style', 'color: red;')
  })
})

describe('The `Footnotes` component', () => {
  it('should render nothing if there are no footnotes', () => {
    const { container } = render(
      <FootnotesProvider>
        <Footnotes />
      </FootnotesProvider>
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('should render footnotes if any', () => {
    render(
      <FootnotesProvider>
        <FootnoteRef description='CSS Counters are nice'>
          CSS counters
        </FootnoteRef>
        <Footnotes />
      </FootnotesProvider>
    )

    screen.getByTestId('css-counters-note')
  })

  it('should use provided `footnotesTitleId`', () => {
    render(
      <FootnotesProvider footnotesTitleId='foobar'>
        <FootnoteRef description='CSS Counters are nice'>
          CSS counters
        </FootnoteRef>
        <Footnotes />
      </FootnotesProvider>
    )

    screen.getByTestId('foobar')
    const footnote = screen.getByTestId('css-counters-ref')
    expect(footnote).toHaveAttribute('aria-describedby', 'foobar')
  })

  it('should provided styling capacity', () => {
    render(
      <FootnotesProvider footnotesTitleId='foobar'>
        <FootnoteRef description='CSS Counters are nice'>
          CSS counters
        </FootnoteRef>
        <Footnotes
          Wrapper={props => <footer {...props} id='test-wrapper' />}
          Title={props => <h3 {...props} id='test-title' />}
          List={props => <ul {...props} id='test-list' />}
          ListItem={props => <li {...props} id='test-list-item' />}
          BackLink={props => <a {...props} id='test-back-link' />}
        />
      </FootnotesProvider>
    )

    expect(screen.getByTestId('test-wrapper')).toHaveAttribute(
      'data-a11y-footnotes-footer'
    )
    expect(screen.getByTestId('test-title')).toHaveAttribute(
      'data-a11y-footnotes-title'
    )
    expect(screen.getByTestId('test-list')).toHaveAttribute(
      'data-a11y-footnotes-list'
    )
    expect(screen.getByTestId('test-list-item')).toHaveAttribute(
      'data-a11y-footnotes-list-item'
    )
    expect(screen.getByTestId('test-back-link')).toHaveAttribute(
      'data-a11y-footnotes-back-link'
    )
  })
})
