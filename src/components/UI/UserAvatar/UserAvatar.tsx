/**
 * Аватар пользователя
 * - иконка пользователя по-умолчанию
 */

import { UserRoundIcon } from 'lucide-react';

interface UserAvatarProps {
  className?: string;
}

const UserAvatar = ({ className = '' }: UserAvatarProps) => {
  return (
    <span
      className={`${className} flex shrink-0 items-end p-1 justify-center rounded-full bg-linear-to-b from-[#7cb7f2] to-[#3390ec] text-sm font-medium text-white`}
    >
      <UserRoundIcon className='w-[80%] h-[80%]' />
    </span>
  );
};

export default UserAvatar;
