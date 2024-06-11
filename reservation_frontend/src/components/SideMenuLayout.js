import { Outlet } from "react-router-dom";
import SideMenu from "./SideMenu";
const SideMenuLayout = () => (
	<>
		<SideMenu />
		<Outlet />
	</>
);

export default SideMenuLayout;
