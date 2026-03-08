export interface AiraloTokenResponse {
  data: {
    token: string;
    token_type: string;
    expires_in: number;
  };
  meta: {
    message: string;
  };
}

export interface AiraloPackage {
  id: string;
  type: string;
  title: string;
  data: string;
  validity: number;
  price: number;
  net_price: number;
  amount: number;
  day: number;
  is_stock: boolean;
  is_roaming: boolean;
  is_global: boolean;
  operator: {
    id: number;
    title: string;
    style: string;
    gradient_start: string;
    gradient_end: string;
    type: string;
    plan_type: string;
    is_roaming: boolean;
    info: string[];
    countries: AiraloCountry[];
    image: AiraloImage;
    other_info: string;
  };
}

export interface AiraloCountry {
  id: number;
  title: string;
  slug: string;
  country_code: string;
  image: AiraloImage;
}

export interface AiraloImage {
  width: number;
  height: number;
  url: string;
}

export interface AiraloOrder {
  id: number;
  code: string;
  currency: string;
  quantity: number;
  package_id: string;
  type: string;
  description: string;
  esim_type: string;
  validity: number;
  package: string;
  data: string;
  price: number;
  created_at: string;
  status: string;
  sims: AiraloSim[];
}

export interface AiraloSim {
  id: number;
  created_at: string;
  iccid: string;
  lpa: string;
  matching_id: string;
  confirmation_code: string | null;
  is_roaming: boolean;
  image_url: string;
}

export interface AiraloEsim {
  id: number;
  created_at: string;
  iccid: string;
  lpa: string;
  matching_id: string;
  confirmation_code: string | null;
  is_roaming: boolean;
  image_url: string;
  status: string;
}

export interface AiraloListResponse<T> {
  data: T[];
  meta: {
    last_page: number;
    current_page: number;
    total: number;
    message: string;
  };
}

export interface AiraloSingleResponse<T> {
  data: T;
  meta: {
    message: string;
  };
}
