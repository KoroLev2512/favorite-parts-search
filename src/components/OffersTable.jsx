import { useDispatch, useSelector } from 'react-redux';
import { fetchOffers } from '../store/searchSlice';
import Loader from './Loader';
import ErrorAlert from './ErrorAlert';

const priceFormat = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });

export default function OffersTable() {
  const dispatch = useDispatch();
  const { number, selectedBrand, offers } = useSelector((state) => state.search);

  if (offers.status === 'loading') return <Loader text="Загружаем аналоги и предложения…" />;

  if (offers.status === 'failed') {
    return (
      <ErrorAlert
        message={offers.error}
        onRetry={() => dispatch(fetchOffers({ number, brand: selectedBrand }))}
      />
    );
  }

  if (!offers.items.length) {
    return <div className="alert alert-secondary">Предложений по этой детали нет.</div>;
  }

  return (
    <div className="card">
      <div className="card-header fw-semibold">
        Аналоги и предложения: {selectedBrand} {number} ({offers.items.length})
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Название</th>
              <th>Производитель</th>
              <th>Артикул</th>
              <th className="text-end">Цена</th>
              <th className="text-end">Остаток</th>
            </tr>
          </thead>
          <tbody>
            {offers.items.map((item, index) => (
              <tr key={`${item.id}-${index}`} className={item.stock ? '' : 'text-muted'}>
                <td>
                  {item.name}
                  {item.isOriginal && <span className="badge text-bg-primary ms-2">искомая</span>}
                </td>
                <td>{item.brand}</td>
                <td>{item.number}</td>
                <td className="text-end text-nowrap">
                  {item.price ? priceFormat.format(item.price) : '—'}
                </td>
                <td className="text-end">{item.stock ? `${item.stock} шт.` : 'нет'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
