export default function Dashboard() {
  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold">لوحة التحكم</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500">إجمالي الإيرادات (الشهر)</div>
          <div className="text-2xl font-bold">—</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500">إجمالي المصروفات (الشهر)</div>
          <div className="text-2xl font-bold">—</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500">آخر نسخة احتياطية</div>
          <div className="text-2xl font-bold">—</div>
        </div>
      </div>
    </main>
  );
}

