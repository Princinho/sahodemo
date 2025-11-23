import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Category } from "@/data/mockData";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link to={`/catalog?category=${encodeURIComponent(category.name)}`}>
      <Card className="group overflow-hidden hover:shadow-large transition-slow cursor-pointer">
        <div className="relative overflow-hidden aspect-[16/9]">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
          <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
            <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
            <p className="text-sm opacity-90 mb-3">{category.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">
                {category.productCount} produits
              </span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-smooth" />
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};
