import React from 'react';
import ReactDOM from 'react-dom';
import {Provider, connect as Connect} from 'react-redux';
import {createStore as Store} from 'redux';
import Container from '../../index';

const ListContainer = Container({
	pending: LoadingSpinner,
	success: List,
	failure: ListError,
}, {
	fragments: {
		items({id}) {
			const seed = [
				{id: 'a', title: 'Hello', description: 'Article #1'},
				{id: 'b', title: 'Hola', description: 'Article #2'},
				{id: 'c', title: 'Привет', description: 'Article #3'},
			];

			return new Promise((resolve, reject) => {
				setTimeout(() => {
					Math.random() > 0.5 ? resolve(seed) : reject(new Error('Something happened'));
				}, 1000);
			});
		},
		query() {
			return Promise.resolve('l');
		}
	}
});

const QueryStore = Store(QueryState);
const ItemSearchConnect = Connect(query => ({
	query,
	onChange: event => QueryStore.dispatch(changeQuery(event.target.value))
}))(ItemSearch);

function ItemSearchContainer() {
	return (
		<Provider store={QueryStore}>
			<ItemSearchConnect />
		</Provider>
	);
}

ReactDOM.render(<App />, document.querySelector('main'));

function QueryState(query = 'l', action) {
	switch (action.type) {
	case 'QUERY_CHANGED':
		return action.query;
	default:
		return query;
	}
}

function changeQuery(query) {
	return {type: 'QUERY_CHANGED', query};
}

function App() {
	return (
		<div>
			<ItemSearchContainer />
			<ListContainer />
		</div>
	);
}

function ItemSearch({query, onChange}) {
	return <input type="text" value={query} onChange={onChange} />;
}

function Item({title, description}) {
	return (
		<article>
			<h2>{title}</h2>
			<p>{description}</p>
		</article>
	);
}

function List({items, query = ''}) {
	const isQueried = ({title}) => title.toLowerCase().includes(query);
	const item = ({id, title, description}) => <Item key={id} title={title} description={description} />;

	return (
		<section>
			{items.filter(isQueried).map(item)}
		</section>
	);
}

function LoadingSpinner() {
	return <p>Loading...</p>;
}

function ListError({error, onRetry}) {
	return (
		<article>
			<p>Oops... Something went wrong. Click <a href="#" onClick={onRetry}>here</a> to retry</p>
		</article>
	)
}