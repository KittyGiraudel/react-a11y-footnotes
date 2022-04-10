# react-a11y-footnotes

react-a11y-dialog is a thin React component to ease the use of accessible footnotes in React applications. This implementation is heavily inspired by [Accessible footnotes with CSS](https://www.sitepoint.com/accessible-footnotes-css/).

Find a [complete demo on CodeSandbox](https://codesandbox.io/s/footnotes-forked-pq135).

- [Install](#install)
- [Terminology](#terminology)
- [Usage](#usage)
- [API](#api)
  - [`FootnotesProvider`](#footnotesprovider)
  - [`FootnoteRef`](#footnoteref)
  - [`Footnotes`](#footnotes)
- [Styling](#styling)
  - [Using base styles](#using-base-styles)
    - [With a bundler](#with-a-bundler)
    - [Without a bundler](#with-a-bundler)
  - [Customisation](#customisation)
    - [With CSS](#with-css)
    - [With CSS-in-JS](#with-css-in-js)
- [ID generation](#id-generation)
- [Example](#example)

## Install

```sh
npm install react-a11y-footnotes
```

## Terminology

- **Footnotes**: the additional information present at the bottom of a content area using footnote references.
- **Footnote reference**: a text segment offering more information in the footnotes.

![Footnotes](./terminology.png)

## Usage

The library exports 3 parts, all necessary to make everything work correctly:

- `FootnotesProvider`: a component with no HTML footprint, that needs to wrap the content part of your application.
- `FootnoteRef`: an inline component wrapping a footnote reference, rendering an anchor link (`<a>`) to the correct footnote in the footer.
- `Footnotes`: a component rendering the actual footnotes, usually placed at the end of the content area.

## API

### `FootnotesProvider`

The `footnotesTitleId` prop can be passed to customise the `id` attribute assigned to the title rendered by `Footnotes` and referenced in every singled `FootnoteRef`.

If you are going to customise the `Title` prop from `Footnotes`, make sure to render `props.id` in the DOM, as this is how the value of `footnotesTitleId` is mapped between the references and the footnotes.

### `FootnoteRef`

The `FootnoteRef` renders a link like this:

```html
<a
  id="css-counters-ref"
  href="#css-counters-note"
  aria-describedby="footnotes-label"
  role="doc-noteref"
  >CSS counters</a
>
```

- The `description` prop is mandatory and contains the content of the footnote. It can be a string or a React tree.
- The `id` prop can be passed to handle `id` manually, otherwise it is automatically generated from the reference content.
- The `style` and `className` props can be freely passed through in order to enable styling with CSS-in-JS libraries (see [Styling](#styling) section).

As you can see, the footnote reference itself does not contain a number (e.g. `[1]`) on an asterisk (`*`). This is done in CSS with pseudo-elements. If CSS does not render, the links still work and the footnotes still make sense, no big deal.

### `Footnotes`

The `Footnotes` component renders a HTML structure like this:

```html
<footer role="doc-endnotes">
  <h2 id="footnotes-label">Footnotes</h2>
  <ol>
    <li id="css-counters-note" role="doc-endnote">
      CSS counters are, in essence, variables maintained by CSS whose values may
      be incremented by CSS rules to track how many times they’re used.
      <a
        href="#css-counters-ref"
        aria-label="Back to reference 1"
        role="doc-backlink"
        >↩</a
      >
    </li>
  </ol>
</footer>
```

- The `Wrapper` prop can be passed to customise the wrapper. It is `'footer'` by default to render a `<footer>` HTML element, and can accept any React component. This wrapper is technically not mandatory and could be replaced with a `React.Fragment`.

- The `Title` prop can be passed to customise the title. It is `props => <h2 {...props}>Footnotes</h2>` by default to render a title level 2 named “Footnotes”, and can accept any React component. This component can be [visually hidden](https://hugogiraudel.com/2016/10/13/css-hide-and-seek/) but **it should still be present accessible**!

- The `List` prop can be passed to customise the list. It is `'ol'` by default to render a `<ol>` HTML element, and can accept any React component.

- The `ListItem` prop can be passed to customise the list. It is `'li'` by default to render a `<li>` HTML element, and can accept any React component.

- The `BackLink` prop can be passed to customise the link back to the reference with each list item. It is `props => <a {...props}>↩</a>` by default to render a link containing `↩`, and can accepted any component.

## Styling

Styling is left at the description of the author. That being said, some very basic styling are packaged with the library and can be used if deemed necessary.

### Using base styles

#### With a bundler

If you are using a module bundler like webpack or parcel, you can import them where you import the component.

```js
// Import the components
import { FootnotesProvider, FootnoteRef, Footnotes } from 'react-a11y-footnotes'

// And the styles
import 'react-a11y-footnotes/dist/styles.css'
```

#### Without a bundler

If you’re not using a bundler you can find the styles at:

```
your-app/node_modules/react-a11y-footnotes/dist/styles.css
```

Include this file however you include the rest of your stylesheets. Alternatively, you can use a CDN like Unpkg, but this is not recommended for production apps.

```html
<link
  rel="stylesheet"
  type="text/css"
  href="https://unpkg.com/react-a11y-footnotes@<version>/dist/styles.css"
/>
```

### Overriding and customisation

#### With CSS

The library provides namespaced data attributes as styling anchors:

- `data-a11y-footnotes-ref`: applied to every single footnote reference
- `data-a11y-footnotes-footer`: applied to the footnotes wrapper
- `data-a11y-footnotes-title`: applied to the footnotes title
- `data-a11y-footnotes-list`: applied to the footnotes list
- `data-a11y-footnotes-list-item`: applied to every individual footnote
- `data-a11y-footnotes-back-link`: applied to every individual back link

#### With CSS-in-JS

Given every component rendered by the `Footnotes` component is customisable, and `FootnoteRef` accept both `style` and `className`, integration with CSS-in-JS libraries should be relatively seamless.

For instance, the `FootnoteRef` could be wrapped as such with [Fela](https://fela.js.org):

```js
const refStyles = () => ({ color: 'deeppink' })
const Ref = createComponentWithProxy(refStyles, FootnoteRef)
```

And with [styled-components](https://styled-components.com):

```js
const Ref = styled(FootnoteRef)`
  color: deeppink;
`
```

## ID generation

For a reference to link to its relevant footnote, and for the latter to provide a link back to the reference, there is an automatic system for resolving identifiers—regardless whether `id` is passed to the reference or not.

Consider a reference which receives an `id` prop named `foobar` (`<FootnoteRef id="foobar">`). The underlying anchor element will actually receive `foobar-ref` as an `id` (`<a id="foobar-ref">`). Similarly, the relevant footnote will receive `foobar-note` as an `id` (`<li id="foobar-note">`). This behaviour cannot be changed.

If no `id` is passed to references (`<FootnoteRef>`)—which is usually the case—the `id` will be computed from the content of the reference. For instance if the text says “CSS counters”, the resolved identifiers will be `css-counters-ref` and `css-counters-note`.

## Example

Find a [complete demo on CodeSandbox](https://codesandbox.io/s/footnotes-v34hm).

```js
import {
  FootnotesProvider,
  FootnoteRef as Ref,
  Footnotes,
} from 'react-a11y-footnotes'

const YourComponent = props => {
  return (
    <FootnotesProvider>
      <p>
        Maintaining{' '}
        <Ref description='Footnotes are notes placed at the bottom of a page. They cite references or comment on a designated part of the text above it.'>
          footnotes
        </Ref>{' '}
        manually can be a pain. By using{' '}
        <Ref description='Cascading Style Sheets'>CSS</Ref>{' '}
        <Ref
          id='with-a-custom-id'
          description={
            <>
              <a
                href='https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Lists_and_Counters/Using_CSS_counters'
                target='_blank'
                rel='noopener noreferrer'
              >
                CSS counters
              </a>{' '}
              are, in essence, variables maintained by CSS whose values may be
              incremented by CSS rules to track how many times they’re used.
            </>
          }
        >
          counters
        </Ref>{' '}
        to add the numbered references in the text and an ordered list to
        display the actual footnotes in the footer, it becomes extremely easy.
      </p>

      <Footnotes />
    </FootnotesProvider>
  )
}
```
