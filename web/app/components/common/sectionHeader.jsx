export default function SectionHeader({ sectionNumber, totalSections, sectionType }) {
  return (
    <div className="flex w-[90%] bg-gray-800 text-white font-semibold text-xl">
      <div className="px-4 py-3 border-r-4 border-gray-200">
        {sectionNumber} / {totalSections}
      </div>
      <div className="px-4 py-3">
        {sectionType}
      </div>
    </div>
  );
}
