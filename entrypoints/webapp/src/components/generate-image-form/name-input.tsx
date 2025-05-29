import { useState } from "react";

interface NameInputProps {
  onSummonerNameChange?: (name: string) => void;
  onTaglineChange?: (tag: string) => void;
}

export function NameInput(props: NameInputProps) {
  const [tagline, setTagline] = useState<string>('');

  return (
    <div className="flex flex-1 px-4 py-2 bg-white border border-accent/20 rounded-lg placeholder:text-black/50 *:focus:outline-none">
      <input
        type="text"
        name="summonerName"
        placeholder="Summoner name"
        className="flex-1 min-w-0"
        onChange={(e) => props.onSummonerNameChange?.(e.target.value)}
        required
      />
      <div className="w-px bg-border mx-2 shrink-0" />
      <span className={`${tagline.length > 0 ? 'text-black/80' : 'text-black/50'} select-none`}>
        #
      </span>
      <input
        type="text"
        name="region"
        placeholder="Tagline"
        className="w-[6ch]"
        minLength={3}
        maxLength={5}
        value={tagline}
        onChange={(e) => {
          let value = e.target.value;
          if (value.startsWith('#')) value = value.slice(1);
          props.onTaglineChange?.(value);
          setTagline(value);
        }}
        required
      />
    </div>
  );
}
