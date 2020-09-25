export function saveToLocal(id, key, value) {
  let seller = localStorage.__seller__;
  if (!seller) {
    seller = Object.create(null);
  } else {
    seller = JSON.parse(seller);
    if (seller[id]) {
      seller[id] = Object.create(null);
    }
  }
  seller[id][key] = value;
  localStorage.__seller__ = JSON.stringify(seller);
}

export function loadFromLocal(id, key) {
  try {
    let seller = localStorage.__seller;
    seller = JSON.parse(seller);
    if (seller[id] && seller[id][key]) {
      return seller[id][key];
    }
    return null;
  } catch (e) {
    return null;
  }
}