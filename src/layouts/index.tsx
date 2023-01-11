import { Outlet } from 'umi';
import '../global.css';

export default function Layout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
