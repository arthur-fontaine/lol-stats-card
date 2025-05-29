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
    <div className="flex shadow-lg">
      <Position icon={topIcon} label="top" isDisabled onSelect={onChange} />
      <Position icon={jungleIcon} label="jungle" isDisabled onSelect={onChange} />
      <Position icon={middleIcon} label="mid" isDefault onSelect={onChange} />
      <Position icon={bottomIcon} label="bottom" isDisabled onSelect={onChange} />
      <Position icon={utilityIcon} label="support" isDisabled onSelect={onChange} />
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
    <label className="flex items-center gap-2 bg-white/15 has-checked:bg-selected px-4 py-2 first:rounded-l-xl last:rounded-r-xl cursor-pointer not-has-disabled:not-has-checked:hover:bg-white/20 border border-accent/20 border-r-0 last:border-r has-disabled:cursor-not-allowed has-disabled:opacity-50">
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
      <img src={icon} alt={label} className="w-8" />
      <span className="text-lg font-medium text-white/80 peer-checked:text-white peer-checked:font-semibold capitalize">{label}</span>
    </label>
  );
}
