/**
 * Подсказка в чате
 */

interface HintProps {
  className?: string;
  children: React.ReactNode;
}

const Hint = ({ className = '', children }: HintProps) => {
  return (
    <div
      className={`${className} py-1 px-3 text-white bg-[rgba(121,165,65,0.4)] rounded-2xl`}
    >
      {children}
    </div>
  );
};

export default Hint;
