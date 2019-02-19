/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';

/**
 * WordPress dependencies
 */
import { Path, SVG } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { InnerBlocks, BlockControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import VAlignToolbar from './VAlignToolbar';

export const name = 'core/column';

export const settings = {
	title: __( 'Column' ),

	parent: [ 'core/columns' ],

	icon: <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><Path fill="none" d="M0 0h24v24H0V0z" /><Path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16zm0-11.47L17.74 9 12 13.47 6.26 9 12 4.53z" /></SVG>,

	description: __( 'A single column within a columns block.' ),

	category: 'common',

	attributes: {
		verticalAlignment: {
			type: 'string',
		},
	},

	supports: {
		inserter: false,
		reusable: false,
		html: false,
	},

	edit( { attributes, setAttributes, isSelected } ) {
		const classes = classnames( {
			'block-core-columns': true,
			'is-selected': isSelected,
		} );

		const onSelection = ( alignment ) => setAttributes( { verticalAlignment: alignment } );

		return (
			<div className={ classes }>
				<BlockControls>
					<VAlignToolbar
						onSelection={ onSelection }
						alignment={ attributes.verticalAlignment }
					/>
				</BlockControls>
				<InnerBlocks templateLock={ false } />
			</div>
		);
	},
	save( { attributes } ) {
		const { verticalAlignment } = attributes;
		const wrapperClasses = classnames( {
			[ `is-vertically-aligned-${ verticalAlignment }` ]: ! isNil( verticalAlignment ),
		} );

		return (
			<div className={ wrapperClasses }>
				<InnerBlocks.Content />
			</div>
		);
	},
};
