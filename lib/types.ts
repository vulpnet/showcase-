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
  role: 'customer' | 'admin';
  created_at: string;
};
