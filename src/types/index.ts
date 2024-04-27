export interface IUser {
  _id: string;
  id: string;
  cart: ICart[];
  email: string;
  orders: IOrder[];
  profileImagePath: string;
  username: string;
  wishlist: [];
  works: IWork[];
}

export interface IWork {
  _id: string;
  category: string;
  creator: IUser;
  description: string;
  price: number;
  title: string;
  workPhotoPaths: string[];
}

export interface ICart {
  workId: string;
  category: string;
  creator: IUser;
  image: string;
  price: number;
  title: string;
  quantity: number;
}

export interface IOrder {
  id: string;
  user: string;
  orderItems: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  amountPaid: number;
}
