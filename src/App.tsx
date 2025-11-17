import React from 'react';
import PhoneNumberInput, { type PhoneProps } from './components/PhoneNumberInput';
import { Country } from './data';
import CountryInput from './components/CountryInput';

const App: React.FC = () => {
    const [phone, setPhone] = React.useState<PhoneProps>({ code: null, number: null });
    const [selectedCountry, setSelectedCountry] = React.useState<Partial<Country> | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitError, setSubmitError] = React.useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = React.useState(false);

    // Mock API call function
    const mockApiCall = async (data: { phone: PhoneProps; country: Partial<Country> | null }): Promise<void> => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Simulate random success/failure for demo
        if (Math.random() > 0.2) {
            // Success
            return Promise.resolve();
        } else {
            // Failure
            throw new Error('API request failed. Please try again.');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            await mockApiCall({ phone, country: selectedCountry });
            setSubmitSuccess(true);
            // Reset form after successful submission
            setTimeout(() => {
                handleReset();
                setSubmitSuccess(false);
            }, 2000);
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setPhone({ code: null, number: null });
        setSelectedCountry(null);
        setSubmitError(null);
        setSubmitSuccess(false);
    };

    const handleCancel = () => {
        handleReset();
    };

    return (
        <div className="app-container">
            <form className="form-container" onSubmit={handleSubmit}>
                <div className="form-header">
                    <h1 className="form-title">Contact Information</h1>
                    <p className="form-subtitle">Please fill in your contact details</p>
                </div>

                <div className="form-body">
                    <PhoneNumberInput phone={phone} setPhone={setPhone} />
                    <CountryInput selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
                </div>

                {submitError && (
                    <div className="form-error">
                        <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        {submitError}
                    </div>
                )}

                {submitSuccess && (
                    <div className="form-success">
                        <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        Form submitted successfully!
                    </div>
                )}

                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={isSubmitting}>
                        Reset
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <span className="btn-spinner"></span>
                                Submitting...
                            </>
                        ) : (
                            'Submit'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default App;
