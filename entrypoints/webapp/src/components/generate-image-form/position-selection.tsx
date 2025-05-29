import bottomIcon from '../../assets/icons/position/bottom.png';
import topIcon from '../../assets/icons/position/top.png';
import jungleIcon from '../../assets/icons/position/jungle.png';
import utilityIcon from '../../assets/icons/position/utility.png';
import middleIcon from '../../assets/icons/position/middle.png';
import type { IPosition } from '../../types/position';

interface PositionSelectionProps {
  onChange?: (position: IPosition) => void;
}

export function PositionSelection({ onChange }: PositionSelectionProps) {
  return (
    <div className="flex shadow-lg w-full">
      <Position icon={topIcon} label="top" onSelect={onChange} />
      <Position icon={jungleIcon} label="jungle" onSelect={onChange} />
      <Position icon={middleIcon} label="mid" isDefault onSelect={onChange} />
      <Position icon={bottomIcon} label="bottom" onSelect={onChange} />
      <Position icon={utilityIcon} label="support" onSelect={onChange} />
    </div>
  );
}

interface PositionProps {
  icon: string;
  label: IPosition;
  isDefault?: boolean;
  isDisabled?: boolean;
  onSelect?: (label: IPosition) => void;
}

function Position({
  icon,
  label,
  isDefault,
  isDisabled,
  onSelect,
}: PositionProps) {
  return (
    <label className="flex flex-1 min-w-fit items-center justify-center gap-2 bg-white/15 has-checked:bg-selected px-4 py-2 first:rounded-l-xl last:rounded-r-xl cursor-pointer not-has-disabled:not-has-checked:hover:bg-white/20 border border-accent/20 border-r-0 last:border-r has-disabled:cursor-not-allowed has-disabled:opacity-50">
      <input
        type="radio"
        name="position"
        value={label.toLowerCase()}
        className="hidden peer"
        defaultChecked={isDefault}
        disabled={isDisabled}
        required
        onChange={() => onSelect?.(label)}
      />
      <img src={icon} alt={label} className="md:w-8 w-6" />
      <span className="text-lg font-medium text-white/80 peer-checked:text-white peer-checked:font-semibold capitalize hidden md:block">{label}</span>
    </label>
  );
}
