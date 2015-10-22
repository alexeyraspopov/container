import React, {PropTypes} from 'react';
import assign from 'object-assign';

export default function Container(Component, options) {
	// fragments can return Promise, Observer, Subscription
	// Promise :: { then }
	// Observer :: { subscribe -> unsubscribe }
	// Subscription :: { getState, subscribe -> { dispose } }
	const {
		fragments = {},
		shouldContainerUpdate = () => true,
		initialVariables = {},
	} = options;

	const componentPropTypes = Component.propTypes || {};

	return React.createClass({
		displayName: `${Component.displayName || Component.name}Container`,

		propTypes: {
			variables: PropTypes.object,
		},

		componentWillMount() {
			const variables = assign({}, initialVariables, this.props.variables);

			const promises = Object.keys(fragments)
				.map(key => fragments[key](variables).then(data => ({[key]: data})));

			Promise.all(promises).then(fetchedFragments => {
				const state = fetchedFragments.reduce(binary(assign), {});

				this.setState({fragments: state});
			});
		},

		componentWillUnmount() {
			// dispose
		},

		componentWillReceiveProps(nextProps) {
			if (shouldContainerUpdate.call(this, nextProps)) {
				// update
			}
		},

		render() {
			return React.createElement(Component, assign({}, this.state.fragments, this.props));
		},
	});
}

function binary(fn) {
	return (a, b) => fn(a, b);
}
