import { Routes, Route } from 'react-router';
import { useEffect } from 'react';
import { useUser } from '../../hooks/useUser';
import { getItemFromLocalStorage } from '../../service/localStorage.service';
import { useActions } from '../../hooks/useActions';
import NotFound from '../notfound/NotFound';
import AdminPage from '../../pages/AdminPage';
import LoginPage from '../../pages/LoginPage';
import Dashboard from '../dashboard/Dashboard';
import UsersComponent from '../users/UsersComponent';
import AdminComponent from '../admin/AdminComponent';
import TariffsComponent from '../tariff/TariffComponent.tsx';
import OutagesComponent from '../outage/OutagesComponent.tsx';
import FormsComponent from '../form/FormsComponent';

const AppRouter = () => {
  const user = useUser().store;
  const { userInit } = useActions();

  useEffect(() => {
    const store = getItemFromLocalStorage('store');
    if (store) {
      userInit(store);
    }
  }, [userInit]);

  return (
    <>
      {user.isAuthenticated ? (
        user.user?.roles === 'admin' ? (
          <Routes>
            <Route path="/admin/*" element={<AdminPage />}>
              <Route path="stats" element={<Dashboard />} />
              <Route path="tariffs" element={<TariffsComponent/>} />
              <Route path="forms" element={<FormsComponent />} />
              <Route path="outages" element={<OutagesComponent />} />
              <Route path="admins" element={<AdminComponent/>} />
              <Route path="users" element={<UsersComponent />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        ) : user.user?.roles === 'moderator' ? (
          <Routes>
            <Route path="/admin/*" element={<AdminPage />}>
              <Route path="" element={<Dashboard />} />
              <Route path="stats" element={<Dashboard />} />
              <Route path="forms" element={<FormsComponent />} />
              <Route path="outages" element={<OutagesComponent />} />
              <Route path="users" element={<UsersComponent />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        ) : ( 
          <Routes>
            <Route path="*" element={<NotFound />} />
          </Routes>
        )
      ) : (
        <Routes>
          <Route path="/admin/" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </>
  );
};

export default AppRouter;
