export interface Stat {
  name: string,
  stats: any,
}

export interface StatsResponse {
  stats: any[];
}

export interface Post {
  id: string;
  from_name: string;
  from_id: string;
  message: string;
  type: string;
  created_time: Date;
}

export interface PostSummary {
  date: Date;
  //hash?: string; // can be useful
  user: string;
  length: number;
}

export type CalcStatsFn = (months: Month[]) => Stat;

export interface Month {
  year: number;
  monthNr: number;
  monthName: string;
  posts: PostSummary[];
}
