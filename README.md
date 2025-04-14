# Project-Management-Systems

Мини-версия системы управления проектами, разработанная в рамках тестового задания.

## Особенности проекта

- **Стек**: React 18, TypeScript, Vite
- **Маршрутизация**: React Router DOM для навигации
- **Управление состоянием**: React Query для работы с удаленными данными
- **UI компоненты**: Ant Design для стилизованных компонентов
- **Drag-and-Drop**: React DnD для перетаскивания задач
- **Сохранение черновиков**: Локальное хранение незавершенных форм
- **Docker-сборка**: Готовая контейнеризированная среда разработки
- **Проксирование запросов**: Nginx для маршрутизации API
- **Изолированные сервисы**: Отдельные контейнеры для фронтенда и API

## Функциональность

- Просмотр всех задач с возможностью фильтрации
- Просмотр всех досок проектов
- Просмотр доски с задачами, распределенными по статусам
- Создание и редактирование задач через модальное окно
- Изменение статуса задачи через drag-and-drop
- Переход между страницами с открытием деталей задачи

## Технический стек

- **React v18+**
- **TypeScript**
- **React Router DOM** - для роутинга
- **React Query** - для работы с API и кэширования данных
- **Ant Design** - библиотека UI-компонентов
- **React DnD** - для функциональности drag-and-drop
- **Axios** - для HTTP-запросов
- **Vite** - система сборки

## Структура проекта

```
.
├── src/              # Клиентская часть (React)
├── server/           # Серверная часть (подмодуль)
├── docker-compose.yml
├── .gitmodules
└── README.md
```

```
/src
├── api                 # Слой работы с API
├── components          # Переиспользуемые компоненты
├── context             # React контексты
├── hooks               # Кастомные хуки
├── pages               # Страницы приложения
├── styles              # Глобальные стили
├── types               # TypeScript типы
├── utils               # Утилиты
├── App.tsx             # Главный компонент
└── main.tsx            # Точка входа
```

## Начало работы

### Предварительные требования

- Node.js v20
- npm или yarn
- Docker 20.10+ (только для Docker-сборки)
- Docker Compose 1.29+ (только для Docker-сборки)
- Git 2.25+

### Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/TMaltseva/project-management-system.git
cd project-management-system
```

##  Локальная разработка

### Запуск сервера

1. Перейдите в папку сервера и установите зависимости:
```bash
cd server
make initial-start 
```

2. Установите зависимости и запустите:
```bash
make run  # или go run cmd/service/main.go
```
3. Сервер будет доступен на http://localhost:8080

Для полной пересборки используйте make initial-start

### Клиентская часть
1. В отдельном терминале перейдите в папку клиента:
```bash
cd src
```

2. Установите зависимости и запустите:
```bash
npm install
npm run dev
```

3. Клиент будет доступен на http://localhost:3000

## Обоснование выбора технологий

- **TypeScript**: Обеспечивает типизацию, что повышает надежность кода и облегчает рефакторинг.
- **React Query**: Упрощает работу с асинхронными данными, предоставляя встроенный кэш и инвалидацию данных.
- **Ant Design**: Предоставляет богатый набор готовых компонентов с хорошей документацией и кастомизацией.
- **React DnD**: Надежная библиотека для реализации drag-and-drop функциональности.
- **Vite**: Современная система сборки с быстрой разработкой и оптимизированной сборкой.

## Дополнительная функциональность

- **Отмена запросов**: Запросы отменяются при переходе между страницами для экономии ресурсов.
- **Сохранение черновиков**: Формы сохраняются в localStorage при перезагрузке страницы.
- **Оптимистичные обновления**: Интерфейс обновляется до получения ответа от сервера для лучшего UX.

## Автор

- Тамара Мальцева

## Лицензия

MIT