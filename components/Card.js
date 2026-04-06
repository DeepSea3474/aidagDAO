export default function Card({ children, className = "" }) {
  return (
    <div
      className={
        "bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-sm " +
        className
      }
    >
      {children}
    </div>
  );
}
