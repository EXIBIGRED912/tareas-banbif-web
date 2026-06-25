export const todayISO = () => new Date().toISOString().slice(0, 10);

export const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export const isOverdue = (endDate?: string, status?: string) => {
  if (!endDate || status === "finalizada") return false;
  return new Date(`${endDate}T23:59:59`) < new Date();
};

export const getMonthDays = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const days = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: startOffset + days }, (_, index) => {
    if (index < startOffset) return null;
    return new Date(year, month, index - startOffset + 1);
  });
};
