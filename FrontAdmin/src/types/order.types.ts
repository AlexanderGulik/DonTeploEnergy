export interface Order {
  OrderWinGift_id: number;
  StatusOrder: 'Pending' | 'Claimed';
  id_user: number;
  TImeOpenCase: string;
  Gift: string;
  GiftImage: string;
  GiftPrice: string;
}