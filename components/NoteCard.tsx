const NoteCard = ({ index, title, content }: any) => {
  const trimContent = (content: string, x: number) => {
    const words = content.split(' ');
    let trimmedContent = '';
    let count = 0;

    for (const word of words) {
      if (count + word.length <= x) {
        trimmedContent += word + ' ';
        count += word.length;
      } else {
        break;
      }
    }

    trimmedContent = trimmedContent.trim();
    return trimmedContent + (count < content.length ? '...' : '');
  };
  return (
    <div
      className={`justify-start items-center flex rounded-2xl hover:shadow-xl hover:shadow-active p-0.5`}
      key={index}
    >
      <div
        className={`sm:px-6 px-4 sm:py-6 py-4 flex flex-row gap-4 items-center`}
      >
        <div
          className="text-active font-bold md:text-[18px] border rounded-full p-1 sm:text-[16px] max-sm:text-[16px] text-center"
          onClick={() => console.log('post deleted')}
        >
          ❌
        </div>
        <p className="text-active font-bold md:text-[20px] sm:text-[18px] max-sm:text-[18px] text-center">
          {title}
        </p>
        <p className="max-sm:hidden text-secondary font-semibold md:text-[14px] sm:text-[12px] max-sm:text-[12px] text-center">
          {trimContent(content, 12)}
        </p>
        <p className="sm:hidden text-secondary font-semibold md:text-[14px] sm:text-[12px] max-sm:text-[12px] text-center">
          {trimContent(content, 28)}
        </p>
      </div>
    </div>
  );
};
export default NoteCard;

export const AddNoteCard = () => {
  return (
    <div
      className={`justify-start items-center flex active:shadow-inner active:shadow-active select-none `}
    >
      <div
        className={`sm:px-6 px-4 sm:py-6 py-4 flex flex-row gap-4 items-center`}
      >
        <div className="text-active font-bold md:text-[18px] border rounded-full p-1 sm:text-[16px] max-sm:text-[16px] text-center">
          {'➕'}
        </div>
        <p className="text-active font-bold md:text-[20px] sm:text-[18px] max-sm:text-[18px] text-center">
          Add Notes
        </p>
      </div>
    </div>
  );
};
