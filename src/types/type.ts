export type Service = {
  _id: string;
  vendorId: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  imageUrl: string;
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt: string;
};