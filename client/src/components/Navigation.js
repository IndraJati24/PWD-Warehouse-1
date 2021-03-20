import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../action";

import { Navbar, Nav, NavDropdown } from "react-bootstrap";

const Navigation = () => {
	const dispatch = useDispatch();
	const { user } = useSelector(state => state.user)

	return (
		<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
			<Navbar.Brand as={Link} to="/">
				Warehouse Group 1
			</Navbar.Brand>
			<Navbar.Toggle aria-controls="responsive-navbar-nav" />
			<Navbar.Collapse id="responsive-navbar-nav">
				<Nav className="mr-auto">
					<Nav.Link as={Link} to="/">
						Home
					</Nav.Link>
				</Nav>
				<Nav>
					{/* <NavDropdown
						title="Username"
						id="collasible-nav-dropdown"
						style={{ marginRight: 15 }}
					>
						<NavDropdown.Item as={Link} to="/login">
							Login
						</NavDropdown.Item>
						<NavDropdown.Item as={Link} to="/register">
							Register
						</NavDropdown.Item>
						<NavDropdown.Divider />
					</NavDropdown>
					<Nav.Link as={Link} to="/login">
						Login
					</Nav.Link>
					<Nav.Link as={Link} to="/cart">
						<i class="fas fa-shopping-cart"></i>
					</Nav.Link>
					<Nav.Link as={Link} to="/login" onClick={() => dispatch(logout())}>
						Logout
					</Nav.Link>*/}
					<Nav.Link as={Link} to="/history">
						History
					</Nav.Link> 
					<Nav.Link as={Link} to="/cart">
						<i className="fas fa-shopping-cart"></i>
					</Nav.Link>
					{user.id_user ? (
						<Nav.Link as={Link} to="/login" onClick={() => dispatch(logout())}>
							Logout
						</Nav.Link>
					) : (
							<Nav.Link as={Link} to="/login">
								Login
							</Nav.Link>
						)}
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default Navigation;
