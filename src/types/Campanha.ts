export interface Campaign {
  id: number;

  name: string;
  description: string | null;
  campaign_type: "money" | "food" | "clothing";

  start_date: string;   
  end_date?: string | null;

  is_active: boolean;    

  goal_quantity?: number | null;
  goal_amount?: number | null;

  created_at?: string;
  updated_at?: string;
}
export type CampaignType = "money" | "food" | "clothing";
