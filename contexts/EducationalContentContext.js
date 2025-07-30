import React, { createContext, useState, useCallback } from 'react';

// Developed by Sami
// Provides in-memory storage for educational contents until backend is integrated.
export const EducationalContentContext = createContext({
  items: [],
  addOrUpdate: () => {},
  remove: () => {},
});

export const EducationalContentProvider = ({ children }) => {
  const [items, setItems] = useState([
    {
      id: 1,
      title: 'نصائح للتغذية الصحية',
      type: 'مقال',
      content: 'تناول الفواكه والخضروات الطازجة يومياً لتعزيز صحة الكبد',
      publishDate: '2025-01-30',
      author: 'د. أحمد محمد'
    },
    {
      id: 2,
      title: 'أهمية الفحوصات الدورية',
      type: 'فيديو',
      content: 'تعرف على أهمية إجراء الفحوصات الدورية لمرضى التهاب الكبد',
      publishDate: '2025-01-28',
      author: 'د. فاطمة علي'
    },
    {
      id: 3,
      title: 'تمارين رياضية آمنة',
      type: 'صورة',
      content: 'مجموعة من التمارين الرياضية المناسبة لمرضى الكبد',
      publishDate: '2025-01-25',
      author: 'د. سارة أحمد'
    }
  ]);

  const addOrUpdate = useCallback((item) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = item;
        return updated;
      }
      return [...prev, item];
    });
  }, []);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return (
    <EducationalContentContext.Provider value={{ items, addOrUpdate, remove }}>
      {children}
    </EducationalContentContext.Provider>
  );
};
