document.querySelectorAll('input[name="fileOption"]').forEach(function(elem) {
    elem.addEventListener('change', function() {
        if (document.getElementById('upload').checked) {
            document.getElementById('fileUpload').style.display = 'block';
            document.getElementById('fileUrl').style.display = 'none';
        } else {
            document.getElementById('fileUpload').style.display = 'none';
            document.getElementById('fileUrl').style.display = 'block';
        }
    });
});

function sendOrder() {
    const name = document.getElementById('name').value;
    const telegram = document.getElementById('telegram').value;
    const color = document.getElementById('color').value;
    const fileOption = document.querySelector('input[name="fileOption"]:checked').value;

    let fileData;
    let formData = new FormData(); // FormData для отправки файла

    // Проверка на наличие файла или ссылки на Thingiverse
    if (fileOption === 'upload') {
        fileData = document.getElementById('fileUpload').files[0];
        if (!fileData) {
            alert('Будь ласка, завантажте файл.');
            return;
        }
        formData.append('document', fileData);
    } else {
        fileData = document.getElementById('fileUrl').value;
        if (!fileData.startsWith('https://www.thingiverse.com/')) {
            alert('Будь ласка, надайте дійсне посилання на Thingiverse.');
            return;
        }
    }

    // Сообщение для бота
    const message = `Нове замовлення на 3D-друк:\nІм'я: ${name}\nКонтакт: ${telegram}\nКолір: ${color}`;
    
    // Если отправляется ссылка
    if (fileOption === 'url') {
        fetch(`https://api.telegram.org/bot7332798600:AAGnnjy_jVsk71rSMIon3ynM8ZuYmGf6YkE/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: '1061513902',
                text: message + `\nПосилання на модель: ${fileData}`
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
    } else {
        // Если отправляется файл
        formData.append('chat_id', '1061513902');
        formData.append('caption', message);

        fetch(`https://api.telegram.org/bot7332798600:AAGnnjy_jVsk71rSMIon3ynM8ZuYmGf6YkE/sendDocument`, {
            method: 'POST',
            body: formData
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
}
