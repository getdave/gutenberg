/**
 * External dependencies
 */
import { pick, isEqual } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { withViewportMatch } from '@wordpress/viewport';
import { Component } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';
import { synchronizeBlocksWithTemplate, withBlockContentContext } from '@wordpress/blocks';
import isShallowEqual from '@wordpress/is-shallow-equal';
import { compose, ifCondition } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import withClientId from './utils/with-client-id';
import ButtonBlockAppender from './button-block-appender';
import DefaultBlockAppender from './default-block-appender';

/**
 * Internal dependencies
 */
import BlockList from '../block-list';
import { withBlockEditContext } from '../block-edit/context';

class InnerBlocks extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			templateInProcess: !! this.props.template,
		};
		this.updateNestedSettings();
	}

	getTemplateLock() {
		const {
			templateLock,
			parentLock,
		} = this.props;
		return templateLock === undefined ? parentLock : templateLock;
	}

	componentDidMount() {
		const { innerBlocks } = this.props.block;
		// only synchronize innerBlocks with template if innerBlocks are empty or a locking all exists
		if ( innerBlocks.length === 0 || this.getTemplateLock() === 'all' ) {
			this.synchronizeBlocksWithTemplate();
		}
		if ( this.state.templateInProcess ) {
			this.setState( {
				templateInProcess: false,
			} );
		}
	}

	componentDidUpdate( prevProps ) {
		const { template, block } = this.props;
		const { innerBlocks } = block;

		this.updateNestedSettings();
		// only synchronize innerBlocks with template if innerBlocks are empty or a locking all exists
		if ( innerBlocks.length === 0 || this.getTemplateLock() === 'all' ) {
			const hasTemplateChanged = ! isEqual( template, prevProps.template );
			if ( hasTemplateChanged ) {
				this.synchronizeBlocksWithTemplate();
			}
		}
	}

	/**
	 * Called on mount or when a mismatch exists between the templates and
	 * inner blocks, synchronizes inner blocks with the template, replacing
	 * current blocks.
	 */
	synchronizeBlocksWithTemplate() {
		const { template, block, replaceInnerBlocks } = this.props;
		const { innerBlocks } = block;

		// Synchronize with templates. If the next set differs, replace.
		const nextBlocks = synchronizeBlocksWithTemplate( innerBlocks, template );
		if ( ! isEqual( nextBlocks, innerBlocks	) ) {
			replaceInnerBlocks( nextBlocks );
		}
	}

	updateNestedSettings() {
		const {
			blockListSettings,
			allowedBlocks,
			updateNestedSettings,
		} = this.props;

		const newSettings = {
			allowedBlocks,
			templateLock: this.getTemplateLock(),
		};

		if ( ! isShallowEqual( blockListSettings, newSettings ) ) {
			updateNestedSettings( newSettings );
		}
	}

	render() {
		const {
			clientId,
			isSmallScreen,
			isSelectedBlockInRoot,
			renderAppender,
			hideAppenderWhenChildren,
			hasChildBlocks,
		} = this.props;
		const { templateInProcess } = this.state;

		const classes = classnames( 'editor-inner-blocks block-editor-inner-blocks', {
			'has-overlay': isSmallScreen && ! isSelectedBlockInRoot,
		} );

		const hideAppender = hideAppenderWhenChildren && hasChildBlocks;

		return (
			<div className={ classes }>
				{ ! templateInProcess && (
					<BlockList
						rootClientId={ clientId }
						renderAppender={ renderAppender }
						hideAppender={ hideAppender }
					/>
				) }
			</div>
		);
	}
}

InnerBlocks = compose( [
	withBlockEditContext( ( context ) => pick( context, [ 'clientId' ] ) ),
	withViewportMatch( { isSmallScreen: '< medium' } ),
	withSelect( ( select, ownProps ) => {
		const {
			isBlockSelected,
			hasSelectedInnerBlock,
			getBlock,
			getBlockListSettings,
			getBlockRootClientId,
			getTemplateLock,
		} = select( 'core/block-editor' );
		const { clientId } = ownProps;
		const rootClientId = getBlockRootClientId( clientId );
		const block = getBlock( clientId );

		return {
			isSelectedBlockInRoot: isBlockSelected( clientId ) || hasSelectedInnerBlock( clientId ),
			block,
			blockListSettings: getBlockListSettings( clientId ),
			parentLock: getTemplateLock( rootClientId ),
			hasChildBlocks: !! ( block && block.innerBlocks.length ),
		};
	} ),
	withDispatch( ( dispatch, ownProps ) => {
		const {
			replaceInnerBlocks,
			updateBlockListSettings,
		} = dispatch( 'core/block-editor' );
		const { block, clientId, templateInsertUpdatesSelection = true } = ownProps;

		return {
			replaceInnerBlocks( blocks ) {
				replaceInnerBlocks( clientId, blocks, block.innerBlocks.length === 0 && templateInsertUpdatesSelection );
			},
			updateNestedSettings( settings ) {
				dispatch( updateBlockListSettings( clientId, settings ) );
			},
		};
	} ),
] )( InnerBlocks );

InnerBlocks.HideWhenChildren = compose( [
	withClientId,
	withSelect( ( select, { clientId } ) => {
		const {
			getBlock,
		} = select( 'core/block-editor' );

		const block = getBlock( clientId );

		return {
			hasChildBlocks: !! ( block && block.innerBlocks.length ),
		};
	} ),
	ifCondition( ( { hasChildBlocks } ) => {
		return ! hasChildBlocks;
	} ),
] )( function( props ) {
	return props.children;
} );

// Expose default appender placeholders as components
InnerBlocks.DefaultBlockAppender = DefaultBlockAppender;
InnerBlocks.ButtonBlockAppender = ButtonBlockAppender;

InnerBlocks.Content = withBlockContentContext(
	( { BlockContent } ) => <BlockContent />
);

export default InnerBlocks;
