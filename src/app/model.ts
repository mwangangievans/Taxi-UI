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
    gender: string;
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

export interface Transaction {
  transactionId: number;
  transactionDate: number;
  amount: number;
  commissionAmount: number;
  startPointReverseGeoCoordinatesResponse: string;
  destinationReverseGeoCoordinatesResponse: string;
}
export interface GeoResponse {
  name?: string;
  display_name: string;
}

export interface UserProfile {
  profileId: number;
  userId: number;
  phoneNumber: string;
  hasVerifiedPhoneNumber: boolean;
  hasVerifiedEmailAddress: boolean;
  hasVerifiedDriverProfile: boolean;
  hasVerifiedCustomerProfile: boolean;
  hasUploadedDriverKycDocuments: boolean;
  hasUploadedCustomerKycDocuments: boolean;
  gender: 'MALE' | 'FEMALE'; // Assuming these are the only possible values
  bio: string;
  profilePicFileId: string;
}

// Interface for the user object
export interface User {
  userId: number;
  name: string;
  email: string;
  roles: string[];
  userProfile: UserProfile;
}

// Interface for the complete response
export interface UserResponse {
  user: User;
  userProfile: UserProfile;
}

export interface UserKycDocument {
  userKycDocumentId: number;
  userId: number;
  kycConfigId: number;
  kycConfigDocumentTitle: string;
  verificationStatus: string;
  documentNumber: string;
  rejectionReason: string | null;
  fileId: string;
}
export interface FileLink {
  link: string;
  fileExtension: string;
}
export interface KycDocumentFilter {
  id: number;
  title: string;
  active: boolean;
  name: string;
}

export interface DataItem {
  dateKey: string;
  totalAmount: number;
}

export interface WeekRange {
  range: string;
  totalAmount: number;
}

export interface userProfile {
  name: string;
  userId: number;
  genderInt: number;
  trips: number;
  ratings: number | null;
  bio: string;
  profilePicFileId: string;
}

export interface TripCoordinate {
  tripCoordinateId: number;
  tripId: number;
  coordinateContributorUserId: number;
  latitude: number;
  longitude: number;
  createdOn: number;
}
