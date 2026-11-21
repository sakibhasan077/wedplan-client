export type Service = {
  _id: string;
  vendorId: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  imageUrl?: string;
  images?: string[];
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt: string;
  vendorName?: string;
  vendorEmail?: string;
  vendor?: {
    name?: string;
    email?: string;
  };
};