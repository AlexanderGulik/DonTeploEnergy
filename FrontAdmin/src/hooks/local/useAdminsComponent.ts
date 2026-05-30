import { useState, useEffect, useCallback } from 'react';
import { AdminI, CreateAdminDto, UpdateAdminDto } from '../../types/admin.types';
import { AdminService } from '../../API/AdminService';

interface FormData {
    fio: string;
    name: string;
    password: string;
    role: string;
}

interface FormErrors {
    fio?: string;
    name?: string;
    password?: string;
    role?: string;
    submit?: string;
}

export const useAdminsComponent = () => {
    const [admins, setAdmins] = useState<AdminI[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedAdmin, setSelectedAdmin] = useState<AdminI | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        fio: '',
        name: '',
        password: '',
        role: ''
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [searchId, setSearchId] = useState('');



const fetchAdmins = useCallback(async (page: number = currentPage, search?: string) => {
    setStatus('loading');
    try {
        let limit = 10;
        const response = await AdminService.getAll(page, limit, search);
        
        if (search && (!response || (Array.isArray(response) && response.length === 0))) {
            setAdmins([]);
            setTotalPages(1);
            setError(`Администратор с ID ${search} не найден`);
            setStatus('succeeded');
            return;
        }
        
        if (response.data && Array.isArray(response.data)) {
            setAdmins(response.data);
            setTotalPages(response.pages || 1);
        } else if (Array.isArray(response)) {
            setAdmins(response);
            setTotalPages(1);
        } else if (response && !Array.isArray(response)) {
            setAdmins([response]);
            setTotalPages(1);
        } else {
            setAdmins([]);
            setTotalPages(1);
        }
        
        setStatus('succeeded');
        setError(null);
    } catch (err) {
        setStatus('failed');
        setError(err instanceof Error ? err.message : 'Ошибка загрузки администраторов');
        console.error('Error fetching admins:', err);
    }
}, [currentPage]);
 useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);




    const validateForm = (): boolean => {
        const errors: FormErrors = {};
        
        if (!formData.fio.trim()) {
            errors.fio = 'ФИО обязательно';
        }
        
        if (!formData.name.trim()) {
            errors.name = 'Логин обязателен';
        }
        
        if (!selectedAdmin && !formData.password.trim()) {
            errors.password = 'Пароль обязателен';
        } else if (formData.password && formData.password.length < 6) {
            errors.password = 'Пароль должен содержать минимум 6 символов';
        }
        
               
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchAdmins(page, searchId);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchId(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchAdmins(1, searchId);
    };

    const handleClearSearch = () => {
        setSearchId('');
        setCurrentPage(1);
        fetchAdmins(1, '');
    };

    const handleCreate = () => {
        setSelectedAdmin(null);
        setFormData({
            fio: '',
            name: '',
            password: '',
            role: ''
        });
        setFormErrors({});
        setIsModalOpen(true);
    };

    const handleEdit = (admin: AdminI) => {
        setSelectedAdmin(admin);
        setFormData({
            fio: admin.fio,
            name: admin.name,
            password: '',
            role: admin.role
        });
        setFormErrors({});
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Вы уверены, что хотите удалить этого администратора?')) {
            setIsLoading(true);
            try {
                await AdminService.delete(id);
                await fetchAdmins(currentPage, searchId);
            } catch (err) {
                console.error('Error deleting admin:', err);
                setError(err instanceof Error ? err.message : 'Ошибка при удалении администратора');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (formErrors[name as keyof FormErrors]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setFormErrors({});

        try {
            if (selectedAdmin) {
                const updateData: UpdateAdminDto = {
                    fio: formData.fio,
                    name: formData.name,
                    role: formData.role
                };
                
                if (formData.password) {
                    updateData.password = formData.password;
                }

                await AdminService.update(String(selectedAdmin.id_admin), updateData);
            } else {
                const createData: CreateAdminDto = {
                    fio: formData.fio,
                    name: formData.name,
                    password: formData.password,
                    role: formData.role 
                };
                await AdminService.create(createData);
            }
            
            setIsModalOpen(false);
            await fetchAdmins(currentPage, searchId);
        } catch (err) {
            console.error('Error saving admin:', err);
            setFormErrors({
                submit: err instanceof Error ? err.message : 'Ошибка при сохранении администратора'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAdmin(null);
        setFormErrors({});
    };

    const clearErrorAdmins = () => {
        setError(null);
    };

    return {
        admins,
        status,
        error,
        currentPage,
        totalPages,
        selectedAdmin,
        formData,
        formErrors,
        isLoading,
        searchId,
        isModalOpen,
        handlePageChange,
        handleSearchChange,
        handleSearchSubmit,
        handleClearSearch,
        handleCreate,
        handleEdit,
        handleDelete,
        handleInputChange,
        handleSubmit,
        handleCloseModal,
        clearErrorAdmins,
        setSelectedAdmin
    };
};
