// ──────────────────────────────────────
// Content / CMS Types — Phase 9
// ──────────────────────────────────────

export interface Banner {
  id: string;
  name: string;
  status: 'draft' | 'scheduled' | 'active' | 'inactive';
  placement: 'home_hero' | 'gate_notification' | 'category_header' | 'interstitial';
  content: Record<string, { title: string; body: string; cta_text: string; cta_link: string }>;
  image_url: string | null;
  target_zones: string[];
  target_gates: string[];
  start_date: string | null;
  end_date: string | null;
  priority: number;
  created_at: string;
  created_by: string;
}

export interface RecommendedTile {
  id: string;
  type: 'shop' | 'offer' | 'category' | 'navigation';
  entity_id: string | null;
  title: Record<string, string>;
  subtitle: Record<string, string>;
  image_url: string | null;
  position: number;
  placement: 'home_grid' | 'sidebar_widget' | 'post_checkin';
  target_gates: string[];
  is_active: boolean;
}

export interface CopyEntry {
  key: string; // e.g. 'onboarding.welcome_title'
  category: string;
  translations: Record<string, string>; // by language code
  last_updated: string;
  updated_by: string;
  is_published: boolean;
  notes: string | null;
}

export type BannerStatus = Banner['status'];
export type BannerPlacement = Banner['placement'];
export type TileType = RecommendedTile['type'];
export type TilePlacement = RecommendedTile['placement'];
