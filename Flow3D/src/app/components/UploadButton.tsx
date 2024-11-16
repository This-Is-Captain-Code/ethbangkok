import React, { useState } from 'react';

const UploadButton: React.FC = () => {
    const [copied, setCopied] = useState(false);

    const handleCopyAddress = () => {
        setCopied(true);
    };

    return (
        <button onClick={handleCopyAddress}>
            {copied ? 'Coming Soon!' : 'Upload'}
        </button>
    );
};

export default UploadButton;
