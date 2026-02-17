(() => {
  const DIVIDE_BY_ZERO_LABEL = 'Invalid (divide by zero)';

  const parseNumericInput = (rawValue) => {
    const raw = String(rawValue ?? '').trim();
    if (raw === '' || raw === '-') return null;
    let normalized = raw.replace(/[^\d.,\-'\s]/g, '');
    normalized = normalized.replace(/[\s']/g, '');
    if (normalized === '' || normalized === '-') return null;
    const isNegative = normalized.startsWith('-');
    normalized = normalized.replace(/-/g, '');
    const lastDot = normalized.lastIndexOf('.');
    const lastComma = normalized.lastIndexOf(',');
    let decimalSeparator = null;
    if (lastDot >= 0 && lastComma >= 0) {
      decimalSeparator = lastDot > lastComma ? '.' : ',';
    }
    if (decimalSeparator == null && (lastDot >= 0 || lastComma >= 0)) {
      const separator = lastDot >= 0 ? '.' : ',';
      const groups = normalized.split(separator);
      const allThousandsGroups = groups.slice(1).every((g) => g.length === 3);
      if (groups.length > 2 && allThousandsGroups) {
        normalized = groups.join('');
      } else if (groups.length === 2 && groups[1].length === 3) {
        normalized = groups.join('');
      } else if (groups.length > 1) {
        normalized = groups.slice(0, -1).join('') + '.' + groups[groups.length - 1];
      }
    } else if (decimalSeparator != null) {
      const keepIndex = normalized.lastIndexOf(decimalSeparator);
      normalized = normalized
        .split('')
        .filter((char, idx) => {
          if (char !== '.' && char !== ',') return true;
          return idx === keepIndex;
        })
        .join('');
      if (decimalSeparator === ',') normalized = normalized.replace(',', '.');
    } else {
      normalized = normalized.replace(/[.,]/g, '');
    }
    if (!/^\d+(\.\d+)?$/.test(normalized)) return null;
    const num = parseFloat((isNegative ? '-' : '') + normalized);
    return Number.isFinite(num) ? num : null;
  };

  const evaluateRows = (rows) => {
    let runningTotal = 0;
    let hasDivisionByZero = false;
    return (rows || []).map((row) => {
      const parsedValue = parseNumericInput(row.value);
      const numericVal = parsedValue == null ? 0 : parsedValue;
      let displayTotal = runningTotal;
      let divByZero = false;
      let invalidResult = false;
      if (row.operator !== 'eq') {
        switch (row.operator) {
          case 'add':
            runningTotal += numericVal;
            break;
          case 'sub':
            runningTotal -= numericVal;
            break;
          case 'mul':
            runningTotal *= numericVal;
            break;
          case 'div':
            if (numericVal !== 0) runningTotal /= numericVal;
            else {
              divByZero = true;
              hasDivisionByZero = true;
            }
            break;
        }
        displayTotal = runningTotal;
      } else {
        displayTotal = runningTotal;
        if (runningTotal === 0 && numericVal !== 0 && row.prevOperator) {
          switch (row.prevOperator) {
            case 'add':
              displayTotal = numericVal;
              break;
            case 'sub':
              displayTotal = -numericVal;
              break;
            case 'mul':
            case 'div':
              displayTotal = 0;
              break;
          }
        }
        invalidResult = hasDivisionByZero;
      }
      return {
        ...row,
        numericVal,
        displayTotal,
        currentRunningTotal: runningTotal,
        divByZero,
        invalidResult,
      };
    });
  };

  const noteRowsToText = (rows) => {
    const opSymbol = { add: '+', sub: '−', mul: '×', div: '÷', eq: '=' };
    return evaluateRows(rows)
      .map((row) => {
        if (row.operator === 'eq') {
          if (row.invalidResult) return `${opSymbol.eq} ${DIVIDE_BY_ZERO_LABEL}`;
          const safeTotal = Number.isFinite(row.displayTotal) ? parseFloat(row.displayTotal.toFixed(4)) : 0;
          return `${opSymbol.eq} ${safeTotal}`;
        }
        return `${opSymbol[row.operator] || '+'} ${row.value || '0'}`;
      })
      .join('\n');
  };

  const getCardPreview = (rows) => {
    if (!rows || rows.length === 0) return 'Empty';
    let lastResult = null;
    let lastResultInvalid = false;
    const evaluated = evaluateRows(rows);
    for (const row of evaluated) {
      if (row.operator === 'eq') {
        lastResult = row.displayTotal;
        lastResultInvalid = !!row.invalidResult;
      }
    }
    const rowLabel = rows.length === 1 ? '1 row' : rows.length + ' rows';
    if (lastResult != null) {
      if (lastResultInvalid) return `${rowLabel} — Result: ${DIVIDE_BY_ZERO_LABEL}`;
      const fmt = Number.isFinite(lastResult) ? lastResult.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '0';
      return `${rowLabel} — Result: ${fmt}`;
    }
    return rowLabel;
  };

  const formatRoundedNumber = (num) => {
    if (!Number.isFinite(num)) return '0';
    return parseFloat(num.toFixed(4)).toString();
  };

  const formatNumberDisplay = (num) => {
    if (!Number.isFinite(num)) return '0';
    const n = parseFloat(num.toFixed(4));
    return Number.isNaN(n) ? '0' : n.toLocaleString(undefined, { maximumFractionDigits: 4, minimumFractionDigits: 0 });
  };

  const normalizeValueForDisplay = (str) => {
    if (str === '' || str === '-') return str;
    const n = parseNumericInput(str);
    if (n == null) return str;
    return n.toString();
  };

  window.NoteMathCore = {
    DIVIDE_BY_ZERO_LABEL,
    parseNumericInput,
    evaluateRows,
    noteRowsToText,
    getCardPreview,
    formatRoundedNumber,
    formatNumberDisplay,
    normalizeValueForDisplay,
  };
})();
