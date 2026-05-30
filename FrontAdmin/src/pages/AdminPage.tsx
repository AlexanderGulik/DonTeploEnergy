import { Outlet } from 'react-router';
import Layout from '../components/layout/Layout';

const AdminPage = () => {
  return (
    <>
      <Layout>
        <Outlet />
      </Layout>
    </>
  );
};

export default AdminPage;
