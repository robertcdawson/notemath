(() => {
  const CARDS_KEY = 'notemath-cards';
  const LEGACY_ROWS_KEY = 'notemath-rows';
  const LEGACY_TITLE_KEY = 'notemath-title';
  const STORAGE_SCHEMA_VERSION = 1;

  const defaultRows = () => [{ id: Date.now(), operator: 'add', value: '', isResult: false }];

  const normalizeRow = (r) => {
    const { label, ...rest } = r;
    return rest;
  };

  const normalizeCard = (c) => {
    const now = Date.now();
    const id = c.id != null ? c.id : now;
    return {
      id,
      title: typeof c.title === 'string' ? c.title.trim().slice(0, 80) : 'Note',
      rows: (c.rows || []).map(normalizeRow).length > 0 ? (c.rows || []).map(normalizeRow) : defaultRows(),
      createdAt: typeof c.createdAt === 'number' ? c.createdAt : c.id != null ? c.id : now,
      updatedAt: typeof c.updatedAt === 'number' ? c.updatedAt : c.id != null ? c.id : now,
      pinned: !!c.pinned,
    };
  };

  const loadCards = () => {
    try {
      const raw = localStorage.getItem(CARDS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        let cards = null;
        if (Array.isArray(parsed) && parsed.length > 0) {
          cards = parsed.map(normalizeCard);
        } else if (parsed && Array.isArray(parsed.cards) && parsed.cards.length > 0) {
          cards = parsed.cards.map(normalizeCard);
        }
        if (cards && cards.length > 0) return cards;
      }
    } catch (_) {}
    return null;
  };

  const saveCards = (cards) => {
    try {
      localStorage.setItem(CARDS_KEY, JSON.stringify({ v: STORAGE_SCHEMA_VERSION, cards }));
    } catch (_) {}
  };

  const migrateFromLegacy = () => {
    try {
      const rowsRaw = localStorage.getItem(LEGACY_ROWS_KEY);
      const titleRaw = localStorage.getItem(LEGACY_TITLE_KEY);
      if (!rowsRaw && !titleRaw) return null;
      const rows = rowsRaw
        ? (() => {
            const parsed = JSON.parse(rowsRaw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed.map(normalizeRow);
            return null;
          })()
        : defaultRows();
      const title =
        titleRaw != null && String(titleRaw).trim() !== '' ? String(titleRaw).trim().slice(0, 80) : 'Note 1';
      const now = Date.now();
      const card = normalizeCard({
        id: now,
        title: title || 'Note 1',
        rows: rows || defaultRows(),
        createdAt: now,
        updatedAt: now,
        pinned: false,
      });
      saveCards([card]);
      localStorage.removeItem(LEGACY_ROWS_KEY);
      localStorage.removeItem(LEGACY_TITLE_KEY);
      return [card];
    } catch (_) {}
    return null;
  };

  const getInitialCards = () => {
    const fromNew = loadCards();
    if (fromNew) return fromNew;
    const fromLegacy = migrateFromLegacy();
    if (fromLegacy) return fromLegacy;
    const now = Date.now();
    return [normalizeCard({ id: now, title: 'Note 1', rows: defaultRows(), createdAt: now, updatedAt: now, pinned: false })];
  };

  const parseBackupFile = (raw) => {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 0) return parsed;
      if (parsed && Array.isArray(parsed.cards)) return parsed.cards;
      return null;
    } catch (_) {
      return null;
    }
  };

  window.NoteMathStorage = {
    CARDS_KEY,
    LEGACY_ROWS_KEY,
    LEGACY_TITLE_KEY,
    STORAGE_SCHEMA_VERSION,
    defaultRows,
    normalizeRow,
    normalizeCard,
    loadCards,
    saveCards,
    migrateFromLegacy,
    getInitialCards,
    parseBackupFile,
  };
})();
