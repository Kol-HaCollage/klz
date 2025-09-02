import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	component: () => (
		<div>
			Example:
			<a href="/about">Click here for About page.</a>
		</div>
	),
});
