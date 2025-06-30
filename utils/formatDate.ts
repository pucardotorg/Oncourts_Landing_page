export const formatDate = (dateStr?: string | number) => {
  if (!dateStr) return "";

  try {
    const date = new Date(dateStr || "");
    return (
      date.getDate() +
      "-" +
      date.toLocaleString("default", { month: "short" }) +
      "-" +
      date.getFullYear()
    );
  } catch {
    return String(dateStr);
  }
};
