export interface PropertyType {
  id: string;
  structureId?: number;
  name: string;
  description: string;
  maxOccupancy: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  basePrice: number;
  currency: string;
  amenities: string[];
  totalUnits: number;
  availableUnits: number;
  status: "active" | "inactive";
  images: string[];
}

export const mockPropertyTypes: PropertyType[] = [
  {
    id: "1",
    structureId: 1,
    name: "Luxury Suite",
    description: "Spacious luxury suite with city view and premium amenities",
    maxOccupancy: 4,
    bedrooms: 2,
    bathrooms: 2,
    area: 850,
    basePrice: 299,
    currency: "USD",
    amenities: ["WiFi", "Room Service", "City View", "Minibar"],
    totalUnits: 20,
    availableUnits: 5,
    status: "active",
    images: ["/placeholder.svg?height=200&width=300"],
  },
  {
    id: "2",
    structureId: 1,
    name: "Standard Room",
    description: "Comfortable standard room with modern amenities",
    maxOccupancy: 2,
    bedrooms: 1,
    bathrooms: 1,
    area: 400,
    basePrice: 149,
    currency: "USD",
    amenities: ["WiFi", "TV", "Air Conditioning"],
    totalUnits: 80,
    availableUnits: 23,
    status: "active",
    images: ["/placeholder.svg?height=200&width=300"],
  },
  {
    id: "3",
    structureId: 2,
    name: "Economy Room",
    description: "Budget-friendly room with essential amenities",
    maxOccupancy: 2,
    bedrooms: 1,
    bathrooms: 1,
    area: 300,
    basePrice: 89,
    currency: "USD",
    amenities: ["WiFi", "TV"],
    totalUnits: 50,
    availableUnits: 12,
    status: "active",
    images: ["/placeholder.svg?height=200&width=300"],
  },
  {
    id: "4",
    structureId: 3,
    name: "Economy Room",
    description: "Budget-friendly room with essential amenities",
    maxOccupancy: 2,
    bedrooms: 1,
    bathrooms: 1,
    area: 500,
    basePrice: 99,
    currency: "USD",
    amenities: ["WiFi", "TV"],
    totalUnits: 50,
    availableUnits: 12,
    status: "active",
    images: ["/placeholder.svg?height=200&width=300"],
  },
];
