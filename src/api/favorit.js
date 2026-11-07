const API_URL = '/api/hsprice';
const API_KEY = import.meta.env?.VITE_API_KEY || '00000000-0000-0000-0000-000000000001';
const EMPTY_ID = '00000000-0000-0000-0000-000000000000';

async function request(params) {
  const query = new URLSearchParams({ key: API_KEY, ...params });
  let response;
  try {
    response = await fetch(`${API_URL}?${query}`);
  } catch {
    throw new Error('Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Сервер вернул некорректный ответ (код ${response.status}).`);
  }

  if (data?.error) throw new Error(`Ошибка API: ${data.error}`);
  if (!response.ok) throw new Error(`Сервер ответил с ошибкой (код ${response.status}).`);

  // Если деталь не найдена, API возвращает один пустой элемент.
  return (data?.goods ?? []).filter((item) => item.goodsID !== EMPTY_ID && item.brand);
}

export async function searchBrands(number) {
  const goods = await request({ number });
  const brands = new Map();
  goods.forEach((item) => {
    if (!brands.has(item.brand)) {
      brands.set(item.brand, { brand: item.brand, name: item.name, number: item.number });
    }
  });
  return [...brands.values()];
}

export async function searchOffers(number, brand) {
  const goods = await request({ number, brand, analogues: 'on' });
  const original = goods.find((item) => item.brand === brand) ?? goods[0];
  if (!original) return [];
  const analogues = original.analogues ?? [];
  return [{ ...original, isOriginal: true }, ...analogues].map(toOffer);
}

// По документации общую цену брать нельзя: цена берётся со склада.
function toOffer(item) {
  const prices = (item.warehouses ?? [])
    .filter((warehouse) => warehouse.stock > 0 && warehouse.price > 0)
    .map((warehouse) => warehouse.price);

  return {
    id: item.goodsID,
    brand: item.brand,
    number: item.number,
    name: item.name,
    stock: item.count ?? 0,
    price: prices.length ? Math.min(...prices) : null,
    isOriginal: Boolean(item.isOriginal),
  };
}
