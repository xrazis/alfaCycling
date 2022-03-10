CREATE DATABASE IF NOT EXISTS alfa_cycling;
USE alfa_cycling;
DROP TABLE IF EXISTS blogs;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS blogs
(
    id        varchar(10),
    title     varchar(254),
    subtitle  varchar(254),
    image     varchar(254),
    body      text,
    created   datetime DEFAULT CURRENT_TIMESTAMP,
    edited    datetime DEFAULT CURRENT_TIMESTAMP,
    posted_by varchar(24),
    edited_by varchar(24),
    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;

CREATE TABLE IF NOT EXISTS users
(
    id       varchar(10),
    email    varchar(48),
    username varchar(24),
    password varchar(254),
    role     varchar(24) DEFAULT 'user',
    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;

# CREATE TABLE IF NOT EXISTS images
# (
#     id         int UNSIGNED NOT NULL AUTO_INCREMENT,
#     blog_id    int UNSIGNED,
#     post_image varchar(254),
#     PRIMARY KEY (id),
#     FOREIGN KEY (blog_id) REFERENCES blogs (id)
# ) ENGINE = InnoDB
#   DEFAULT CHARSET = latin1
#   AUTO_INCREMENT = 1;
