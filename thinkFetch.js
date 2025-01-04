const accessToken = "4aec01d2cbf747275da7922d16ae5741";
const API_URL = 'https://aromatic-grizzled-dirt.glitch.me/'; // URL вашего сервера
const TELEGRAM_API_URL = 'https://api.telegram.org/bot7332798600:AAGnnjy_jVsk71rSMIon3ynM8ZuYmGf6YkE/sendMessage';
const CHAT_ID = '-4794328318';

// Функция для получения популярных моделей
async function fetchPopularThings(limit = 500) {
    let page = 1; // Начальная страница
    const perPage = 50; // Количество моделей на страницу
    const allThings = []; // Массив для хранения всех моделей

    try {
        while (allThings.length < limit) {
            const url = `https://api.thingiverse.com/popular?page=${page}&per_page=${perPage}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }

            const data = await response.json();

            if (data.length === 0) {
                // Если новых данных нет, прекращаем запросы
                break;
            }

            allThings.push(...data); // Добавляем данные к общему списку
            console.log(`Загружено моделей: ${allThings.length}`);
            page++; // Переходим к следующей странице

            if (allThings.length >= limit) {
                break;
            }
        }

        console.log("Загруженные популярные модели:", allThings);
        generateCards(allThings);
        return allThings.slice(0, limit); // Ограничиваем количество моделей
    } catch (error) {
        console.error("Ошибка при запросе популярных моделей:", error);
        return [];
    }
}

// Вызов функции для получения топ-100 моделей
fetchPopularThings(100);

// Генерация карточек
function generateCards(data) {
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

