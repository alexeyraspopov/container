import React from 'react';
import {Observable} from 'rx';
import invariant from 'invariant';
import assign from 'object-assign';

export default class Container extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.subscription = {};
	}

	fetch() {
		const fragments = this.observe();

		const streams = Object.keys(fragments)
			.map(name => {
				const fragment = fragments[name];
				const observable = fromEverything(fragment);

				return observable.map(data => wrapFragment(name, data));
			});

		return Observable.combineLatest(streams)
			.subscribe(
				results => this.success(results),
				error => this.failure(error)
			);
	}

	success(fragments) {
		this.setState({
			status: 'success',
			fragments: fragments.reduce((a, b) => assign(a, b), {}),
		});
	}

	failure(error) {
		this.setState({
			status: 'failure',
			error,
		});
	}

	componentWillMount() {
		invariant(typeof this.observe === 'function', 'Transmitter.Container requires `observe` method to be implemented');

		this.subscription = this.fetch();
	}

	componentWillUnmount() {
		this.subscription.dispose();
	}

	componentWillReceiveProps(nextProps) {
		// TODO: observe data again
		/*if (typeof this.shoudContainerUpdate === 'function' && this.shouldContainerUpdate(nextProps)) {
				this.pending();
				this.subscription = this.fetch(nextProps.variables);
			}*/
	}

	render() {
		// TODO: choose correct render method
	}
}