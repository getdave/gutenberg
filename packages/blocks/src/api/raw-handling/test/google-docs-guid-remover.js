/**
 * Internal dependencies
 */
import googleDocsGUIDRemover from '../google-docs-guid-remover';
import { deepFilterHTML } from '../utils';

describe( 'googleDocsGUIDRemover', () => {
	it( 'should remove wrapper', () => {
		const input = '<b id="docs-internal-guid-a57d75af-7fff-a81d-b60b-cdda140e919f"><div></div></b>';
		const output = '<div></div>';
		expect( deepFilterHTML( input, [ googleDocsGUIDRemover ] ) ).toEqual( output );
	} );
} );
