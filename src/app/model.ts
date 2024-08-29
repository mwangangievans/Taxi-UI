export interface UserSession {
  userId: number;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  roles: string[];
  hasVerifiedPhoneNumber: boolean | null;
}

export interface kycConfiguration {
  configId: number;
  userRole: string;
  documentTitle: string;
  status: string;
}
export interface tripInterface {
  tripId: number;
  startingPointLat: number;
  startingPointLng: number;
  destinationLat: number;
  destinationLng: number;
  departureTime: number;
  numberOfSeats: number;
  pricePerSeat: number;
  createdAt: number;
  completedAt: null;
  driverUserId: number;
  driverName: string;
  startPointReverseGeoCoordinatesResponse: string;
  destinationReverseGeoCoordinatesResponse: string;
  tripApprovalStatus: string;
}

export interface userInterface {
  userId: number;
  name: string;
  email: string;
  roles: [];
  userProfile: {
    profileId: number;
    phoneNumber: string;
    hasVerifiedDriverProfile: boolean;
    hasVerifiedCustomerProfile: boolean;
    hasUploadedDriverKycDocuments: boolean;
    hasUploadedCustomerKycDocuments: boolean;
  };
}

export interface configurationInterface {
  configurationType: string;
  percentageValue: number;
}

export interface Statistics {
  totalEarnings: number;
  totalTrips: number;
  totalTransportedPassengers: number;
  totalDrivers: number;
}

export interface graphData {
  dateKey: string; // The date in string format, e.g., "2024-08-21"
  totalAmount: number; // The total amount associated with this date
}
