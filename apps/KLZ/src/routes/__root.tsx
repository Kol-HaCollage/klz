import { createRootRoute, Outlet } from '@tanstack/react-router';
import { App } from '../app/app';

export const Route = createRootRoute({
	component: () => (
		<App>
			{/* The active page will render here */}
			<Outlet />
		</App>
	),
});
