import Image from 'next/image';

export const Card = ({ title, bookmark, date }: { title: string, bookmark: string, date: string }) => (
    <div className="w-full sm:w-[350px] mb-[20px] max-w-full">
      <button className="mb-[20px] bg-[#241730] transition-all duration-200 w-full h-[217px] rounded-[6px] border border-1 border-[#292929] flex justify-center items-center">
        {/* Placeholder for Image */}
      </button>
      <div className="flex justify-between relative px-2">
        <div>{title} <span className="gradient text-[16px]">Pro</span></div>
        <Image alt="bookmark" src={bookmark} />
      </div>
      <div className="px-2 text-[14px] text-[#7E7F81]">{`— Added ${date}`}</div>
    </div>
  );