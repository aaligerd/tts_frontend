import React, { useState } from 'react';

function Upload() {
    const [title, setTitle] = useState('');
    const [textToSpeech, setTextToSpeech] = useState('');
    const [loading, setLoading] = useState(false);
    const [qrData, setQrData] = useState(null);
    const [audioData, setAudioData] = useState(null);
    const styles = {
        container: {
            maxWidth: '600px',
            margin: '50px auto',
            padding: '30px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
        },
        fieldGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
        },
        label: {
            fontSize: '14px',
            fontWeight: '500',
            color: '#333',
        },
        required: {
            color: '#e74c3c',
            marginLeft: '4px',
        },
        input: {
            padding: '10px 12px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            outline: 'none',
            transition: 'border-color 0.2s',
        },
        textarea: {
            padding: '10px 12px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            outline: 'none',
            minHeight: '120px',
            resize: 'vertical',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s',
        },
        button: {
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '500',
            color: '#ffffff',
            backgroundColor: '#3498db',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            marginTop: '10px',
        },
        loader: {
            marginTop: '20px',
            textAlign: 'center',
            fontWeight: '500',
            color: '#3498db',
        },
        imageContainer: {
            textAlign: 'center',
            marginTop: '30px',
        },
        image: {
            width: '200px',
            height: '200px',
            objectFit: 'contain',
            border: '1px solid #ddd',
            borderRadius: '8px',
        },
        downloadBtn: {
            display: 'inline-block',
            marginTop: '15px',
            padding: '10px 20px',
            backgroundColor: '#2ecc71',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: '500',
        },
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setQrData(null);

        const formData = new FormData(e.target);
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        const raw = JSON.stringify(Object.fromEntries(formData));

        try {
            const response = await fetch('http://localhost:5050/s1/api/v1/tts/create', {
                method: 'POST',
                headers: myHeaders,
                body: raw,
            });

            if (response.status === 200) {
                const data = await response.json();
                setQrData(data.qr);
                setAudioData(data.audio);
            } else {
                throw new Error('The text-to-speech service is down');
            }
        } catch (error) {
            alert(error.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputFocus = (e) => {
        e.target.style.borderColor = '#3498db';
    };

    const handleInputBlur = (e) => {
        e.target.style.borderColor = '#ddd';
    };

    const handleButtonHover = (e) => {
        e.currentTarget.style.backgroundColor = '#2980b9';
    };

    const handleButtonLeave = (e) => {
        e.currentTarget.style.backgroundColor = '#3498db';
    };

    return (
        <div style={styles.container}>
            <form style={styles.form} onSubmit={handleSubmit}>
                <div style={styles.fieldGroup}>
                    <label style={styles.label} htmlFor="title">
                        Title<span style={styles.required}>*</span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        style={styles.input}
                        name="title"
                        required
                    />
                </div>

                <div style={styles.fieldGroup}>
                    <label style={styles.label} htmlFor="textToSpeech">
                        Text-to-speech<span style={styles.required}>*</span>
                    </label>
                    <textarea
                        id="textToSpeech"
                        value={textToSpeech}
                        onChange={(e) => setTextToSpeech(e.target.value)}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        style={styles.textarea}
                        name="text"
                        required
                    />
                </div>

                <button
                    type="submit"
                    style={styles.button}
                    onMouseEnter={handleButtonHover}
                    onMouseLeave={handleButtonLeave}
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Submit'}
                </button>
            </form>

            {loading && <div style={styles.loader}>Processing... Please wait ⏳</div>}

            {qrData && audioData && (
                <div style={styles.imageContainer}>
                    <audio controls>
                        <source src={audioData.url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                    <h3>Generated QR Image</h3>
                    <img src={qrData.url} alt="Generated QR" style={styles.image} />
                    <br />
                    <a href={qrData.url} download={qrData.key} style={styles.downloadBtn}>
                        Download Image
                    </a>
                </div>
            )}
        </div>
    );
}

export default Upload;
