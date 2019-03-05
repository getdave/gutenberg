/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	InnerBlocks,
	PanelColorSettings,
	withColors,
} from '@wordpress/editor';

import {
	Toolbar,
	BaseControl,
	PanelBody,
	PanelRow,
} from '@wordpress/components';

function ContainerEdit( { className, setBackgroundColor, backgroundColor, attributes, setAttributes } ) {
	const styles = {
		backgroundColor: backgroundColor.color,
	};

	const { contentMaxWidth, align } = attributes;

	const classes = classnames( className, backgroundColor.class, {
		[ `align${ align }` ]: align,
	} );

	const innerClasses = classnames( 'wp-block-container__inner', `is-${ contentMaxWidth }-width`, );

	const containerAlignmentControls = [
		{
			icon: `align-wide`,
			title: `Wide`,
			isActive: align === 'wide',
			className: 'is-large',
			onClick: () => setAttributes( { align: 'wide' } ),
		},
		{
			icon: `align-full-width`,
			title: `Full Width`,
			isActive: align === 'full',
			className: 'is-large',
			onClick: () => setAttributes( { align: 'full' } ),
		},
	];

	const innerContainerAlignmentControls = [
		{
			icon: `align-center`,
			title: `Full Width`,
			isActive: contentMaxWidth === 'full',
			className: 'is-large',
			onClick: () => setAttributes( { contentMaxWidth: 'full' } ),
		},
		{
			icon: `align-center`,
			title: `Site Width`,
			isActive: contentMaxWidth === 'site',
			className: 'is-large',
			onClick: () => setAttributes( { contentMaxWidth: 'site' } ),
		},
		{
			icon: `align-center`,
			title: `Content Width`,
			isActive: contentMaxWidth === 'content',
			className: 'is-large',
			onClick: () => setAttributes( {
				contentMaxWidth: 'content',
			} ),
		},
	];

	return (
		<Fragment>
			<InspectorControls>
				<PanelColorSettings
					title={ __( 'Color Settings' ) }
					colorSettings={ [
						{
							value: backgroundColor.color,
							onChange: setBackgroundColor,
							label: __( 'Background Color' ),
						},
					] }
				/>

				<PanelBody
					title={ __( 'Layout Controls' ) }
				>
					<PanelRow>
						<BaseControl
							label="Container Width"
							help="Choose the width of the Container"
						>
							<Toolbar controls={ containerAlignmentControls } />
						</BaseControl>
					</PanelRow>
					<PanelRow>
						<BaseControl
							label="Inner Content Alignment"
							help="Choose the inner content alignment"
						>
							<Toolbar controls={ innerContainerAlignmentControls } />
						</BaseControl>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div className={ classes } style={ styles }>
				<div className={ innerClasses }>
					<InnerBlocks />
				</div>
			</div>
		</Fragment>
	);
}

export default withColors( 'backgroundColor' )( ContainerEdit );
