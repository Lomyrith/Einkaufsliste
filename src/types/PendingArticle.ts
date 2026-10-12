import { type Article } from "./Article";

export type PendingArticle = Article & {
  addAmount: number;
  currentAmount: number;
};
