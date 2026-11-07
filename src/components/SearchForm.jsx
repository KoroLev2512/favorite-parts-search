import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands } from '../store/searchSlice';

export default function SearchForm() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.search.brands.status === 'loading');
  const [number, setNumber] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = number.trim();
    if (value) dispatch(fetchBrands(value));
  };

  return (
    <form className="card card-body mb-4" onSubmit={handleSubmit}>
      <label htmlFor="number" className="form-label fw-semibold">
        Шаг 1. Артикул детали
      </label>
      <div className="input-group">
        <input
          id="number"
          className="form-control"
          placeholder="Например, 0189"
          value={number}
          onChange={(event) => setNumber(event.target.value)}
          autoFocus
        />
        <button className="btn btn-primary" type="submit" disabled={!number.trim() || isLoading}>
          {isLoading ? 'Ищем…' : 'Найти'}
        </button>
      </div>
    </form>
  );
}
