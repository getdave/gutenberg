/**
 * WordPress dependencies
 */
import { unwrap } from '@wordpress/dom';

/**
 * Removes Google Docs wrapper node.
 *
 * @param {Node} node The node to check.
 *
 * @return {void}
 */
export default function( node ) {
	if ( /^docs-internal-guid-/.test( node.id ) ) {
		unwrap( node );
	}
}
