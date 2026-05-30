import { ReactNode } from 'react';
import DashboardIcon from '../components/UI/Icons/DashBoardIcon';
import UserIcon from '../components/UI/Icons/UsersIcon';
import CasesIcon from '../components/UI/Icons/CasesIcon';
import AdminIcon from '../components/UI/Icons/AdminIcon.tsx';
import TariffsIcon from '../components/UI/Icons/TariffsIcon.tsx';
import FormsIcon from '../components/UI/Icons/FormsIcon.tsx';

interface NavItem {
  path: string;
  text: string;
  icon: ReactNode;
  roles: string[]; 
}

export const navItems: NavItem[] = [
  {
    path: '/admin/stats',
    text: 'Статистика',
    icon: <DashboardIcon />,
    roles: ['admin', 'moderator'], 
  },
  {
    path: '/admin/forms',
    text: 'Заявления',
    icon: <FormsIcon />,
    roles: ['admin', 'moderator'], 
  },
  {
    path: '/admin/outages',
    text: 'Технические работы',
    icon: <CasesIcon />,
    roles: ['admin', 'moderator'], 
  },
  {
    path: '/admin/admins',
    text: 'Администраторы',
    icon: <AdminIcon />,
    roles: ['admin'], 
  },
  {
    path: '/admin/users',
    text: 'Пользователи',
    icon: <UserIcon />,
    roles: ['admin'], 
  },
  {
    path: '/admin/tariffs',
    text: 'Управление тарифами',
    icon: <TariffsIcon />,
    roles: ['admin'], 
  },
];
