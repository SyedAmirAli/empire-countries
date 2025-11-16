import React from 'react';
import Country from '../map';
import styles from '../App.module.css';
import type { CountryCode } from '../data';

export type PhoneProps = { code?: CountryCode | string | null; number?: string | null };

interface PhoneNumberInputProps {
    phone?: PhoneProps;
    setPhone?: React.Dispatch<React.SetStateAction<PhoneProps>>;
}
const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({ phone, setPhone }) => {
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
                if (setPhone) {
                    setPhone({
                        code: myCountry?.dialCode || null,
                        number: null,
                    });
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

    const selectedCountry = countryRef.current.getCountry();

    React.useEffect(() => {
        if (setPhone) {
            setPhone({
                ...phone,
                code: selectedCountry?.dialCode || null,
            });
        }
    }, [selectedCountry]);

    React.useEffect(() => {
        if (phone?.code) {
            countryRef.current.setSelectedCountryByFind({ dialCode: phone.code });
            setIsLoading(false);
        }
    }, [phone]);

    return (
        <div className={styles.phoneSection}>
            <label htmlFor="phone" className={styles.label}>
                Phone number <span className={styles.required}>{error || '*'}</span>
            </label>
            <div className={styles.phoneContainer}>
                <div className={styles.phoneInputWrapper} ref={dropdownRef}>
                    <div className={styles.countryButton}>
                        <button
                            type="button"
                            className={styles.countryButtonInner}
                            onClick={() => {
                                setIsDropdownOpen(!isDropdownOpen);
                                if (!isDropdownOpen) {
                                    // Sync search query state with ref when opening
                                    setCountrySearchQuery(countryRef.current.getSearchQuery());
                                } else {
                                    // Clear search when closing
                                    setCountrySearchQuery('');
                                    countryRef.current.setSearch('');
                                }
                            }}
                        >
                            <i className={styles.flagIcon}>
                                {selectedCountry ? (
                                    <span
                                        className={styles.flagIcon}
                                        dangerouslySetInnerHTML={{ __html: selectedCountry.flag }}
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
                                {selectedCountry ? selectedCountry.dialCode : '+000'}
                            </span>
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
                        </button>
                    </div>

                    <input
                        type="tel"
                        id="phone"
                        placeholder="Enter phone number"
                        required
                        className={styles.phoneInput}
                        value={phone?.number || ''}
                        onChange={(e) => {
                            if (setPhone) {
                                setPhone({
                                    ...phone,
                                    number: e.target.value,
                                });
                            }
                        }}
                    />

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

export default PhoneNumberInput;
