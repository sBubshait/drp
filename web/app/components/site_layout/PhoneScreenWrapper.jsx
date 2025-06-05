export default function PageWrapper({ children }) {
  return (
    <div className="w-full min-h-screen flex justify-center bg-gray-100">
      <div className="w-full  md:max-w-md lg:max-w-2xl min-h-screen bg-gray-200 shadow-lg border border-gray-300 relative">
        {children}
      </div>
    </div>
  );
}