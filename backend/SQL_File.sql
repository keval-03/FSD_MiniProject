use splitbill;
show tables;


CREATE TABLE MAIN_users( user_id INTEGER PRIMARY KEY AUTO_INCREMENT , user_email VARCHAR(255) UNIQUE, user_password VARCHAR(2048),verified TINYINT);


INSERT INTO MAIN_users (user_email,user_password)
VALUES
('rangwalahussain00@gmail.com','ABCD12345');

SELECT * FROM MAIN_users;

-- DELETE FROM MAIN_users WHERE user_id=17;


CREATE TABLE MAIN_groups(group_id INTEGER PRIMARY KEY AUTO_INCREMENT, group_name VARCHAR(255));

SELECT * FROM MAIN_groups;
 DELETE FROM MAIN_groups WHERE group_id=68;


-- MAIN_user__groups user_id , group_id
CREATE TABLE MAIN_users__groups
(
user_id INTEGER , group_id INTEGER,
FOREIGN KEY (user_id) REFERENCES MAIN_users(user_id), 
FOREIGN KEY (group_id) REFERENCES MAIN_groups(group_id)
 );

 SELECT * FROM MAIN_users__groups;
 DELETE FROM MAIN_users__groups WHERE group_id=64;
-- DROP TABLE MAIN_users__groups 
 
-- INSERT INTO MAIN_groups (group_name) VALUES ("GROUP 2") ;
-- INSERT INTO MAIN_users__groups VALUES (1,2);
 
 -- PROCEDURE FOR FINDING group_id,group_name after providing group_id
 DELIMITER //
 CREATE PROCEDURE get_grp_id_name(IN grp_id INTEGER)
 BEGIN
	SELECT group_id,group_name FROM MAIN_groups WHERE group_id = grp_id;
 END //
 DELIMITER ;
 
 -- CHECKING BY CALLING THE PROCEDURE
-- CALL get_grp_id_name(2);


-- PROCEDURE for finding user_id after giving user_email
DELIMITER //
 CREATE PROCEDURE get_user_id(IN email VARCHAR(255))
 BEGIN
	SELECT user_id FROM MAIN_users WHERE user_email = email;
 END //
 DELIMITER ;
 
 -- CALL get_user_id("rangwalahussain00@gmail.com");
 
 
 
 -- PROCEDURE TO INSERT GROUP_ID AND USER_ID TO MAIN_user__groups
 DELIMITER //
 CREATE PROCEDURE insert_user_id_group_id (IN uid INTEGER, IN gid INTEGER)
 BEGIN
	INSERT INTO MAIN_users__groups VALUES (uid,gid);
 END //
 DELIMITER ;

 -- CALL insert_user_id_group_id(1,1);
 
DROP TABLE buttons_64;
DROP TABLE activities_64;
DROP TABLE announcements_64;
DROP TABLE logs_62;
DROP TABLE members_64;

show tables;
SELECT * FROM buttons_62;
SELECT * FROM activities_62;
SELECT * FROM announcements_62;
SELECT * FROM logs_62;
SELECT * FROM members_62;

-- PROCEDURE TO GET user_email after passing user id
DELIMITER //
CREATE PROCEDURE get_user_name(IN u_id INTEGER)
BEGIN
	SELECT user_email from MAIN_users WHERE user_id=u_id;
END//
DELIMITER ;

-- CALL get_user_name(1);

SELECT NOW();
INSERT INTO activities_62 (activity_name,activity_time,1_pay,1_spent,2_pay,2_spent) VALUES ( "ABC" , '2022-11-11 17:07:54' , 100 , 100 , 100 , 100 );
INSERT INTO activities_62 (activity_name,activity_time,1_pay,1_spent,2_pay,2_spent) VALUES ( "BCD" , '2022-11-11 17:07:54' , 200 , 200 , 200 , 200 );

