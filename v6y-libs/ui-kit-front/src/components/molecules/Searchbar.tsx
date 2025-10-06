import { Input, Label, MagnifyingGlassIcon } from "../atoms";

interface SearchbarProps {
  onChange?: (value: string) => void;
  value?: string;
}

const Searchbar = ({ onChange, value }: SearchbarProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="project-search" className="text-sm font-medium text-gray-700">
        Search by project name :
      </Label>
      <div className="relative">
        <Input
          id="project-search"
          type="text"
          placeholder="ex: vitality"
          value={value}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange?.(event.target.value)}
          className="pr-10"
        />
        <MagnifyingGlassIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6" />
      </div>
    </div>
  );
};

export { Searchbar };
