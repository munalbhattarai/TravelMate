import React, { useState, useRef, useEffect } from 'react';

export default function CustomSelect({
  value,
  options = [],
  onChange,
  placeholder = 'Select option...',
  icon = null,
  className = '',
  ariaLabel = 'Select option'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format options
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return { value: opt.value ?? opt.id, label: opt.label ?? opt.name ?? String(opt.value) };
    }
    return { value: opt, label: String(opt) };
  });

  const selectedOpt = normalizedOptions.find((o) => String(o.value) === String(value));

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`custom-dropdown-container ${className}`} ref={containerRef}>
      <button
        type="button"
        className={`custom-dropdown-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        <div className="trigger-left">
          {icon && <span className="trigger-icon">{icon}</span>}
          <span className={`trigger-text ${!selectedOpt ? 'placeholder' : ''}`}>
            {selectedOpt ? selectedOpt.label : placeholder}
          </span>
        </div>
        <span className={`trigger-chevron ${isOpen ? 'open' : ''}`}>▾</span>
      </button>

      {isOpen && (
        <ul className="custom-dropdown-menu" role="listbox">
          {normalizedOptions.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                className={`custom-dropdown-item ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(opt.value)}
              >
                <span>{opt.label}</span>
                {isSelected && <span className="item-check">✓</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
