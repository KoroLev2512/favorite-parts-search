import { useSelector } from 'react-redux';
import SearchForm from './components/SearchForm';
import BrandList from './components/BrandList';
import OffersTable from './components/OffersTable';

export default function App() {
  const { brands, selectedBrand } = useSelector((state) => state.search);

  return (
    <div className="container py-4" style={{ maxWidth: 960 }}>
      <h1 className="h3 mb-1">Подбор запчастей</h1>
      <p className="text-muted mb-4">
        Введите артикул, выберите производителя и получите аналоги с ценами и остатками.
      </p>

      <SearchForm />
      {brands.status !== 'idle' && <BrandList />}
      {selectedBrand && <OffersTable />}
    </div>
  );
}
