export interface TariffI {
    id: number;
    period: string;
    isCurrent: boolean;
    basis: string;
    population: string[];
    budget: string[];
}

export interface TariffResponseI {
    data: TariffI[];
    pagination?: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export interface CreateTariffDto {
    period: string;
    basis: string;
    population: string[];
    budget: string[];
    isCurrent?: boolean;
}

export interface UpdateTariffDto extends Partial<CreateTariffDto> {
    id: number;
}
