import { useSelector } from 'react-redux';
import { RootSliceI } from '../store/index.ts';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    id: number;
    name: string;
    role: string;
    exp: number;
    iat: number;
}

export const useUser = () => {
    const userState = useSelector((state: RootSliceI) => state.user);
    
    console.log('Full Redux user state:', userState);
    
    const accessToken = userState?.store?.accessToken;
    const isAuthenticated = !!accessToken && userState?.store?.isAuthenticated === true;
    
    let adminId = 0;
    if (accessToken) {
        console.log('Access token found:', accessToken.substring(0, 20) + '...');
        try {
            const decoded = jwtDecode<DecodedToken>(accessToken);
            console.log('Decoded token data:', decoded);
            adminId = decoded.id;
            console.log('Extracted admin ID:', adminId);
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    } else {
        console.log('No access token in user.store');
    }

    // Возвращаем плоскую структуру для удобства
    return {
        status: userState?.status,
        error: userState?.error,
        store: userState?.store,
        accessToken,
        isAuthenticated,
        adminId,
        user: userState?.store?.user,
    };
};
