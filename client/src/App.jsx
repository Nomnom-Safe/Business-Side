import Header from './components/common/Header/Header.jsx';
import SignInUp from './components/auth/SignInUp/SignInUp.jsx';
import SetUp from './components/setup/SetUp/SetUp.jsx';
import MenuDashboard from './components/menu/MenuDashboard/MenuDashboard.jsx';
import EditBusinessInfo from './components/business/EditBusinessInfo/EditBusinessInfo.jsx';
import EditLoginInfo from './components/auth/EditLoginInfo/EditLoginInfo.jsx';
// import FilterPanel from './components/menu/FilterPanel';
import AddMenuItem from './components/menuItems/AddMenuItem/AddMenuItem.jsx';
import MenuItemsPage from './components/menuItems/MenuItemsPage/MenuItemsPage.jsx';
// ARCHIVED: Menu Item Swapping - Not part of MVP (single menu)
// import MenuItemPicklist from './components/menuItems/MenuItemSwap/MenuItemSwap.jsx';
import ChooseBusiness from './components/setup/ChooseBusiness/ChooseBusiness.jsx';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// ARCHIVED: Admin Features - Not part of MVP (single user per business)
// import UserMaintenance from './components/admin/UserMaintenance/UserMaintenance.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';

function App() {
	return (
		<Router>
			<Header />

			<div className='content'>
				<Routes>
					{/* Public Route */}
					<Route
						path='/'
						element={
							<ProtectedRoute
								route={'signInUp'}
								component={SignInUp()}
							/>
						}
					/>

					{/* Protected Routes */}
					<Route
						path='/choose-business'
						element={
							<ProtectedRoute
								route={'chooseBusiness'}
								component={<ChooseBusiness />}
							/>
						}
					/>

					<Route
						path='/step1'
						element={
							<ProtectedRoute
								route={'setup'}
								component={<SetUp step={1} />}
							/>
						}
					/>

					<Route
						path='/step2'
						element={
							<ProtectedRoute
								route={'setup'}
								component={<SetUp step={2} />}
							/>
						}
					/>

					<Route
						path='/step3'
						element={
							<ProtectedRoute
								route={'setup'}
								component={<SetUp step={3} />}
							/>
						}
					/>

					<Route
						path='/edit-login-info'
						element={<ProtectedRoute component={<EditLoginInfo />} />}
					/>

					{/* ARCHIVED: Admin Features - Not part of MVP (single user per business) */}
					{/* <Route
					path='/user-maintenance'
					element={
						<ProtectedRoute
							admin={true}
							component={<UserMaintenance />}
						/>
					}
				/> */}

					<Route
						path='/dashboard'
						element={<ProtectedRoute component={<MenuDashboard />} />}
					/>

					<Route
						path='/edit-business-info'
						element={<ProtectedRoute component={<EditBusinessInfo />} />}
					/>

					<Route
						path='/add-menu-item'
						element={<ProtectedRoute component={<AddMenuItem />} />}
					/>

					{/* ARCHIVED: Menu Item Swapping - Not part of MVP (single menu) */}
					{/* <Route
					path='/swap-menu'
					element={<ProtectedRoute component={<MenuItemPicklist />} />}
				/> */}

					<Route
						path='/menuitems'
						element={<ProtectedRoute component={<MenuItemsPage />} />}
					/>
				</Routes>
			</div>
		</Router>
	);
}

export default App;
