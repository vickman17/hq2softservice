export interface Category {
    id: number;
    name: string;
    subcategories: string[];
    category_name: string;
    category_pics?: string;
    supervisor_id?: number;
  }
  
  export interface Job {
    id: string;
    skill: string;
    status: string;
    created_at: string;
    state: string;
    address: string;
    urgency: string;
    additional_details: string;
    local_government: string;
    bid_data: number;
    price: number;
}
