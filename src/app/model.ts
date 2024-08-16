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
