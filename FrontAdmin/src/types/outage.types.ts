export type OutageStatus = 'planned' | 'in-progress' | 'completed';

export interface OutageI {
    id: number;
    address: string;
    date: string; // ISO date string
    time: string;
    reason: string;
    status: OutageStatus;
}

export interface OutageResponseI {
    data: OutageI[];
    pagination?: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export interface CreateOutageDto {
    address: string;
    date: string;
    time: string;
    reason: string;
    status: OutageStatus;
}

export interface UpdateOutageDto extends Partial<CreateOutageDto> {
    id: number;
}

export const OutageStatusLabels: Record<OutageStatus, string> = {
    'planned': 'Запланировано',
    'in-progress': 'В процессе',
    'completed': 'Завершено'
};

export const OutageStatusColors: Record<OutageStatus, string> = {
    'planned': '#FF9800', // оранжевый
    'in-progress': '#2196F3', // синий
    'completed': '#4CAF50' // зеленый
};
