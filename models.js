let modelsArray = [
    2194278,
    1012788,
    2417931,
    5631565,
    4801924,
    5433217,
    4703140,
    1322545,
    2402094,
    2652081,
    2921407,
    2871637,
    6528431,
    4652388,
    5083091,
    711518,
    3396483,
    723297,
    6279676,
    4966820,
    5626039,
    727983,
    1668055,
    1629018,
    722856,
    4486452,
    2738612,
    5152805,
    3857486,
    11825,
    524925,
    5828603,
    3988117,
    295210,
    3005917,
    1329694,
    1129757,
    4976025,
    6688083,
    5977565,
    4138701,
    3411791,
    3445079,
    4611778,
    3840454,
    3486402
];

const accessToken = "4aec01d2cbf747275da7922d16ae5741";
const API_URL = 'https://aromatic-grizzled-dirt.glitch.me/'; // URL вашего сервера
async function WriteModel() {
    const allThings = []; 

    for (el of modelsArray){
        await fetch(`https://api.thingiverse.com/things/${el}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                allThings.push(data);
            })            
    }

    
    
    console.log("Генерация карточек из масива", allThings);
    generateCards(allThings);
}


WriteModel();












function  generateCards(data){
    // Генерация карточек
    const cardsContainer = document.getElementById('cards-container');
    data.forEach(thing => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${thing.thumbnail}" alt="${thing.name}">
            <h3>${thing.name}</h3>
            <button onclick="openModal(${thing.id})">Замовити в один клік</button>
        `;
        cardsContainer.appendChild(card);
    });

    
}


// Управление модальным окном
const modal = document.getElementById('modal');
const submitOrder = document.getElementById('submit-order');

function openModal(id) {
    modal.style.display = 'flex';
    submitOrder.dataset.id = id; // Сохраняем ID модели
}

modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

submitOrder.addEventListener('click', async () => {
    alert('Запит обробляється, зачекайте, будь ласка.');
    const name = document.getElementById('name').value;
    const telegram = document.getElementById('phone').value;
    const comment = document.getElementById('Comment').value;
    const color = document.getElementById('color').value;
    const modelId = submitOrder.dataset.id;

    if (!name || !telegram) {
        alert('Будь ласка, заповніть всі поля.');
        return;
    }

    try {
        // Отправка заказа в CRM
        const crmResponse = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                telegram,
                comment,
                color,
                modelId
            })
        });

        if (!crmResponse.ok) {
            const errorMessage = await crmResponse.text(); // Получаем текст ошибки от сервера
            throw new Error(`Ошибка CRM: ${crmResponse.status} - ${errorMessage}`);
        }

        const crmData = await crmResponse.json();
        console.log('Заказ успешно отправлен в CRM:', crmData);
        alert('Ваше замовлення прийнято!');

        // Отправка сообщения в Telegram
        const message = `Нове замовлення на 3D-друк:\nІм'я: ${name}\nКонтакт: ${telegram}\nКолір: ${color}\nКоментар: ${comment}\nПосилання на модель: https://www.thingiverse.com/thing:${modelId}`;
        const telegramResponse = await fetch(TELEGRAM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message
            })
        });

        if (!telegramResponse.ok) {
            const errorMessage = await telegramResponse.text(); // Получаем текст ошибки от Telegram
            throw new Error(`Ошибка Telegram: ${telegramResponse.status} - ${errorMessage}`);
        }

        const telegramData = await telegramResponse.json();
        console.log('Сообщение успешно отправлено в Telegram:', telegramData);
       
    } catch (error) {
        console.error('Ошибка при отправке заказа в CRM или Telegram:', error);
       
    }

    modal.style.display = 'none'; // Закрываем модальное окно
});