export const isDemoEntityId = (id: string | number): boolean => {
  if (typeof id === 'number') {
    return id < 0;
  }
  const asNumber = Number(id);
  if (!Number.isNaN(asNumber)) {
    return asNumber < 0;
  }
  return id.startsWith('demo-');
};

export const toDemoNumberId = (id: string | number): number | null => {
  if (typeof id === 'number') {
    return id;
  }
  const asNumber = Number(id);
  if (Number.isNaN(asNumber)) {
    return null;
  }
  return asNumber;
};
