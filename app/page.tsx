import { TypographyH1 } from '@/components/ui/typography';
import { AddCategoryButton } from './categories';
import { CategoryList } from './categories';

const Home = () => {
  return (
    <main className="w-full h-full flex flex-col items-center justify-center gap-2">
      <TypographyH1>Welcome to Magic Formula!</TypographyH1>

      <AddCategoryButton />

      <CategoryList />
    </main>
  );
};

export default Home;
