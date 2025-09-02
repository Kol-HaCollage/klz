import { Link } from '@tanstack/react-router';
import styled from 'styled-components';
import { NxWelcome } from './nx-welcome';

const StyledApp = styled.div`
  // Your style here
`;

interface Props {
	children?: React.ReactNode
}

export const App = ({ children }: Props) => {
	return (
		<StyledApp>
			<NxWelcome title="@klz/KLZ" />

			{/* START: routes */}
			{/* These routes and navigation have been generated for you */}
			{/* Feel free to move and update them to fit your needs */}
			<br />
			<hr />
			<br />

			{/* Simple navigation */}
			<nav role="navigation">
				<ul>
					<li><Link to="/index">Home</Link></li>
					<li><Link to="/about">About</Link></li>
				</ul>
			</nav>

			{/* Where the current page renders */}
			{children}

		</StyledApp>
	);
};
