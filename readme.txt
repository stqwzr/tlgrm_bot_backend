npm start

»м€ @recycling_counter_bot

/start - дл€ старта переработки

/end description - конец переработки(/end ƒелал что-то)

/custom dd-mm-year hh:mm hh:mm desription - ручной ввод (/custom 15-10-2017 18:20 19:40 ”становил винду)

/current - дл€ получение данных о переработке за текущий мес€ц

/prev - переработки за пред мес€ц

///////////////////////////////////////api//////////////////////////
GET	localhost:1337/workers
GET	localhost:1337/workers/:id
POST	localhost:1337/workers
DELETE	localhost:1337/workers/:id
UPDATE	localhost:1337/workers/:id