export interface Stat {
  name: string,
  stats: any, // todo this can be improved
}

export interface StatsResponse {
  stats: Stat[];
}

export interface RawData {
  months: MonthData[],
  weeks: WeekData[],
  users: UserData[];
}

export interface UserData {
  user: string;
  monthStats: MonthData[];
}

export interface WeekData {
  yearNr: number;
  weekNr: number;
  totalPosts: number
}

export interface MonthData {
  yearNr: number,
  monthNr: number,
  longestPostLenght: number;
  totalChars: number;
  totalPosts: number;
}

export interface Post {
  id: string;
  from_name: string;
  from_id: string;
  message: string;
  type: string;
  created_time: Date;
}

export type CalcStatsFn = (rawData: RawData) => Stat;
