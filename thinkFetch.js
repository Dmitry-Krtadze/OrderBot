const accessToken = "4aec01d2cbf747275da7922d16ae5741";

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

submitOrder.addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const telegram = document.getElementById('phone').value;
    const Comment = document.getElementById('Comment').value;
    const color = document.getElementById('color').value;

    if (!name || !phone) {
        alert('Будь ласка, заповніть всі поля.');
        return;
    }

    // Здесь отправка данных на сервер или API
    console.log(`Замовлено модель ID: ${submitOrder.dataset.id}`);
    console.log(`Ім'я: ${name}, Телефон: ${phone}`);

    alert('Ваше замовлення прийнято!');
    modal.style.display = 'none';


    // Сообщение для бота
    const message = `Нове замовлення на 3D-друк:\nІм'я: ${name}\nКонтакт: ${telegram}\nКолір: ${color}\Коментар: ${Comment}`;
    fetch(`https://api.telegram.org/bot7332798600:AAGnnjy_jVsk71rSMIon3ynM8ZuYmGf6YkE/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: '1061513902',
                text: message + `\nПосилання на модель: https://www.thingiverse.com/thing:${submitOrder.dataset.id}`
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

});