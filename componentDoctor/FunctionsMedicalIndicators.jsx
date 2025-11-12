// utils/medicalIndicators.js

import { AVAILABLE_TESTS } from '../componentDoctor/availableTestsindicators';

// ترجع القيم اللي لازم نضيفها على حسب نوع الفحص
export function getInitialValuesForTest(key) {
  if (key === 'FIB4') {
    return {
      FIB4_age: '',
      FIB4_ast: '',
      FIB4_alt: '',
      FIB4_platelets: '',
    };
  }

  if (key === 'APRI') {
    return {
      APRI_ast: '',
      APRI_uln: '',
      APRI_platelets: '',
    };
  }

  // الفحوص العادية
  return {
    [key]: '',
  };
}

// دالة التحليل كاملة: تاخد (tests, values) وترجع مصفوفة نتائج
export function analyzeTests(tests, values) {
  return tests.map(key => {
    let status = '❌ Invalid';

    if (key === 'FIB4') {
      const age = parseFloat(values.FIB4_age);
      const ast = parseFloat(values.FIB4_ast);
      const alt = parseFloat(values.FIB4_alt);
      const plt = parseFloat(values.FIB4_platelets);

      if (![age, ast, alt, plt].some(v => isNaN(v))) {
        const fib4 = (age * ast) / (0.001 * plt * Math.sqrt(alt));
        const val = fib4.toFixed(2);

        if (fib4 < 1.45) status = `${val} - Less probable cirrhosis`;
        else if (fib4 <= 3.25) status = `${val} - Indeterminate`;
        else status = `${val} - More probable cirrhosis`;
      }
    } else if (key === 'APRI') {
      const ast = parseFloat(values.APRI_ast);
      const uln = parseFloat(values.APRI_uln);
      const plt = parseFloat(values.APRI_platelets);

      if (![ast, uln, plt].some(v => isNaN(v))) {
        const apri = ((ast / uln) / plt) * 100;
        status = `${apri.toFixed(2)}%`;
      }
    } else {
      const raw = parseFloat(values[key]);
      if (!isNaN(raw)) {
        switch (key) {
          case 'ALT':
            status = raw > 40 ? 'High' : 'Normal';
            break;
          case 'AST':
            status = raw > 40 ? 'High' : 'Normal';
            break;
          case 'Bilirubin':
            status = raw > 1.2 ? 'High' : 'Normal';
            break;
          case 'INR':
            status = raw > 1.1 ? 'High' : 'Normal';
            break;
          case 'Platelets':
            status = raw < 150 ? 'Low' : 'Normal';
            break;
        }
      }
    }

    return {
      key,
      label: AVAILABLE_TESTS.find(t => t.key === key).label,
      status,
    };
  });
}

// دالة مساعدة لو بدك تشيل نتيجة فحص معيّن
export function removeResultByKey(results, key) {
  return results.filter(r => r.key !== key);
}
