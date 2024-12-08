import { icons } from 'lucide-react';

export type TToggleIconProps = {
  isToggled: boolean;
  onClick: () => void;
  icon?: string;
};

export const ToggleIcon: React.FC<TToggleIconProps> = ({
  isToggled,
  onClick,
  icon = 'Star',
}) => {
  const LucideIcon = icons[icon];

  return (
    <LucideIcon
      className="cursor-pointer"
      onClick={onClick}
      size={24}
      color={isToggled ? 'gold' : 'gray'}
      fill={isToggled ? 'yellow' : 'transparent'}
    />
  );
};
