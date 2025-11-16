import React from 'react';
import PhoneNumberInput, { type PhoneNumberProps } from './components/PhoneNumberInput';
import styles from './App.module.css';

const App: React.FC = () => {
    const [phone, setPhone] = React.useState<PhoneNumberProps>({ code: null, number: null });
    return (
        <div className={styles.container}>
            {/* <h1 className={styles.title}>Countries Library</h1> */}
            <PhoneNumberInput phone={phone} setPhone={setPhone} />
        </div>
    );
};

export default App;
