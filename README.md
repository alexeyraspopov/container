# Container

Async declarative component-based (and other buzzwords) programming made easy.

## Intro

TBD

## Examples

```javascript
function Item({title, description}) {
	return (
		<article>
			<h2>{title}</h2>
			<p>{description}</p>
		</article>
	);
}
```

```javascript
function ItemsList({items = []}) {
	return (
		<section>
			{items.map(({title, description}) =>
				<Item title={title} description={description} />
			)}
		</section>
	);
}
```

```javascript
ItemsListContainer = Container(ItemsList, {
	items() {
		return fetch('/items')
			.then(r => r.json());
	}
});
```

```javascript
ReactDOM.render(<ItemsListContainer />, ...);
```
