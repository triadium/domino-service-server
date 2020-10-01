# Domino Server Demo

## Description

Данный прототип разрабатывался для демонстрации возможностей новой архитектуры (скорости, модульности) и как отправная точка перехода издательства на новую систему.

Основой для прототипа является *NestJs*

Здесь представлены результаты работы 3-х месяцев, за которые были реализованы следующие части системы:

 * Минимальная JWT авторизация
 * Загрузка конфигураций частей сервера
 * Система распределения нагрузки чтения/записи через REDIS очереди
 * Система процессоров - что-то между микросервисами и веб контроллерами
 * Генерация кода конфигурации для базы данных на основании описания в виде мета-данных
 * Генерация кода для фронт части на основании описания в виде мета-данных

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
npm run start:prod
```
