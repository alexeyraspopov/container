import React from 'react';
import Container from './index';
import assert from 'assert';

describe('Container', () => {
	// TODO: describe use cases
	const Component = (props) => <div />;

	it('should create React component', () => {
		const PContainer = Container(Component, {});

		assert.ok(React.isValidElement(<PContainer />), 'Container should be a React component');
		assert.equal(PContainer.displayName, 'ComponentContainer', 'Container should have Component\'s name with suffix');
	});

	it('should create React component if enum is used', () => {
		const PContainer = Container({success: Component}, {});

		assert.ok(React.isValidElement(<PContainer />), 'Container should be a React component');
		assert.equal(PContainer.displayName, 'ComponentContainer', 'Container should have Component\'s name with suffix');
	});

	it('should raise an error if no components are specified', () => {
		assert.throws(() => Container({success: null}, {}), /Success, Failure and Pending should be React components/);
		assert.throws(() => Container({}, {}), /At least Success component should be specified/);
	});
});
