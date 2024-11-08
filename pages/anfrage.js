import { useRouter } from 'next/router';
import { useState } from 'react';

export default function OrderForm() {
    const router = useRouter();
    const { product } = router.query;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        product: product || '',
        message: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Send data to Joomla API for email processing
        const response = await fetch('https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi&task=anfrage&format=json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const result = await response.json();

        if (response.ok && result.success) {
            setIsSubmitted(true);
            setErrorMessage(''); // Clear any previous error message
            console.log("Mail Response:", response.message);
            console.log("Mail Result:",result.success);
        } else {
            console.log("Mail Result-Error:",result.error);
            setErrorMessage('There was an error submitting the form. Please try again. ');
        }
    };

    return (
        <div>
            <h1>Order Form</h1>
            {isSubmitted ? (
                <p>Thank you! Your order has been submitted.</p>
            ) : (
                <div>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Name:
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Product:
                            <input
                                type="text"
                                name="product"
                                value={formData.product}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Message:
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </label>
                        <button type="submit">Submit Order</button>
                    </form>
                    {/* Display the error message if there is one */}
                    {errorMessage && (
                        <div className="alert">
                            {errorMessage}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
