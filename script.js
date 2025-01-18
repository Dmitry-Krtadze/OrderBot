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

async function sendOrder() {
    alert('Запит обробляється, зачекайте, будь ласка. (1-2 хв) НЕ ЗАЧИНЯЙТЕ САЙ');
    const name = document.getElementById('name').value;
    const telegram = document.getElementById('telegram').value;
    const color = document.getElementById('color').value;
    const fileOption = document.querySelector('input[name="fileOption"]:checked').value;

    let fileData;
    let formData = new FormData();

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

    const message = `Нове замовлення на 3D-друк:\nІм'я: ${name}\nКонтакт: ${telegram}\nКолір: ${color}`;

    try {
        if (fileOption === 'url') {
            await fetch(`https://api.telegram.org/bot7332798600:AAGnnjy_jVsk71rSMIon3ynM8ZuYmGf6YkE/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: '-4794328318',
                    text: message + `\nПосилання на модель: ${fileData}`
                })
            });
        } else {
            formData.append('chat_id', '1061513902');
            formData.append('caption', message);

            await fetch(`https://api.telegram.org/bot7332798600:AAGnnjy_jVsk71rSMIon3ynM8ZuYmGf6YkE/sendDocument`, {
                method: 'POST',
                body: formData
            });
        }

        // Отправка заказа в CRM
        const API_URL = 'https://aromatic-grizzled-dirt.glitch.me'; // Замените на ваш URL CRM
        const crmResponse = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                telegram,
                color,
                comment: fileOption === 'url' ? fileData : 'Файл завантажено',
                modelId: fileOption === 'url' ? fileData : 'Файл у телегам'
            })
        });

        if (!crmResponse.ok) {
            const errorMessage = await crmResponse.text();
            throw new Error(`Ошибка CRM: ${crmResponse.status} - ${errorMessage}`);
        }

        const crmData = await crmResponse.json();
        console.log('Заказ успешно отправлен в CRM:', crmData);
        alert('Ваше замовлення прийнято!');
    } catch (error) {
        console.error('Помилка:', error);
        alert('Виникла помилка при надсиланні замовлення. Спробуйте ще раз.');
    }
}

let menu_button = document.querySelector('.header__burger');
let menu_itself = document.querySelector('.header__menu');
let menu_list = document.querySelector('.header__list');
let body = document.querySelector('body');

menu_button.onclick = function() {
  menu_button.classList.toggle('active');
  menu_itself.classList.toggle('active');
  body.classList.toggle('lock');
};

menu_list.onclick = function() {
  menu_button.classList.toggle('active');
  menu_itself.classList.toggle('active');
  body.classList.toggle('lock');
};
