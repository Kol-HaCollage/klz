import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
	component: () => (
		<div>
			Example:
			<a href="/index">Click here for Home page.</a>
		</div>
	),
});
