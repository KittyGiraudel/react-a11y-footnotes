import React, { CSSProperties } from 'react'

declare module 'react-a11y-footnotes' {
	export interface FootnotesProviderProps {
		footnotesTitleId?: string
	}
	export const FootnotesProvider: React.FC<FootnotesProviderProps>

	interface FootnoteRefProps {
		description: string | JSX.Element
		id?: string
		style?: CSSProperties
		className?: string
	}
	export const FootnoteRef: React.FC<FootnoteRefProps>

	export interface TitleProps {
		id: string
	}

	export interface BackLinkProps {
		'data-a11y-footnotes-back-link': boolean
		href: string
		'aria-label': string
		role: string
	}

	export interface ListItemProps{
		id: string
		key: string
		role: string
	}

	export type Element<P = {}> =
		| React.ElementType<React.HTMLAttributes<HTMLElement>>
		| React.FunctionComponent<P>
		| React.Component<P>

	export interface FootnotesProps {
		Wrapper?: Element
		Title?: Element<TitleProps>
		List?: Element
		ListItem?: Element<ListItemProps>
		BackLink?: Element<BackLinkProps>
	}

	export const Footnotes: React.FunctionComponent<FootnotesProps>
}
