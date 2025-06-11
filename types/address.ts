export interface Address {
  recipient: string;
  phone: string;
  location: string;
}

export interface Province {
  code: number;
  name: string;
}

export interface District {
  code: number;
  name: string;
}

export interface Ward {
  code: number;
  name: string;
}

export interface ProvinceResponse {
  provinces: Province[];
}

export interface DistrictResponse {
  districts: District[];
}

export interface WardResponse {
  wards: Ward[];
}