import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands, fetchOffers } from '../store/searchSlice';
import Loader from './Loader';
import ErrorAlert from './ErrorAlert';

export default function BrandList() {
  const dispatch = useDispatch();
  const { number, brands, selectedBrand } = useSelector((state) => state.search);

  if (brands.status === 'loading') return <Loader text="Ищем производителей…" />;

  if (brands.status === 'failed') {
    return <ErrorAlert message={brands.error} onRetry={() => dispatch(fetchBrands(number))} />;
  }

  if (!brands.items.length) {
    return (
      <div className="alert alert-secondary">
        По артикулу «{number}» ничего не найдено. Проверьте номер детали.
      </div>
    );
  }

  return (
    <div className="card card-body mb-4">
      <div className="fw-semibold mb-2">Шаг 2. Выберите производителя</div>
      <div className="list-group">
        {brands.items.map((item) => (
          <button
            key={item.brand}
            type="button"
            className={`list-group-item list-group-item-action d-flex justify-content-between ${
              item.brand === selectedBrand ? 'active' : ''
            }`}
            onClick={() => dispatch(fetchOffers({ number, brand: item.brand }))}
          >
            <span className="fw-semibold">{item.brand}</span>
            <span className={item.brand === selectedBrand ? '' : 'text-muted'}>
              {item.name} · {item.number}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
