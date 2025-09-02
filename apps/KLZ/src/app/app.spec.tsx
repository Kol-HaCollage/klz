import {
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	RouterProvider,
} from '@tanstack/react-router';
import { render } from '@testing-library/react';
import { App } from './app';

// Mocking a router
const rootRoute = createRootRoute({
	component: () => (
		<App>
			<Outlet />
		</App>
	),
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/',
	component: () => <div />, // simple placeholder page
});

const routeTree = rootRoute.addChildren([indexRoute]);
const router = createRouter({ routeTree });

describe('app', () => {
	it('should render successfully', () => {
		const { baseElement } = render(<RouterProvider router={router} />);
		expect(baseElement).toBeTruthy();
	});

	it('should have a greeting as the title', () => {
		const { getAllByText } = render(<RouterProvider router={router} />);
		expect(getAllByText(/Welcome @klz\/KLZ/i).length > 0).toBeTruthy();
	});
});
