import { StatisticsData } from './dashboard.types';
import { CaseI } from './cases.types';
import { GiftI } from './gifts.types';
import { Order } from './order.types';
import  {OrderTon} from "./orderTon.types.ts";

export interface LoginResponseI {
  message: string;
  access_token?: string;
  accessToken?: string;
  admin: {
    admin_id: number;
    name: string;
    role: string;
  };
}

export interface LogoutResponseI {
  message: string;
}

export interface RefreshResponseI {
  access_token?: string;
  accessToken?: string;
}

export interface AdminErrorResponse {
  message: string;
}

export interface StatisticsResponseI extends StatisticsData {}

export interface CasesResponseI {
  allCases: CaseI[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface MessageResponseI {
  message: string;
}

export interface ErrorResponseI {
  message: string;
  error: string;
}

export interface BadTokenResponseI {
  error: string;
}

export interface CaseUpdateResponseI extends CaseI {
  message: string;
}

export interface GiftUpdateResponseI extends GiftI {
  message: string;
}

export interface GiftsResponseI {
  total: number;
  page: number;
  limit: number;
  data: GiftI[];
}

export interface OrdersResponseI {
  data: Order[];
  pagination: {
  total: number;
  page: number;
  limit: number;
  };
}
export interface OrdersTonResponseI {
  data: OrderTon[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}
