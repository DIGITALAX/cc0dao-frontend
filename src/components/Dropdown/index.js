/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import cn from 'classnames';
import styles from './styles.module.scss';

const Dropdown = ({
  options,
  value,
  onChange,
  ascending,
  multi = false,
  max,
  searchable = false,
  placeholder,
  color = 'pink',
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const onSelect = (v) => {
    onChange(v);
    if (!multi) setOpen(!open);
  };

  const getFilteredList = () => {
    const filtered = options.filter(option => option.toLowerCase().includes(inputValue.toLowerCase()))
    if (ascending) return filtered.sort()
    return filtered
  }

  return (
    <>
      <div className={cn(styles.wrapper, color === 'pink' ? styles.pink : styles.blue)}>
        <div className={styles.main} onClick={() => setOpen(!open)}>
          {searchable ? (
            <input
              className={styles.inputValueWrapper}
              placeholder={value.length ? `${value.length} items selected` : placeholder}
              value={open ? inputValue : ''}
              onChange={(e) => {
                if (!open) return;
                setInputValue(e.target.value);
              }}
            />
          ) : (
            <div className={styles.valueWrapper}>
              {multi
                ? !value.length
                  ? 'Select from Dropdown'
                  : `${value.length} items selected`
                : value}
            </div>
          )}
          <img
            src={
              color === 'pink' ? '/images/dressed/arrow-down.png' : '/images/blue-arrow-down.png'
            }
            alt=""
          />
        </div>
        {open && (
          <div className={styles.dropdown}>
            {
              getFilteredList()
              .map((option, index) => (
                <div className={styles.item} key={index} onClick={() => onSelect(option)}>
                  <div className={styles.optionWrapper}>{option}</div>
                  {multi && (
                    <input
                      type="checkbox"
                      checked={!!value?.find((item) => item === option)}
                      onChange={() => onSelect(option)}
                      className={styles.customCheck}
                    />
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dropdown;
