export type Service = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  benefits: string[];
  cover_image_url: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type PricingPlan = {
  id: string;
  service_id: string;
  name: string;
  price_text: string;
  features: string[];
  is_highlighted: boolean;
  sort_order: number;
};

export type Client = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  testimonial: string | null;
  is_published: boolean;
  sort_order: number;
};

export type Lead = {
  id: string;
  user_id: string | null;
  service_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string | null;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
};

export type CaseStudyMetric = {
  label: string;
  value: string;
};

export type CaseStudy = {
  id: string;
  service_id: string | null;
  slug: string;
  title: string;
  industry: string | null;
  challenge: string | null;
  solution: string | null;
  result: string | null;
  metrics: CaseStudyMetric[];
  cover_image_url: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

export type Faq = {
  id: string;
  service_id: string | null;
  question: string;
  answer: string;
  is_published: boolean;
  sort_order: number;
};

export type Profile = {
  id: string;
  full_name: string | null;
  company: string | null;
  phone: string | null;
  role: 'customer' | 'seller' | 'admin';
  created_at: string;
};

// ===== Marketplace cộng đồng (community_*) — nhiều người bán tự đăng ký =====

export type CommunityCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type CommunitySellerProfile = {
  id: string;
  display_name: string;
  headline: string | null;
  bio: string | null;
  years_experience: number | null;
  website_url: string | null;
  contact_email: string;
  contact_phone: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
};

export type CommunityListingStatus = 'pending' | 'approved' | 'rejected';

export type CommunityListing = {
  id: string;
  seller_id: string;
  category_id: string | null;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  benefits: string[];
  price_text: string | null;
  offers_free_trial: boolean;
  free_trial_note: string | null;
  status: CommunityListingStatus;
  rejection_reason: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type CommunityTrialRequest = {
  id: string;
  listing_id: string;
  seller_id: string;
  requester_user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string | null;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
};
