import { useSelector } from 'react-redux';
import { RootSliceI } from '../store/index';

export const useUsers = () => {
    const users = useSelector((state: RootSliceI) => state.users);
    return users;
}; 
