import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "lucide-react";
import { type Article } from "../types/Article";

function ArticleCard({
  article,
  onRemove,
}: {
  article: Article;
  onRemove: (name: string) => void;
}) {
  return (
    <div className="flex flex-row border rounded-xl px-2 py-1 w-full items-center">
      <div className="flex-1 flex flex-col ml-7">
        <label>{article.name}</label>
        <label>{article.amount}</label>
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => onRemove(article.name)}
        >
          <CheckCircleIcon />
          Abhaken
        </Button>
      </div>
    </div>
  );
}

export default ArticleCard;
