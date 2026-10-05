import "./App.css";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@base-ui/react";
import { CheckCircleIcon } from "lucide-react";
import { useState, memo, useRef } from "react";
import {
  ArticleConflictDialog,
  type PendingArticle,
} from "./components/ArticleConflictDialog";

type Article = {
  amount: number;
  name: string;
};

const storageKey = "articleList";
const defaultName = "Esel";
const defaultAmount = 3;

function saveArticleList(list: Article[]) {
  localStorage.setItem(storageKey, JSON.stringify(list));
}

function loadArticleList(): Article[] {
  const list = localStorage.getItem(storageKey);
  if (!list) return [];
  return JSON.parse(list);
}

const ArticleCard = memo(function ArticleCard({
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
});

function App() {
  const [list, setList] = useState<Article[]>(loadArticleList());

  const [amount, setAmount] = useState<string>(defaultAmount?.toString() ?? "");
  const [name, setName] = useState<string>(defaultName);
  const parsedAmount = Number(amount);
  const isButtonDisabled =
    !name || !amount || parsedAmount <= 0 || name.length < 3;
  const [pendingArticle, setPendingArticle] = useState<PendingArticle | null>(
    null,
  );
  const amountInputRef = useRef<HTMLInputElement>(null);

  function addNewArticle() {
    console.log(addNewArticle);

    const trimmedName = name.trim();

    const existingArticle = list.find(
      (item) => item.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (existingArticle) {
      const pendingArticleTemp: PendingArticle = {
        ...existingArticle, // Kopiert 'name' und 'amount' (als currentAmount)
        currentAmount: existingArticle.amount,
        addAmount: parsedAmount,
      };
      setPendingArticle(pendingArticleTemp);
    } else {
      setList([...list, { amount: parsedAmount, name: name?.trim() }]);
    }
    clearInputs();
  }

  function confirmIncrease(
    article: PendingArticle | null,
    targetAmount: number,
  ): void {
    if (!article) return;

    toast("Artikel existierte bereits! Menge wurde neu gesetzt!");

    setList((prevList) =>
      prevList.map((item) =>
        item.name === article.name ? { ...item, amount: targetAmount } : item,
      ),
    );

    saveArticleList(list);
  }

  function clearInputs(): void {
    setAmount(defaultAmount?.toString() ?? "");
    setName(defaultName);
    selectAmount();
  }
  function handleRemove(name: string) {
    const newList = list.filter((article: Article) => article.name !== name);
    setList(newList);
    saveArticleList(newList);
    toast(`"${name}" wurde von der Liste entfernt!`);
    selectAmount();
  }

  function selectAmount() {
    amountInputRef.current?.focus();
    amountInputRef.current?.select();
  }

  return (
    <>
      <Toaster
        position="top-center"
        closeButton={true}
        toastOptions={{
          classNames: {
            closeButton: "!left-auto !right-2 !top-2 !transform-none",
          },
        }}
      />
      <div className="flex flex-col items-center h-screen mt-8">
        <Label className="text-2xl">Einkaufsliste</Label>
        <div className="flex flex-row gap-4 px-20 pt-3 pb-2">
          <Input
            ref={amountInputRef}
            placeholder="Menge"
            className="w-30/100 text-right border-b-1 px-1"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input
            placeholder="Name"
            className="flex-1 border-b-1 px-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="w-full px-18 mb-3">
          <Button
            className="w-full cursor-pointer"
            disabled={isButtonDisabled}
            onClick={addNewArticle}
          >
            {" "}
            Hinzufügen
          </Button>
        </div>

        <div className="flex flex-col w-full px-10 gap-2">
          {list.map((article: Article) => (
            <ArticleCard
              key={article.name}
              article={article}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </div>

      <ArticleConflictDialog
        key={pendingArticle?.name ?? "no-conflict"}
        pendingArticle={pendingArticle}
        onConfirm={(targetAmount: number) => {
          confirmIncrease(pendingArticle, targetAmount);
          setPendingArticle(null);
        }}
        onCancel={() => {
          setPendingArticle(null);
          clearInputs();
        }}
      />
    </>
  );
}

export default App;
