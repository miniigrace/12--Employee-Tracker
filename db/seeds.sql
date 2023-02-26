use employees_db;

INSERT INTO department (name)
VALUES ("Designers"),
       ("Engineering"),
       ("Marketing"),
       ("IT");

INSERT INTO role (title, salary, department_id)
VALUES ("Graphic Artist", 100000, 1),
       ("Graphic Designer", 200000, 1),
       ("Sr. Software Engineeer", 300000, 2),
       ("Software Engineer", 400000, 2),
       ("Account Manager", 500000, 3),
       ("Accountant", 600000, 3),
       ("Programmers", 700000, 4),
       ("System Admin", 800000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mini", "Grace", 1, NULL),
       ("Kaede", "Rukawa", 2, 1),
       ("Hanamichi", "Sakuragi", 3, NULL),
       ("Hisashi", "Mitsui", 4, 3),
       ("Zaraki", "Kenpachi", 5, 3),
       ("Grasha", "Ganda", 6, 5),
       ("Soo Hyun", "Kim", 7, NULL),
       ("Kento", "Yamazaki", 8, 7);
       ('Sheena', 'Doolittle', 7, NULL)
       ('Mona', 'Bart', 7, 8)  