CREATE DATABASE IF NOT EXISTS alfa_cycling;
USE alfa_cycling;
DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS blogs;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS blogs
(
    id        int UNSIGNED NOT NULL AUTO_INCREMENT,
    title     varchar(254) NOT NULL,
    subtitle  varchar(254) NOT NULL,
    image     varchar(254) NOT NULL,
    body      text,
    created   datetime DEFAULT CURRENT_TIMESTAMP,
    edited    datetime DEFAULT CURRENT_TIMESTAMP,
    posted_by varchar(24),
    edited_by varchar(24),
    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1
  AUTO_INCREMENT = 1;

CREATE TABLE IF NOT EXISTS images
(
    id         int UNSIGNED NOT NULL AUTO_INCREMENT,
    blog_id    int UNSIGNED,
    post_image varchar(254),
    PRIMARY KEY (id),
    FOREIGN KEY (blog_id) REFERENCES blogs (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1
  AUTO_INCREMENT = 1;

CREATE TABLE IF NOT EXISTS users
(
    id       int UNSIGNED NOT NULL AUTO_INCREMENT,
    email    varchar(48)  NOT NULL,
    username varchar(24)  NOT NULL,
    password varchar(254) NOT NULL,
    role     varchar(24) DEFAULT 'user',
    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1
  AUTO_INCREMENT = 1;
