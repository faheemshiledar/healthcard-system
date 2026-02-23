import { useState } from 'react';

export default function TagInput({ value = [], onChange, placeholder, badgeClass }) {
  const [input, setInput] = useState('');

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput('');
  };

  const remove = (item) => onChange(value.filter(v => v !== item));

  return (
    <div className="tag-input-wrapper min-h-[48px]">
      {value.map(item => (
        <span key={item} className={`${badgeClass || 'badge-condition'} cursor-pointer`} onClick={() => remove(item)}>
          {item} <span className="opacity-50 hover:opacity-100 ml-1">×</span>
        </span>
      ))}
      <input
        className="flex-1 min-w-[120px] bg-transparent text-slate-100 placeholder-slate-600 text-sm outline-none"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); }
          if (e.key === 'Backspace' && !input && value.length) remove(value[value.length - 1]);
        }}
        placeholder={value.length ? '' : placeholder}
      />
    </div>
  );
}
