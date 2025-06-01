export type Media = { name: string; url: string; [key: string]: any };
export type Category = {
  id: number;
  name: string;
  description?: string;
  images?: Media[];
};
