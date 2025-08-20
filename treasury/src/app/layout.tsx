import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'نظام الخزينة المحاسبي',
  description: 'نظام محاسبي بنظام قيود مزدوجة مع تسويات الشركاء',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-950">
        <div className="container-ar py-6">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">نظام الخزينة</h1>
            <div className="flex gap-2">
              <a className="btn-outline" href="/projects">المشروعات</a>
              <a className="btn-outline" href="/cashboxes">الخزائن</a>
              <a className="btn-outline" href="/partners">الشركاء</a>
              <a className="btn-outline" href="/partners/settlement">تسوية الشركاء</a>
              <a className="btn-outline" href="/clients">العملاء</a>
              <a className="btn-outline" href="/suppliers">الموردون</a>
              <a className="btn-outline" href="/invoices">الفواتير</a>
              <a className="btn-outline" href="/vouchers">السندات</a>
              <a className="btn-outline" href="/backup">النسخ الاحتياطي</a>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}

