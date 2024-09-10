
function sendOrder() {
    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;
    const description = document.getElementById('description').value;

    const message = `Нове замовлення на 3D-друк:\nІм'я: ${name}\nКонтакт: ${contact}\nОпис моделі: ${description}`;

    fetch(`https://api.telegram.org/bot7332798600:AAGnnjy_jVsk71rSMIon3ynM8ZuYmGf6YkE/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: '1061513902',
            text: message
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            alert('Замовлення успішно надіслано!');
        } else {
            alert('Помилка при надсиланні замовлення. Спробуйте ще раз.');
        }
    })
    .catch(error => {
        console.error('Помилка:', error);
        alert('Виникла помилка при надсиланні замовлення.');
    });
}
