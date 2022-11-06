show tables;
drop table MAIN_users;
CREATE TABLE MAIN_users( user_id INTEGER PRIMARY KEY AUTO_INCREMENT , user_email VARCHAR(255) UNIQUE, user_password VARCHAR(2048) );

INSERT INTO MAIN_users (user_email,user_password)
VALUES
('rangwalahussain00@gmail.com','ABCD12345');

SELECT * FROM MAIN_users;