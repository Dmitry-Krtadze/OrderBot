
document.getElementById('fileOption').addEventListener('change', function(e) {
    if (document.getElementById('upload').checked) {
        document.getElementById('fileUpload').style.display = 'block';
        document.getElementById('fileUrl').style.display = 'none';
    } else {
        document.getElementById('fileUpload').style.display = 'none';
        document.getElementById('fileUrl').style.display = 'block';
    }
});

function sendOrder() {
    const name = document.getElementById('name').value;
    const telegram = document.getElementById('telegram').value;
    const color = document.getElementById('color').value;
    let fileOption = document.querySelector('input[name="fileOption"]:checked').value;
    let fileData;

    if (fileOption === 'upload') {
        fileData = document.getElementById('fileUpload').files[0];
    } else {
        fileData = document.getElementById('fileUrl').value;
    }

    const message = `Нове замовлення на 3D-друк:
Ім'я: ${name}
Контакт: ${telegram}
Колір: ${color}
Дані: ${fileData}`;

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
