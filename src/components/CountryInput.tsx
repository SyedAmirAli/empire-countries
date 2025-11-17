import React from 'react';
import Country from '../map';
import styles from '../App.module.css';
import type { CountryCode, Country as TCountry } from '../data';

export type PhoneProps = { code?: CountryCode | string | null; number?: string | null };

interface CountryInputProps {
    label?: string;
    required?: string | null;
    placeholder?: string;
    selectedCountry?: Partial<TCountry> | null;
    setSelectedCountry?: React.Dispatch<React.SetStateAction<Partial<TCountry> | null>>;
}
const CountryInput: React.FC<CountryInputProps> = ({
    label,
    placeholder,
    selectedCountry,
    setSelectedCountry,
    required = null,
}) => {
    const countryRef = React.useRef(new Country(null, true));
    const [error, setError] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [countrySearchQuery, setCountrySearchQuery] = React.useState('');

    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const fetchMyCountry = async () => {
            setIsLoading(true);
            try {
                const myCountry = (await countryRef.current.setMyCountry()).getCountry();
                if (setSelectedCountry) {
                    setSelectedCountry(myCountry);
                }

                // set loading and error
                setIsLoading(false);
                setError(countryRef.current.getMyCountryError());
            } catch (error) {
                console.error('Error fetching country:', error);
                setError(error instanceof Error ? error.message : 'Failed to fetch country');
                setIsLoading(false);
            }
        };
        fetchMyCountry();
    }, []);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isDropdownOpen]);

    const getSelectedCountry = countryRef.current.getCountry();

    React.useEffect(() => {
        if (setSelectedCountry) {
            setSelectedCountry(getSelectedCountry);
        }
    }, [getSelectedCountry]);

    React.useEffect(() => {
        if (getSelectedCountry?.code) {
            countryRef.current.setSelectedCountryCode(getSelectedCountry.code);
            setIsLoading(false);
        }
    }, [getSelectedCountry]);

    return (
        <div className={styles.countrySection}>
            <label htmlFor="phone" className={styles.label}>
                {label || 'Country'}{' '}
                {required !== undefined && <span className={styles.required}>{error || required || '*'}</span>}
            </label>
            <div className={styles.countryContainer}>
                <div className={styles.phoneInputWrapper} ref={dropdownRef}>
                    <div className={styles.countryButton}>
                        <button
                            type="button"
                            className={styles.countryButtonInner}
                            onClick={() => {
                                setIsDropdownOpen(!isDropdownOpen);
                                // Sync search query state with ref when opening
                                setCountrySearchQuery(countryRef.current.getSearchQuery());
                                // Clear search when closing
                                setCountrySearchQuery('');
                                countryRef.current.setSearch('');
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                                <i className={styles.flagIcon}>
                                    {selectedCountry ? (
                                        <span
                                            className={styles.flagIcon}
                                            dangerouslySetInnerHTML={{ __html: selectedCountry?.flag || '' }}
                                        />
                                    ) : isLoading ? (
                                        <span className={styles.loadingSpinner}></span>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-earth-icon lucide-earth"
                                        >
                                            <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" />
                                            <path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17" />
                                            <path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" />
                                            <circle cx="12" cy="12" r="10" />
                                        </svg>
                                    )}
                                </i>
                                <span className={styles.countryCode}>
                                    ({selectedCountry ? selectedCountry.code : 'XX'})
                                </span>

                                <span className={styles.countryName}>
                                    {selectedCountry
                                        ? `${selectedCountry.title} - ${selectedCountry.nativeNames?.[0]?.official}`
                                        : placeholder}
                                </span>
                            </div>
                            <div>
                                <svg
                                    className={styles.dropdownIcon}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    style={{
                                        transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.2s',
                                    }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                    ></path>
                                </svg>
                            </div>
                        </button>
                    </div>

                    {/* Dropdown */}
                    {isDropdownOpen && (
                        <div className={styles.dropdown}>
                            <div className={styles.dropdownHeader}>
                                <input
                                    placeholder="Search country..."
                                    className={styles.dropdownSearchInput}
                                    type="text"
                                    value={countrySearchQuery}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setCountrySearchQuery(value);
                                        countryRef.current.setSearch(value);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                            <div className={styles.dropdownList}>
                                {countryRef.current.getAllCountries().map((countryItem) => (
                                    <button
                                        key={countryItem.id}
                                        type="button"
                                        className={styles.countryItem}
                                        onClick={() => {
                                            countryRef.current.setSelectedCountry(countryItem);
                                            setIsDropdownOpen(false);
                                            setCountrySearchQuery('');
                                        }}
                                    >
                                        <i
                                            className={styles.countryItemFlag}
                                            dangerouslySetInnerHTML={{ __html: countryItem.flag }}
                                        />
                                        <div className={styles.countryItemContent}>
                                            <div className={styles.countryItemTitle}>{countryItem.title}</div>
                                            <div className={styles.countryItemDialCode}>{countryItem.dialCode}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CountryInput;
